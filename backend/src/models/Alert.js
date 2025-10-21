const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: [
      'budget_exceeded', 
      'budget_warning', 
      'low_balance', 
      'negative_balance',
      'no_savings',
      'low_savings_rate',
      'expense_trend',
      'no_budget',
      'no_savings_goals',
      'category_overspend', 
      'savings_goal', 
      'goal_achieved', 
      'goal_milestone', 
      'recurring_due'
    ],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Reference to budget, goal, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);