const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user preferences
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      preferences: user.preferences || {
        currency: 'USD',
        theme: 'light',
        language: 'en'
      }
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/', auth, async (req, res) => {
  try {
    const { currency, theme, language } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...(currency && { currency }),
      ...(theme && { theme }),
      ...(language && { language })
    };

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset preferences to defaults
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = {
      currency: 'USD',
      theme: 'light',
      language: 'en'
    };

    await user.save();

    res.json({
      message: 'Preferences reset to defaults',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error resetting preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;