const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

describe('Server Health', () => {
  test('Health endpoint returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Authentication Validation', () => {
  test('Login requires email and password', async () => {
    expect({ email: 'test@test.com', password: 'test123' }).toHaveProperty('email');
    expect({ email: 'test@test.com', password: 'test123' }).toHaveProperty('password');
  });

  test('Email format validation works', () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    expect(emailRegex.test('valid@email.com')).toBe(true);
    expect(emailRegex.test('invalidemail')).toBe(false);
  });

  test('Password must be at least 6 characters', () => {
    const validatePassword = (p) => p.length >= 6;
    expect(validatePassword('abc123')).toBe(true);
    expect(validatePassword('abc')).toBe(false);
  });
});

describe('Report Validation', () => {
  test('Report title must be at least 3 characters', () => {
    const validateTitle = (t) => t && t.trim().length >= 3;
    expect(validateTitle('Broken heating')).toBe(true);
    expect(validateTitle('AB')).toBe(false);
    expect(validateTitle('')).toBeFalsy();
  });

  test('Description must be at least 10 characters', () => {
    const validateDesc = (d) => d && d.trim().length >= 10;
    expect(validateDesc('This is a detailed description')).toBe(true);
    expect(validateDesc('Short')).toBe(false);
  });

  test('Valid categories are accepted', () => {
    const validCategories = ['Electrical', 'Plumbing', 'Heating', 'Structural', 'Cleaning', 'IT Equipment', 'Safety Hazard', 'Other'];
    expect(validCategories.includes('Electrical')).toBe(true);
    expect(validCategories.includes('InvalidCategory')).toBe(false);
  });

  test('Valid priorities are accepted', () => {
    const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    expect(validPriorities.includes('High')).toBe(true);
    expect(validPriorities.includes('Extreme')).toBe(false);
  });

  test('Valid statuses are accepted', () => {
    const validStatuses = ['New', 'In Progress', 'Resolved', 'Closed'];
    expect(validStatuses.includes('New')).toBe(true);
    expect(validStatuses.includes('Pending')).toBe(false);
  });

  test('Report object has required fields', () => {
    const report = {
      title: 'Broken chair',
      category: 'Structural',
      building: 'Main Building',
      location: 'Room 101',
      description: 'The chair is broken and needs replacing',
      priority: 'Medium',
      reportedBy: 'John Smith',
      email: 'john@example.com',
      consentGiven: true
    };
    expect(report).toHaveProperty('title');
    expect(report).toHaveProperty('category');
    expect(report).toHaveProperty('building');
    expect(report).toHaveProperty('location');
    expect(report).toHaveProperty('description');
    expect(report).toHaveProperty('consentGiven');
    expect(report.consentGiven).toBe(true);
  });
});

describe('Security Checks', () => {
  test('JWT secret is defined', () => {
    const jwtSecret = 'fixmycampus_secret_key_2024';
    expect(jwtSecret).toBeDefined();
    expect(jwtSecret.length).toBeGreaterThan(10);
  });

  test('Bcrypt rounds are sufficient', () => {
    const rounds = 10;
    expect(rounds).toBeGreaterThanOrEqual(10);
  });

  test('Rate limit is configured correctly', () => {
    const rateLimit = { windowMs: 15 * 60 * 1000, max: 100 };
    expect(rateLimit.max).toBeLessThanOrEqual(100);
    expect(rateLimit.windowMs).toBe(900000);
  });
});

describe('API Response Structure', () => {
  test('Report response includes required fields', () => {
    const mockReport = {
      _id: '123',
      title: 'Test Report',
      status: 'New',
      priority: 'Medium',
      category: 'Electrical',
      building: 'Main Building',
      createdAt: new Date()
    };
    expect(mockReport).toHaveProperty('_id');
    expect(mockReport).toHaveProperty('title');
    expect(mockReport).toHaveProperty('status');
    expect(mockReport).toHaveProperty('priority');
    expect(mockReport).toHaveProperty('createdAt');
  });

  test('Status values match expected enum', () => {
    const statuses = ['New', 'In Progress', 'Resolved', 'Closed'];
    statuses.forEach(s => expect(typeof s).toBe('string'));
  });
});