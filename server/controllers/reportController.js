const Report = require('../models/Report');
const { sendStatusUpdateEmail } = require('../utils/emailService');

const getAnalytics = async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const byStatus   = await Report.aggregate([{ $group: { _id: '$status',   count: { $sum: 1 } } }]);
    const byCategory = await Report.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const byBuilding = await Report.aggregate([{ $group: { _id: '$building', count: { $sum: 1 } } }]);
    const byPriority = await Report.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
    res.json({ total, byStatus, byCategory, byBuilding, byPriority });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { status, category, building, priority } = req.query;
    let filter = {};
    if (status)   filter.status   = status;
    if (category) filter.category = category;
    if (building) filter.building = building;
    if (priority) filter.priority = priority;
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const update = req.body;
    const oldReport = await Report.findById(req.params.id);
    if (!oldReport) return res.status(404).json({ message: 'Report not found' });

    if (update.status === 'Resolved') {
      update.resolvedAt = new Date();
    }

    const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true });

    if (update.status && oldReport.status !== update.status) {
      try {
        await sendStatusUpdateEmail(report.title, report.email, update.status, report._id);
      } catch (emailErr) {
        console.log('Email failed (non-critical):', emailErr.message);
      }
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (report.status === status) {
      return res.json(report);
    }

    const oldStatus = report.status;
    report.status = status;

    if (status === 'Resolved') {
      report.resolvedAt = new Date();
    }

    await report.save();

    try {
      await sendStatusUpdateEmail(report.title, report.email, status, report._id);

      report.emailLogs.push({
        subject: `Status changed to ${status}`,
        message: `Status updated from ${oldStatus} to ${status}`
      });
      await report.save();
    } catch (emailErr) {
      console.log('Email failed (non-critical):', emailErr.message);
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    report.comments.push({ text: req.body.text, addedBy: req.body.addedBy });
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAnalytics,
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  updateStatus,
  addComment,
  deleteReport
};