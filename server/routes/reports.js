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

// Analytics - MUST be before /:id
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

// Get all reports
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

// Get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create report
router.post('/', auth, async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update report
router.put('/:id', auth, async (req, res) => {
  try {
    const update = req.body;
    if (update.status === 'Resolved') update.resolvedAt = new Date();
    const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    report.comments.push({ text: req.body.text, addedBy: req.body.addedBy });
    await report.save();
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;