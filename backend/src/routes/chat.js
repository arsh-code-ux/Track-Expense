const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
const { formatAmount, getCurrencySymbol } = require('../utils/currency');

const router = express.Router();

let client = null;
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('placeholder')) {
  const { OpenAI } = require('openai');
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Create a demo user ObjectId that stays consistent
const demoUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

// Simple chat endpoint: accepts { message }
// It will fetch user's recent transactions and pass a small context to the LLM.
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get user ID (authenticated user or demo user)
    const userId = req.user ? req.user._id : demoUserId;
    
    // Get user currency preference
    let userCurrency = 'USD';
    if (req.user) {
      try {
        const user = await User.findById(req.user._id).select('preferences');
        userCurrency = user?.preferences?.currency || 'USD';
      } catch (error) {
        // Silently handle error and use default currency
      }
    }
    
    // Check if the question is finance-related
    const financeKeywords = [
      'money', 'spend', 'expense', 'income', 'save', 'saving', 'budget', 'financial', 'finance',
      'transaction', 'cost', 'price', 'pay', 'payment', 'cash', 'bank', 'investment', 'invest',
      'profit', 'loss', 'debt', 'credit', 'loan', 'interest', 'tax', 'salary', 'wage',
      'purchase', 'buy', 'sell', 'revenue', 'earnings', 'balance', 'account', 'fund',
      'insurance', 'pension', 'retirement', 'mortgage', 'rent', 'bill', 'category',
      'rupee', 'rupees', '₹', 'dollar', 'currency', 'amount', 'total', 'sum'
    ];
    
    const lowerMessage = message.toLowerCase();
    const isFinanceRelated = financeKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!isFinanceRelated) {
      return res.json({
        reply: "I'm sorry, but I'm specifically designed to help with financial matters like expenses, budgets, savings, and money management. Please ask me questions related to your finances, spending patterns, or financial advice. For example: 'How much did I spend this month?' or 'Give me a savings tip.'"
      });
    }
    
    if (!client) {
      // Provide comprehensive financial responses even without OpenAI API
      const recent = await Transaction.find({ userId }).sort({ date: -1 }).limit(20);
      const summary = summarizeTransactions(recent);
      
      let reply;
      
      // General spending questions
      if (lowerMessage.includes('spend') || lowerMessage.includes('expense')) {
        const totalExpenses = recent.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const expenseCount = recent.filter(t => t.type === 'expense').length;
        reply = `You've spent ${formatAmount(totalExpenses, userCurrency)} across ${expenseCount} transactions. ${summary}`;
      } 
      // Income questions
      else if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
        const totalIncome = recent.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const incomeCount = recent.filter(t => t.type === 'income').length;
        reply = `Your total income is ${formatAmount(totalIncome, userCurrency)} from ${incomeCount} transactions. ${summary}`;
      } 
      // Budget and savings questions
      else if (lowerMessage.includes('budget') || lowerMessage.includes('save')) {
        const totalIncome = recent.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = recent.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const savings = totalIncome - totalExpenses;
        reply = `Your current balance is ${formatAmount(savings, userCurrency)}. ${savings > 0 ? 'Great job saving money!' : 'Consider reducing expenses to improve your savings.'} Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.`;
      }
      // Category questions
      else if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
        const categories = {};
        recent.filter(t => t.type === 'expense').forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
        const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        if (sortedCategories.length > 0) {
          const topCategory = sortedCategories[0];
          reply = `Your biggest expense category is ${topCategory[0]} with ${formatAmount(topCategory[1], userCurrency)} spent. Other categories: ${sortedCategories.slice(1, 3).map(([cat, amt]) => `${cat} (${formatAmount(amt, userCurrency)})`).join(', ')}.`;
        } else {
          reply = 'No expense categories found yet. Start adding transactions to see your spending patterns!';
        }
      }
      // Financial tips and advice
      else if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
        const tips = [
          "Track every expense, no matter how small - it adds up!",
          "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
          "Set up automatic transfers to savings to build the habit.",
          "Review your subscriptions monthly and cancel unused ones.",
          "Cook at home more often to reduce food expenses.",
          "Use the 24-hour rule: wait a day before making non-essential purchases.",
          "Build an emergency fund covering 3-6 months of expenses."
        ];
        reply = tips[Math.floor(Math.random() * tips.length)];
      }
      // Balance and total questions
      else if (lowerMessage.includes('balance') || lowerMessage.includes('total') || lowerMessage.includes('money')) {
        const totalIncome = recent.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = recent.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;
        reply = `Your financial summary: Income: ${formatAmount(totalIncome, userCurrency)}, Expenses: ${formatAmount(totalExpenses, userCurrency)}, Net Balance: ${formatAmount(balance, userCurrency)}. ${balance > 0 ? '✅ You\'re in the positive!' : '⚠️ Consider reducing expenses.'}`;
      }
      // Default financial response
      else {
        reply = `I'm here to help with your finances! I can analyze your spending patterns, provide budgeting advice, and answer questions about your transactions. Try asking: "How much did I spend on food?" or "Give me a savings tip!" Your recent activity: ${summary || 'No transactions yet.'}`;
      }
      
      return res.json({ reply });
    }

    // If OpenAI is available, use it for more sophisticated responses
    const recent = await Transaction.find({ userId }).sort({ date: -1 }).limit(30);
    const summary = summarizeTransactions(recent);

    const prompt = `You are a helpful personal finance assistant. Only answer questions related to finance, money, budgets, expenses, savings, investments, and financial planning. If the user asks about non-financial topics, politely decline and redirect them to ask about financial matters.

User's financial data: ${summary}

User question: ${message}

Provide helpful, accurate financial advice based on their data.`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    const text = response.choices[0]?.message?.content || 'Sorry, no response available.';
    res.json({ reply: text });
  } catch (err) {
    console.error('Chat error:', err);
    res.json({ reply: 'Sorry, I encountered an error while processing your financial query. Please try again.' });
  }
});

function summarizeTransactions(txs) {
  if (!txs || txs.length === 0) return 'No transactions.';
  const totalsByCategory = {};
  let total = 0;
  txs.forEach(t => {
    const c = t.category || 'Uncategorized';
    totalsByCategory[c] = (totalsByCategory[c] || 0) + t.amount * (t.type === 'expense' ? 1 : -1);
    total += t.type === 'expense' ? t.amount : -t.amount;
  });
  const lines = Object.entries(totalsByCategory).map(([k,v]) => `${k}: ${v}`);
  return `Total recent balance: ${total}. By category: ${lines.join('; ')}`;
}

module.exports = router;
