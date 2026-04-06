const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['Electrical', 'Plumbing', 'Heating', 'Structural', 'Cleaning', 'IT Equipment', 'Safety Hazard', 'Other'] },
  location: { type: String, required: true },
  building: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['New', 'In Progress', 'Resolved', 'Closed'], default: 'New' },
  photoUrl: { type: String },
  reportedBy: { type: String, required: true },
  email: { type: String, required: true },
  comments: [{ text: String, addedAt: { type: Date, default: Date.now }, addedBy: String }],
  resolvedAt: { type: Date },
  consentGiven: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
