const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true, index: true },
  clientName: { type: String, required: true, trim: true, maxlength: 120 },
  clientEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
  clientWhatsapp: { type: String, required: true, trim: true, maxlength: 50 },
  company: { type: String, trim: true, maxlength: 160, default: '' },
  location: { type: String, trim: true, maxlength: 160, default: '' },
  contactMethod: { type: String, trim: true, maxlength: 80, default: '' },
  businessDescription: { type: String, required: true, trim: true, maxlength: 5000 },
  targetAudience: { type: String, required: true, trim: true, maxlength: 3000 },

  websiteType: { type: String, required: true, trim: true, maxlength: 120 },
  projectStatus: { type: String, required: true, trim: true, maxlength: 120 },
  existingUrl: { type: String, trim: true, maxlength: 500, default: '' },
  mainGoal: { type: String, required: true, trim: true, maxlength: 5000 },
  primaryActions: { type: String, required: true, trim: true, maxlength: 3000 },

  pages: [{ type: String, trim: true, maxlength: 120 }],
  pageCount: { type: String, trim: true, maxlength: 80, default: '' },
  language: { type: String, trim: true, maxlength: 80, default: '' },
  copyStatus: { type: String, required: true, trim: true, maxlength: 120 },
  mediaStatus: { type: String, required: true, trim: true, maxlength: 120 },
  customPages: { type: String, trim: true, maxlength: 3000, default: '' },

  features: [{ type: String, trim: true, maxlength: 160 }],
  featureNotes: { type: String, trim: true, maxlength: 5000, default: '' },

  designStatus: { type: String, required: true, trim: true, maxlength: 120 },
  logoStatus: { type: String, required: true, trim: true, maxlength: 120 },
  brandColors: { type: String, trim: true, maxlength: 500, default: '' },
  visualStyle: { type: String, required: true, trim: true, maxlength: 120 },
  references: { type: String, trim: true, maxlength: 3000, default: '' },
  designNotes: { type: String, trim: true, maxlength: 5000, default: '' },

  domainStatus: { type: String, required: true, trim: true, maxlength: 120 },
  hostingStatus: { type: String, required: true, trim: true, maxlength: 120 },
  domainName: { type: String, trim: true, maxlength: 300, default: '' },
  hostingProvider: { type: String, trim: true, maxlength: 200, default: '' },
  businessEmail: { type: String, trim: true, maxlength: 120, default: '' },
  maintenance: { type: String, trim: true, maxlength: 120, default: '' },
  technicalNotes: { type: String, trim: true, maxlength: 5000, default: '' },

  budget: { type: String, required: true, trim: true, maxlength: 100 },
  timeline: { type: String, required: true, trim: true, maxlength: 100 },
  launchDate: { type: String, trim: true, maxlength: 40, default: '' },
  startReadiness: { type: String, trim: true, maxlength: 120, default: '' },
  approval: { type: String, trim: true, maxlength: 120, default: '' },
  bestTime: { type: String, trim: true, maxlength: 120, default: '' },
  finalNotes: { type: String, trim: true, maxlength: 5000, default: '' },

  status: {
    type: String,
    enum: ['new', 'reviewed', 'contacted', 'quoted', 'accepted', 'in_progress', 'completed', 'rejected'],
    default: 'new',
    index: true
  },
  adminNotes: { type: String, trim: true, maxlength: 5000, default: '' },
  source: { type: String, default: 'website' }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
