const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const mockAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, 'test_secret');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/reports', mockAuth, (req, res) => {
  res.json([
    { _id: '1', title: 'Broken light', status: 'New', priority: 'Medium', category: 'Electrical', building: 'Main Building' }
  ]);
});

app.post('/api/reports', mockAuth, (req, res) => {
  const { title, category, building, location, description, reportedBy, email } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Title must be at least 3 characters' });
  }
  if (!category) return res.status(400).json({ message: 'Category is required' });
  if (!building) return res.status(400).json({ message: 'Building is required' });
  if (!location) return res.status(400).json({ message: 'Location is required' });
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: 'Description must be at least 10 characters' });
  }
  if (!reportedBy) return res.status(400).json({ message: 'Reporter name is required' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }
  res.status(201).json({ _id: 'new_id', title, category, building, status: 'New' });
});

const testToken = jwt.sign({ id: 'testuser', role: 'user' }, 'test_secret', { expiresIn: '1h' });
const adminToken = jwt.sign({ id: 'adminuser', role: 'admin' }, 'test_secret', { expiresIn: '1h' });

describe('Server Health', () => {
  test('health endpoint returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Authentication Middleware', () => {
  test('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });

  test('returns 401 when token is invalid', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.statusCode).toBe(401);
  });

  test('returns 200 when valid token is provided', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Report Submission Validation', () => {
  const validReport = {
    title: 'Broken heating system',
    category: 'Heating',
    building: 'Main Building',
    location: 'Room 101',
    description: 'The heating has not been working for three days',
    reportedBy: 'John Smith',
    email: 'john@stmarys.ac.uk',
    consentGiven: true
  };

  test('creates report successfully with valid data', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${testToken}`)
      .send(validReport);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.status).toBe('New');
  });

  test('rejects report with title too short', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ ...validReport, title: 'AB' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Title');
  });

  test('rejects report with missing category', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ ...validReport, category: '' });
    expect(res.statusCode).toBe(400);
  });

  test('rejects report with description too short', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ ...validReport, description: 'Too short' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Description');
  });

  test('rejects report with invalid email format', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ ...validReport, email: 'notanemail' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('email');
  });

  test('rejects report with missing building', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ ...validReport, building: '' });
    expect(res.statusCode).toBe(400);
  });
});

describe('Report Data Structure', () => {
  test('reports list returns array', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${testToken}`);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('each report has required fields', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${testToken}`);
    const report = res.body[0];
    expect(report).toHaveProperty('_id');
    expect(report).toHaveProperty('title');
    expect(report).toHaveProperty('status');
    expect(report).toHaveProperty('priority');
    expect(report).toHaveProperty('category');
    expect(report).toHaveProperty('building');
  });

  test('report status is a valid enum value', async () => {
    const validStatuses = ['New', 'In Progress', 'Resolved', 'Closed'];
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${testToken}`);
    res.body.forEach(r => {
      expect(validStatuses).toContain(r.status);
    });
  });
});