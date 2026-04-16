/**
 * reportController.js
 *
 * This file contains all the business logic for reports.
 * It uses Mongoose (our MongoDB ODM) to interact with the database.
 *
 * Mongoose is used here for:
 *  - Report.find()         → fetch many documents
 *  - Report.findById()     → fetch one document by its MongoDB _id
 *  - Report.create()       → insert a new document
 *  - Report.findByIdAndUpdate() → update a document and return the updated version
 *  - Report.findByIdAndDelete() → permanently remove a document
 *  - Report.countDocuments()   → count how many documents match a filter
 *  - Report.aggregate()        → run aggregation pipelines for analytics
 */

const Report = require('../models/Report');
const { sendStatusUpdateEmail } = require('../utils/emailService');
const { transporter } = require('../utils/mailer');

// ─────────────────────────────────────────
// GET /api/reports/stats/analytics
// Returns grouped counts for dashboard charts
// ─────────────────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    // Mongoose aggregate groups all reports by a field and counts them
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

// ─────────────────────────────────────────
// GET /api/reports
// Returns all reports, with optional filters
// ─────────────────────────────────────────
const getAllReports = async (req, res) => {
  try {
    const { status, category, building, priority } = req.query;
    let filter = {};
    if (status)   filter.status   = status;
    if (category) filter.category = category;
    if (building) filter.building = building;
    if (priority) filter.priority = priority;

    // Mongoose find() returns all matching documents sorted newest first
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// GET /api/reports/:id
// Returns a single report by its MongoDB _id
// ─────────────────────────────────────────
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// POST /api/reports
// Creates a new report in MongoDB
// ─────────────────────────────────────────
const createReport = async (req, res) => {
  try {
    // Mongoose create() validates against the schema and saves to MongoDB
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// PUT /api/reports/:id
// Updates a report — also sends email if status changed
// ─────────────────────────────────────────
const updateReport = async (req, res) => {
  try {
    const update = req.body;

    // Fetch existing report before updating so we can compare old vs new status
    const oldReport = await Report.findById(req.params.id);
    if (!oldReport) return res.status(404).json({ message: 'Report not found' });

    // If status is being set to Resolved, record the timestamp
    if (update.status === 'Resolved') {
      update.resolvedAt = new Date();
    }

    // Mongoose findByIdAndUpdate returns the NEW updated document ({ new: true })
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    // Send email notification if the status changed
    if (update.status && oldReport.status !== update.status) {
      try {
        await sendStatusUpdateEmail(
          report.title,
          report.email,
          update.status,
          report._id
        );
        console.log('📧 Email notification sent to:', report.email);
      } catch (emailErr) {
        // Email failure is non-critical — report still saves successfully
        console.log('Email failed (non-critical):', emailErr.message);
      }
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// PUT /api/reports/:id/status
// Updates status + sends email + logs it in emailLogs[]
// ─────────────────────────────────────────
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;

    // Build the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: report.email || 'test@gmail.com',
      subject: `Report Status Updated: ${report.title}`,
      html: `
        <h2>FixMyCampus Update</h2>
        <p><b>Report:</b> ${report.title}</p>
        <p><b>New Status:</b> ${report.status}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Save the email log in the report document (stored in MongoDB)
    report.emailLogs.push({
      subject: mailOptions.subject,
      message: `Status changed to ${report.status}`
    });

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// POST /api/reports/:id/comments
// Adds a comment to a report's comments array
// ─────────────────────────────────────────
const addComment = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Push a new comment object into the Mongoose subdocument array
    report.comments.push({ text: req.body.text, addedBy: req.body.addedBy });
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// DELETE /api/reports/:id
// Permanently deletes a report (admin only)
// ─────────────────────────────────────────
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