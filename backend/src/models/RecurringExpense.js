const mongoose = require('mongoose');

const RecurringExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  nextDueDate: { type: Date, required: true },
  lastProcessed: { type: Date },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecurringExpense', RecurringExpenseSchema);