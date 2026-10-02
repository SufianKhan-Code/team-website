const express = require('express');
const rateLimit = require('express-rate-limit');
const ContactMessage = require('../models/ContactMessage');
const { makeId } = require('../utils/ids');
const { notifyContact } = require('../utils/mailer');

const router = express.Router();
const limiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });

router.post('/', limiter, async (req, res, next) => {
  try {
    const body = req.body || {};
    const required = ['name','email','service','project'];
    const missing = required.filter(key => !String(body[key] || '').trim());
    if (missing.length) return res.status(400).json({ ok:false, message:'Please complete all required contact fields.', missing });
    if (!/^\S+@\S+\.\S+$/.test(String(body.email))) return res.status(400).json({ ok:false, message:'Please enter a valid email address.' });
    const message = await ContactMessage.create({ ticketId: makeId('MSG'), ...body, status:'new' });
    notifyContact(message.toObject()).catch(err => console.error('Contact email notification failed:', err.message));
    return res.status(201).json({ ok:true, message:'Your message has been sent successfully.', ticketId: message.ticketId });
  } catch (error) { next(error); }
});

module.exports = router;
