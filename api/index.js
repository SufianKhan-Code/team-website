require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../server/app');

let connectionPromise;
async function connect() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');
  if (!connectionPromise) connectionPromise = mongoose.connect(process.env.MONGODB_URI);
  await connectionPromise;
}

module.exports = async (req, res) => {
  try { await connect(); return app(req, res); }
  catch (error) { console.error(error); return res.status(500).json({ok:false,message:'Database connection failed.'}); }
};
