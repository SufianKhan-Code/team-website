const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, message: 'Admin login required.' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Session expired or invalid.' });
  }
}
module.exports = { requireAdmin };
