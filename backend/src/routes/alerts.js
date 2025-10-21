const express = require('express');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { generateAlerts } = require('../utils/alertGenerator');

const router = express.Router();
const demoUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

// Get all alerts for user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const alerts = await Alert.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Demo route for alerts
router.get('/demo', async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: demoUserId }).sort({ createdAt: -1 }).limit(20);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark alert as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    await Alert.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark all alerts as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    await Alert.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    await Alert.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manual alert generation trigger
router.post('/generate', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    await generateAlerts(userId);
    res.json({ success: true, message: 'Alerts generated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;