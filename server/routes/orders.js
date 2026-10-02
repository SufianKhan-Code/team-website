const express = require('express');
const rateLimit = require('express-rate-limit');
const Order = require('../models/Order');
const { makeId } = require('../utils/ids');
const { notifyOrder } = require('../utils/mailer');

const router = express.Router();
const limiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false });

const required = [
  'clientName','clientEmail','clientWhatsapp','contactMethod','businessDescription','targetAudience',
  'websiteType','projectStatus','mainGoal','primaryActions','copyStatus','mediaStatus','designStatus',
  'logoStatus','visualStyle','domainStatus','hostingStatus','budget','timeline'
];

function asArray(value) {
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
  if (value == null || value === '') return [];
  return [String(value).trim()];
}

router.post('/', limiter, async (req, res, next) => {
  try {
    const body = req.body || {};
    const missing = required.filter(key => !String(body[key] || '').trim());
    if (missing.length) return res.status(400).json({ ok: false, message: 'Please complete all required booking fields.', missing });
    if (!/^\S+@\S+\.\S+$/.test(String(body.clientEmail))) return res.status(400).json({ ok:false, message:'Please enter a valid email address.' });
    const pages = asArray(body.pages);
    if (!pages.length) return res.status(400).json({ ok:false, message:'Please select at least one required page / screen.' });

    const order = await Order.create({
      bookingId: makeId('TEAM'),
      ...body,
      pages,
      features: asArray(body.features),
      status: 'new',
      source: 'website'
    });

    notifyOrder(order.toObject()).catch(err => console.error('Order email notification failed:', err.message));
    return res.status(201).json({
      ok: true,
      message: 'Your project booking has been submitted successfully.',
      bookingId: order.bookingId,
      status: order.status,
      createdAt: order.createdAt
    });
  } catch (error) { next(error); }
});

router.get('/:bookingId/status', async (req, res, next) => {
  try {
    const order = await Order.findOne({ bookingId: req.params.bookingId }).select('bookingId status createdAt updatedAt');
    if (!order) return res.status(404).json({ ok:false, message:'Booking not found.' });
    return res.json({ ok:true, order });
  } catch (error) { next(error); }
});

module.exports = router;
