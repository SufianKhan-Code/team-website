const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Order = require('../models/Order');
const ContactMessage = require('../models/ContactMessage');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
let cachedHash = null;

router.post('/login', loginLimiter, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const expectedEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const expectedPassword = String(process.env.ADMIN_PASSWORD || '');
  if (!expectedEmail || !expectedPassword || !process.env.JWT_SECRET) {
    return res.status(503).json({ ok:false, message:'Admin login is not configured on the server.' });
  }
  if (!cachedHash) cachedHash = await bcrypt.hash(expectedPassword, 10);
  const passwordOk = await bcrypt.compare(password, cachedHash);
  if (email !== expectedEmail || !passwordOk) return res.status(401).json({ ok:false, message:'Invalid email or password.' });
  const token = jwt.sign({ email, role:'admin' }, process.env.JWT_SECRET, { expiresIn:'12h' });
  res.json({ ok:true, token, admin:{ email } });
});

router.use(requireAdmin);

router.get('/stats', async (req, res, next) => {
  try {
    const [totalOrders,newOrders,activeOrders,totalMessages,newMessages] = await Promise.all([
      Order.countDocuments(), Order.countDocuments({status:'new'}),
      Order.countDocuments({status:{$in:['accepted','in_progress']}}),
      ContactMessage.countDocuments(), ContactMessage.countDocuments({status:'new'})
    ]);
    res.json({ok:true, stats:{totalOrders,newOrders,activeOrders,totalMessages,newMessages}});
  } catch(e){ next(e); }
});

router.get('/orders', async (req,res,next)=>{
  try {
    const filter = req.query.status ? {status:req.query.status} : {};
    const orders = await Order.find(filter).sort({createdAt:-1}).limit(300);
    res.json({ok:true, orders});
  } catch(e){next(e)}
});

router.get('/orders/:id', async (req,res,next)=>{
  try { const order=await Order.findById(req.params.id); if(!order)return res.status(404).json({ok:false,message:'Order not found.'}); res.json({ok:true,order}); }
  catch(e){next(e)}
});

router.patch('/orders/:id', async (req,res,next)=>{
  try {
    const allowed={};
    if(req.body.status) allowed.status=req.body.status;
    if(req.body.adminNotes!==undefined) allowed.adminNotes=String(req.body.adminNotes||'');
    const order=await Order.findByIdAndUpdate(req.params.id,allowed,{new:true,runValidators:true});
    if(!order)return res.status(404).json({ok:false,message:'Order not found.'});
    res.json({ok:true,order});
  } catch(e){next(e)}
});

router.delete('/orders/:id', async (req,res,next)=>{
  try { const order=await Order.findByIdAndDelete(req.params.id); if(!order)return res.status(404).json({ok:false,message:'Order not found.'}); res.json({ok:true}); }
  catch(e){next(e)}
});

router.get('/messages', async (req,res,next)=>{
  try { const messages=await ContactMessage.find().sort({createdAt:-1}).limit(300); res.json({ok:true,messages}); }
  catch(e){next(e)}
});

router.patch('/messages/:id', async (req,res,next)=>{
  try {
    const allowed={}; if(req.body.status)allowed.status=req.body.status; if(req.body.adminNotes!==undefined)allowed.adminNotes=String(req.body.adminNotes||'');
    const message=await ContactMessage.findByIdAndUpdate(req.params.id,allowed,{new:true,runValidators:true});
    if(!message)return res.status(404).json({ok:false,message:'Message not found.'}); res.json({ok:true,message});
  } catch(e){next(e)}
});

router.delete('/messages/:id', async (req,res,next)=>{
  try { const message=await ContactMessage.findByIdAndDelete(req.params.id); if(!message)return res.status(404).json({ok:false,message:'Message not found.'}); res.json({ok:true}); }
  catch(e){next(e)}
});

module.exports = router;
