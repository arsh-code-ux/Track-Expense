const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { generateAlerts } = require('../utils/alertGenerator');

const router = express.Router();
const demoUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

// Get all budgets
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    const budgets = await Budget.find({ userId, isActive: true });
    
    // Calculate spending for each budget
    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const spending = await Transaction.aggregate([
        {
          $match: {
            userId,
            category: budget.category,
            type: 'expense',
            date: { $gte: startOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const spent = spending.length > 0 ? spending[0].total : 0;
      const percentUsed = (spent / budget.amount) * 100;
      
      return {
        ...budget.toObject(),
        spent,
        remaining: budget.amount - spent,
        percentUsed: Math.round(percentUsed)
      };
    }));
    
    res.json(budgetsWithSpending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Demo route for budgets
router.get('/demo', async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: demoUserId, isActive: true });
    
    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const spending = await Transaction.aggregate([
        {
          $match: {
            userId: demoUserId,
            category: budget.category,
            type: 'expense',
            date: { $gte: startOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const spent = spending.length > 0 ? spending[0].total : 0;
      const percentUsed = (spent / budget.amount) * 100;
      
      return {
        ...budget.toObject(),
        spent,
        remaining: budget.amount - spent,
        percentUsed: Math.round(percentUsed)
      };
    }));
    
    res.json(budgetsWithSpending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new budget
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    const budget = new Budget({ ...req.body, userId });
    await budget.save();
    
    // Regenerate alerts after budget creation
    await generateAlerts(userId);
    
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Demo create budget
router.post('/demo', async (req, res) => {
  try {
    const budget = new Budget({ ...req.body, userId: demoUserId });
    await budget.save();
    
    // Regenerate alerts after demo budget creation
    await generateAlerts(demoUserId);
    
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    
    // Regenerate alerts after budget update
    await generateAlerts(userId);
    
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : demoUserId;
    await Budget.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isActive: false }
    );
    
    // Regenerate alerts after budget deletion
    await generateAlerts(userId);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;