const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ message: 'Invalid token' }); }
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
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required');
  if (errors.length > 0) return res.status(400).json({ message: errors.join(', ') });
  next();
};

router.get('/stats/analytics', auth, async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const byStatus = await Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const byCategory = await Report.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const byBuilding = await Report.aggregate([{ $group: { _id: '$building', count: { $sum: 1 } } }]);
    const byPriority = await Report.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
    res.json({ total, byStatus, byCategory, byBuilding, byPriority });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const { status, category, building, priority } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (building) filter.building = building;
    if (priority) filter.priority = priority;
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, validateReport, async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const update = req.body;
    if (update.status === 'Resolved') update.resolvedAt = new Date();
    const oldReport = await Report.findById(req.params.id);
    const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true });
    if (update.status && update.status !== oldReport.status) {
      const { sendStatusUpdateEmail } = require('../utils/emailService');
      sendStatusUpdateEmail(report.title, report.email, update.status, report._id);
    }
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    report.comments.push({ text: req.body.text, addedBy: req.body.addedBy });
    await report.save();
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;