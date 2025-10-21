const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { generateAlerts } = require('../utils/alertGenerator');

const router = express.Router();

// Create a demo user ObjectId that stays consistent (for non-authenticated users)
const demoUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const tx = new Transaction({ ...req.body, userId });
    await tx.save();
    
    // Generate alerts after transaction creation
    await generateAlerts(userId, tx);
    
    res.json(tx);
  } catch (err) {
    console.error('Transaction creation error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Demo route for unauthenticated users
router.post('/demo', async (req, res) => {
  try {
    const tx = new Transaction({ ...req.body, userId: demoUserId });
    await tx.save();
    
    // Generate alerts for demo user as well
    await generateAlerts(demoUserId, tx);
    
    res.json(tx);
  } catch (err) {
    console.error('Demo transaction creation error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// List transactions
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { from, to, category } = req.query;
    const q = { userId };
    if (category) q.category = category;
    if (from || to) q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
    const txs = await Transaction.find(q).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error('Transaction fetch error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Demo route for unauthenticated users to get transactions
router.get('/demo', async (req, res) => {
  try {
    const { from, to, category } = req.query;
    const q = { userId: demoUserId };
    if (category) q.category = category;
    if (from || to) q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
    const txs = await Transaction.find(q).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error('Demo transaction fetch error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    await Transaction.deleteOne({ _id: req.params.id, userId });
    
    // Regenerate alerts after transaction deletion
    await generateAlerts(userId);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Transaction deletion error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Demo delete route
router.delete('/demo/:id', async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id, userId: demoUserId });
    
    // Regenerate alerts after demo transaction deletion
    await generateAlerts(demoUserId);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Demo transaction deletion error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
