const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
  company: { type: String, trim: true, maxlength: 160, default: '' },
  website: { type: String, trim: true, maxlength: 500, default: '' },
  service: { type: String, required: true, trim: true, maxlength: 140 },
  budget: { type: String, trim: true, maxlength: 100, default: '' },
  timeline: { type: String, trim: true, maxlength: 100, default: '' },
  stage: { type: String, trim: true, maxlength: 140, default: '' },
  project: { type: String, required: true, trim: true, maxlength: 5000 },
  features: { type: String, trim: true, maxlength: 5000, default: '' },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new', index: true },
  adminNotes: { type: String, trim: true, maxlength: 5000, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
