const express = require('express');
const SavingsGoal = require('../models/SavingsGoal');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { generateAlerts } = require('../utils/alertGenerator');

const router = express.Router();
const demoUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

// Get all savings goals
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    const goals = await SavingsGoal.find({ userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Demo route for savings goals
router.get('/demo', async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: demoUserId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new savings goal
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    const goal = new SavingsGoal({ ...req.body, userId });
    await goal.save();
    
    // Regenerate alerts after savings goal creation
    await generateAlerts(userId);
    
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Demo create savings goal
router.post('/demo', async (req, res) => {
  try {
    const goal = new SavingsGoal({ ...req.body, userId: demoUserId });
    await goal.save();
    
    // Regenerate alerts after demo savings goal creation
    await generateAlerts(demoUserId);
    
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update savings goal progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    const { amount } = req.body;
    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goal.currentAmount += amount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }
    
    await goal.save();
    
    // Regenerate alerts after savings goal progress update
    await generateAlerts(userId);
    
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update savings goal
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    const updates = req.body;
    
    // Remove userId and _id from updates to prevent overwriting
    delete updates.userId;
    delete updates._id;
    
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId },
      updates,
      { new: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Check if goal is now completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
      await goal.save();
    }
    
    // Regenerate alerts after savings goal update
    await generateAlerts(userId);
    
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete savings goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId });
    
    // Regenerate alerts after savings goal deletion
    await generateAlerts(userId);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;