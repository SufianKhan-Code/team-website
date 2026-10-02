require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./server/app');

const PORT = Number(process.env.PORT || 5000);

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and add your MongoDB Atlas connection string.');
  if (!process.env.JWT_SECRET) console.warn('Warning: JWT_SECRET is not configured; admin login will be unavailable.');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`@TEAM website running at http://localhost:${PORT}`));
}
start().catch(err=>{ console.error(err.message); process.exit(1); });
