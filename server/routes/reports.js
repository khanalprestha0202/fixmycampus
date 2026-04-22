const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  getAnalytics, getAllReports, getReportById,
  createReport, updateReport, updateStatus,
  addComment, deleteReport
} = require('../controllers/reportController');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

const validateReport = (req, res, next) => {
  const { title, category, building, location, description, reportedBy, email } = req.body;
  const errors = [];
  if (!title || title.trim().length < 3) errors.push('Title must be at least 3 characters');
  if (!category) errors.push('Category is required');
  if (!building) errors.push('Building is required');
  if (!location || location.trim().length < 2) errors.push('Location is required');
  if (!description || description.trim().length < 10) errors.push('Description must be at least 10 characters');
  if (!reportedBy) errors.push('Reporter name is required');
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('A valid email address is required');
  if (errors.length > 0) return res.status(400).json({ message: errors.join(', ') });
  next();
};

router.get('/stats/analytics', auth, getAnalytics);
router.get('/', auth, getAllReports);
router.get('/:id', auth, getReportById);
router.post('/', auth, validateReport, createReport);
router.put('/:id', auth, updateReport);
router.put('/:id/status', auth, updateStatus);
router.post('/:id/comments', auth, addComment);
router.delete('/:id', auth, adminOnly, deleteReport);

module.exports = router;