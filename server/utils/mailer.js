const nodemailer = require('nodemailer');

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!smtpReady()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

function clean(value) {
  return String(value || '').replace(/[<>]/g, '');
}

async function notifyOrder(order) {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };
  const teamEmail = process.env.TEAM_EMAIL || 'teamfordeveloper@gmail.com';
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const subject = `New Website Booking ${order.bookingId} — ${clean(order.company || order.clientName)}`;
  const text = [
    `Booking ID: ${order.bookingId}`,
    `Client: ${order.clientName}`,
    `Email: ${order.clientEmail}`,
    `WhatsApp: ${order.clientWhatsapp}`,
    `Company: ${order.company || '-'}`,
    `Website type: ${order.websiteType}`,
    `Budget: ${order.budget}`,
    `Timeline: ${order.timeline}`,
    `Pages: ${(order.pages || []).join(', ') || '-'}`,
    `Features: ${(order.features || []).join(', ') || '-'}`,
    '',
    `Goal: ${order.mainGoal}`,
    '',
    'Open the admin dashboard to review the complete booking.'
  ].join('\n');
  await transporter.sendMail({ from, to: teamEmail, subject, text });
  await transporter.sendMail({
    from,
    to: order.clientEmail,
    subject: `We received your @TEAM booking — ${order.bookingId}`,
    text: `Hi ${order.clientName},\n\nYour website project booking has been received.\nBooking ID: ${order.bookingId}\n\nWe will review the scope, budget and timeline before confirming the final quote and delivery plan.\n\n@TEAM\n${teamEmail}`
  });
  return { skipped: false };
}

async function notifyContact(message) {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };
  const teamEmail = process.env.TEAM_EMAIL || 'teamfordeveloper@gmail.com';
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to: teamEmail,
    subject: `New Contact ${message.ticketId} — ${clean(message.name)}`,
    text: `Ticket: ${message.ticketId}\nName: ${message.name}\nEmail: ${message.email}\nService: ${message.service}\n\n${message.project}`
  });
  return { skipped: false };
}

module.exports = { notifyOrder, notifyContact, smtpReady };
