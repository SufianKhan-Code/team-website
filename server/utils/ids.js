const crypto = require('crypto');

function makeId(prefix) {
  const now = new Date();
  const date = `${now.getUTCFullYear()}${String(now.getUTCMonth()+1).padStart(2,'0')}${String(now.getUTCDate()).padStart(2,'0')}`;
  const token = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${date}-${token}`;
}
module.exports = { makeId };
