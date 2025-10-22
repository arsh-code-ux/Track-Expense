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
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }
    
    console.log('📋 Fetching alerts for user:', userId);
    
    let alerts = [];
    try {
      alerts = await Alert.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
      
      console.log(`✅ Found ${alerts.length} alerts for user`);
    } catch (dbError) {
      console.error('Database error fetching alerts:', dbError);
      return res.status(500).json({ 
        success: false, 
        error: 'Database connection error. Please try again.' 
      });
    }
    
    res.json(alerts);
  } catch (error) {
    console.error('❌ Critical error fetching alerts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch alerts. Please try again later.' 
    });
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

// Refresh alerts - clear outdated and regenerate
router.post('/refresh', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required for alert refresh' 
      });
    }
    
    console.log('🔄 Starting alert refresh for user:', userId);
    
    // Force regenerate all alerts with timeout protection
    const alertGenerationPromise = generateAlerts(userId);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Alert generation timeout')), 30000);
    });
    
    try {
      await Promise.race([alertGenerationPromise, timeoutPromise]);
      console.log('✅ Alert generation completed successfully');
    } catch (generationError) {
      console.error('⚠️ Alert generation error (continuing with existing alerts):', generationError);
      // Continue to return existing alerts even if generation fails
    }
    
    // Get fresh alerts with error handling
    let alerts = [];
    try {
      alerts = await Alert.find({ userId }).sort({ createdAt: -1 }).limit(50);
    } catch (fetchError) {
      console.error('Error fetching alerts after refresh:', fetchError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch alerts after refresh' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `Refreshed alerts successfully`, 
      count: alerts.length,
      alerts: alerts 
    });
  } catch (err) {
    console.error('❌ Critical error in alert refresh:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Failed to refresh alerts' 
    });
  }
});

// Demo refresh endpoint
router.post('/refresh/demo', async (req, res) => {
  try {
    await generateAlerts(demoUserId);
    
    const alerts = await Alert.find({ userId: demoUserId }).sort({ createdAt: -1 }).limit(20);
    
    res.json({ 
      success: true, 
      message: `Demo alerts refreshed successfully`, 
      count: alerts.length,
      alerts: alerts 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;