const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const orders = require('./routes/orders');
const contact = require('./routes/contact');
const admin = require('./routes/admin');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));

const origins = String(process.env.FRONTEND_ORIGIN || '').split(',').map(x=>x.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true, credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/api/health', (req,res)=>res.json({ok:true,service:'@TEAM API',database:mongoose.connection.readyState===1?'connected':'disconnected'}));
app.use('/api/orders', orders);
app.use('/api/contact', contact);
app.use('/api/admin', admin);

const clientDir = path.join(__dirname, '..', 'client');
app.use(express.static(clientDir, { extensions: ['html'] }));
app.get('/', (req,res)=>res.sendFile(path.join(clientDir,'index.html')));

app.use((req,res)=>res.status(404).json({ok:false,message:'Route not found.'}));
app.use((err,req,res,next)=>{
  console.error(err);
  if (err?.name === 'ValidationError') return res.status(400).json({ok:false,message:'Some submitted fields are invalid.',details:Object.values(err.errors).map(e=>e.message)});
  if (err?.code === 11000) return res.status(409).json({ok:false,message:'A duplicate record was detected. Please try again.'});
  res.status(500).json({ok:false,message:'Server error. Please try again.'});
});

module.exports = app;
