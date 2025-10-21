const Alert = require('../models/Alert');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const Transaction = require('../models/Transaction');

// Main function to generate all types of alerts
const generateAlerts = async (userId) => {
  try {
    console.log('� Starting alert generation for user:', userId);
    
    // Clear outdated alerts first
    await clearOutdatedAlerts(userId);
    
    // Analyze user spending patterns (new feature)
    await analyzeUserSpendingPatterns(userId);
    
    // Check all budget alerts comprehensively
    await checkAllBudgetAlerts(userId);
    
    // Check savings goal alerts
    await checkSavingsGoalAlerts(userId);
    
    // Check balance alerts
    await checkBalanceAlerts(userId);
    
    // Check savings rate alerts
    await checkSavingsRateAlerts(userId);
    
    // Check financial health alerts
    await checkFinancialHealthAlerts(userId);
    
    console.log('✅ Alert generation completed for user:', userId);
  } catch (error) {
    console.error('Error generating alerts:', error);
  }
};

// Check all budgets for the user (comprehensive check)
const checkAllBudgetAlerts = async (userId) => {
  try {
    const budgets = await Budget.find({ userId, isActive: true });
    console.log(`💰 Checking ${budgets.length} active budgets for user`);

    for (const budget of budgets) {
      await checkSingleBudget(userId, budget);
    }
  } catch (error) {
    console.error('Error checking all budget alerts:', error);
  }
};

// Check if any budgets are exceeded or approaching limits (legacy function for single transaction)
const checkBudgetAlerts = async (userId, transaction) => {
  try {
    // Find active budgets for the transaction category
    const budgets = await Budget.find({
      userId,
      category: transaction.category,
      isActive: true
    });

    for (const budget of budgets) {
      await checkSingleBudget(userId, budget);
    }
  } catch (error) {
    console.error('Error checking budget alerts:', error);
  }
};

// Check a single budget for alerts
const checkSingleBudget = async (userId, budget) => {
  try {
    // Calculate spending for this budget period
    const startDate = getBudgetPeriodStart(budget.period, budget.startDate);
    const endDate = new Date();

    const totalSpent = await Transaction.aggregate([
      {
        $match: {
          userId,
          category: budget.category,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const spentAmount = totalSpent[0]?.total || 0;
    const percentageSpent = (spentAmount / budget.amount) * 100;
    
    console.log(`💰 Budget Alert Check - ${budget.category}: Spent $${spentAmount.toFixed(2)} of $${budget.amount.toFixed(2)} (${percentageSpent.toFixed(1)}%)`);

    // Check if budget is exceeded
    if (spentAmount > budget.amount) {
      await createAlert(userId, {
        type: 'budget_exceeded',
        title: 'Budget Exceeded',
        message: `Budget exceeded! You've spent $${spentAmount.toFixed(2)} of your $${budget.amount.toFixed(2)} ${budget.category} budget.`,
        relatedId: budget._id,
        severity: 'high'
      });
    }
    // Check if approaching budget limit (using alert threshold)
    else if (percentageSpent >= budget.alertThreshold && percentageSpent < 100) {
      await createAlert(userId, {
        type: 'budget_warning',
        title: 'Budget Warning',
        message: `Budget warning: You've used ${percentageSpent.toFixed(0)}% of your ${budget.category} budget ($${spentAmount.toFixed(2)} of $${budget.amount.toFixed(2)}).`,
        relatedId: budget._id,
        severity: 'medium'
      });
    }
  } catch (error) {
    console.error('Error checking single budget:', error);
  }
};

// Check savings goal achievements and milestones
const checkSavingsGoalAlerts = async (userId) => {
  try {
    const savingsGoals = await SavingsGoal.find({ userId, isCompleted: false });

    for (const goal of savingsGoals) {
      const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

      // Check if goal is achieved
      if (goal.currentAmount >= goal.targetAmount) {
        await SavingsGoal.findByIdAndUpdate(goal._id, { isCompleted: true });
        await createAlert(userId, {
          type: 'goal_achieved',
          title: 'Savings Goal Achieved',
          message: `🎉 Congratulations! You've achieved your savings goal "${goal.title}" of $${goal.targetAmount.toFixed(2)}!`,
          relatedId: goal._id,
          severity: 'low'
        });
      }
      // Check milestones (25%, 50%, 75%)
      else if (progressPercentage >= 75) {
        await createAlert(userId, {
          type: 'goal_milestone',
          title: 'Savings Milestone',
          message: `🎯 You're 75% of the way to your "${goal.title}" goal! Only $${(goal.targetAmount - goal.currentAmount).toFixed(2)} to go!`,
          relatedId: goal._id,
          severity: 'low'
        });
      } else if (progressPercentage >= 50) {
        await createAlert(userId, {
          type: 'goal_milestone',
          title: 'Savings Milestone',
          message: `🎯 Halfway there! You've reached 50% of your "${goal.title}" savings goal!`,
          relatedId: goal._id,
          severity: 'low'
        });
      } else if (progressPercentage >= 25) {
        await createAlert(userId, {
          type: 'goal_milestone',
          title: 'Savings Milestone',
          message: `🎯 Great start! You've reached 25% of your "${goal.title}" savings goal!`,
          relatedId: goal._id,
          severity: 'low'
        });
      }
    }
  } catch (error) {
    console.error('Error checking savings goal alerts:', error);
  }
};

// Create a new alert
const createAlert = async (userId, alertData) => {
  try {
    // Check for duplicate alerts (prevent spam) - reduced to 30 minutes for more responsive alerts
    const recentAlert = await Alert.findOne({
      userId,
      type: alertData.type,
      relatedId: alertData.relatedId,
      createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
    });

    if (!recentAlert) {
      const alert = new Alert({
        userId,
        ...alertData
      });
      await alert.save();
      console.log(`🔔 Created new alert: ${alertData.type} - ${alertData.title}`);
    } else {
      console.log(`⏭️ Skipped duplicate alert: ${alertData.type}`);
    }
  } catch (error) {
    console.error('Error creating alert:', error);
  }
};

// Calculate budget period start date
const getBudgetPeriodStart = (period, startDate) => {
  const now = new Date();
  
  if (period === 'weekly') {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  } else if (period === 'monthly') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return monthStart;
  }
  
  return startDate || now;
};

// Check for low balance alerts
const checkBalanceAlerts = async (userId) => {
  try {
    // Get all transactions for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const transactions = await Transaction.find({
      userId,
      date: { $gte: monthStart }
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalIncome - totalExpenses;

    // Alert if balance is very low (less than $100)
    if (currentBalance < 100 && currentBalance > -500) {
      await createAlert(userId, {
        type: 'low_balance',
        title: 'Low Balance Warning',
        message: `⚠️ Your current balance is low: $${currentBalance.toFixed(2)}. Consider reducing expenses or increasing income.`,
        severity: 'high'
      });
    }
    
    // Alert if balance is negative
    else if (currentBalance < 0) {
      await createAlert(userId, {
        type: 'negative_balance',
        title: 'Negative Balance Alert',
        message: `🚨 Your balance is negative: $${currentBalance.toFixed(2)}. Immediate action required!`,
        severity: 'high'
      });
    }

  } catch (error) {
    console.error('Error checking balance alerts:', error);
  }
};

// Check savings rate alerts
const checkSavingsRateAlerts = async (userId) => {
  try {
    // Get current month transactions
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const transactions = await Transaction.find({
      userId,
      date: { $gte: monthStart }
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsAmount = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;

    // Alert if no savings this month and has income
    if (totalIncome > 0 && savingsAmount <= 0) {
      await createAlert(userId, {
        type: 'no_savings',
        title: 'No Savings This Month',
        message: `💸 You haven't saved any money this month. Your expenses ($${totalExpenses.toFixed(2)}) equal or exceed your income ($${totalIncome.toFixed(2)}). Consider cutting expenses!`,
        severity: 'medium'
      });
    }
    
    // Alert if savings rate is very low (less than 10%)
    else if (totalIncome > 0 && savingsRate > 0 && savingsRate < 10) {
      await createAlert(userId, {
        type: 'low_savings_rate',
        title: 'Low Savings Rate',
        message: `📉 Your savings rate is only ${savingsRate.toFixed(1)}% this month. Financial experts recommend saving at least 20% of income.`,
        severity: 'medium'
      });
    }

  } catch (error) {
    console.error('Error checking savings rate alerts:', error);
  }
};

// Check overall financial health alerts
const checkFinancialHealthAlerts = async (userId) => {
  try {
    // Get last 3 months of transactions
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    const transactions = await Transaction.find({
      userId,
      date: { $gte: threeMonthsAgo }
    });

    const monthlySpending = {};
    
    // Group transactions by month
    transactions.forEach(transaction => {
      const month = `${transaction.date.getFullYear()}-${transaction.date.getMonth()}`;
      if (!monthlySpending[month]) {
        monthlySpending[month] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlySpending[month].income += transaction.amount;
      } else {
        monthlySpending[month].expenses += transaction.amount;
      }
    });

    const months = Object.values(monthlySpending);
    
    // Check for increasing expenses trend
    if (months.length >= 2) {
      const currentMonth = months[months.length - 1];
      const previousMonth = months[months.length - 2];
      
      const expenseIncrease = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
      
      if (expenseIncrease > 20 && currentMonth.expenses > 0) {
        await createAlert(userId, {
          type: 'expense_trend',
          title: 'Rising Expenses Detected',
          message: `📈 Your expenses increased by ${expenseIncrease.toFixed(1)}% from last month. Current: $${currentMonth.expenses.toFixed(2)}, Previous: $${previousMonth.expenses.toFixed(2)}`,
          severity: 'medium'
        });
      }
    }

    // Check if user has any active budgets
    const activeBudgets = await Budget.find({ userId, isActive: true });
    if (activeBudgets.length === 0 && transactions.length > 0) {
      await createAlert(userId, {
        type: 'no_budget',
        title: 'Create a Budget',
        message: `💡 You have transactions but no active budgets. Setting budgets helps control spending and reach financial goals!`,
        severity: 'low'
      });
    }

    // Check if user has any savings goals
    const savingsGoals = await SavingsGoal.find({ userId, isCompleted: false });
    if (savingsGoals.length === 0 && transactions.length > 0) {
      await createAlert(userId, {
        type: 'no_savings_goals',
        title: 'Set Savings Goals',
        message: `🎯 You don't have any savings goals set. Having clear financial goals helps build wealth and financial security!`,
        severity: 'low'
      });
    }

  } catch (error) {
    console.error('Error checking financial health alerts:', error);
  }
};

// Clear outdated alerts that are no longer relevant
const clearOutdatedAlerts = async (userId) => {
  try {
    console.log('🧹 Clearing outdated alerts for user:', userId);
    
    // Count alerts before clearing
    const alertsBefore = await Alert.countDocuments({ userId });
    console.log(`📊 Alerts before clearing: ${alertsBefore}`);

    // Get current financial state
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: currentMonth }
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalIncome - totalExpenses;

    // Clear balance alerts that are no longer accurate
    if (currentBalance >= 100) {
      // Remove low balance alerts if balance is now healthy
      await Alert.deleteMany({
        userId,
        type: { $in: ['low_balance', 'negative_balance'] },
        isRead: false
      });
      console.log('✅ Cleared outdated balance alerts - balance is now healthy');
    }

    // Clear budget alerts older than current budget period
    const budgets = await Budget.find({ userId, isActive: true });
    for (const budget of budgets) {
      const periodStart = getBudgetPeriodStart(budget.period, budget.startDate);
      
      // Remove budget alerts from previous periods
      await Alert.deleteMany({
        userId,
        type: { $in: ['budget_exceeded', 'budget_warning'] },
        relatedId: budget._id,
        createdAt: { $lt: periodStart },
        isRead: false
      });
    }

    // Clear alerts older than 7 days (except high priority ones)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    await Alert.deleteMany({
      userId,
      severity: { $in: ['low', 'medium'] },
      createdAt: { $lt: weekAgo },
      isRead: false
    });

    // Count alerts after clearing
    const alertsAfter = await Alert.countDocuments({ userId });
    console.log(`📊 Alerts after clearing: ${alertsAfter}`);
    console.log(`🗑️ Deleted ${alertsBefore - alertsAfter} outdated alerts`);
    
    console.log('✅ Outdated alerts cleared successfully');

  } catch (error) {
    console.error('Error clearing outdated alerts:', error);
  }
};

// Analyze user spending patterns and generate personalized alerts
const analyzeUserSpendingPatterns = async (userId) => {
  try {
    console.log('📊 Analyzing user spending patterns...');
    
    // Get last 30 days of transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTransactions = await Transaction.find({
      userId,
      date: { $gte: thirtyDaysAgo }
    });

    console.log(`📈 Found ${recentTransactions.length} transactions in last 30 days`);

    if (recentTransactions.length === 0) {
      await createAlert(userId, {
        type: 'no_activity',
        title: 'No Recent Activity',
        message: `📅 You haven't recorded any transactions in the past 30 days. Start tracking your expenses to get personalized insights!`,
        severity: 'low'
      });
      return;
    }

    // Calculate totals
    const totalIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentBalance = totalIncome - totalExpenses;

    console.log(`💰 Last 30 days: Income $${totalIncome}, Expenses $${totalExpenses}, Balance $${currentBalance}`);

    // Generate alerts based on spending patterns
    if (totalExpenses > totalIncome && totalIncome > 0) {
      await createAlert(userId, {
        type: 'spending_more_than_income',
        title: 'Spending Exceeds Income',
        message: `⚠️ In the last 30 days, you spent $${totalExpenses.toFixed(2)} but earned $${totalIncome.toFixed(2)}. Consider reducing expenses or increasing income.`,
        severity: 'high'
      });
    }

    // Check for categories with high spending
    const expensesByCategory = {};
    recentTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const sortedCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const topCategoryPercentage = (topCategory[1] / totalExpenses) * 100;
      
      if (topCategoryPercentage > 40) {
        await createAlert(userId, {
          type: 'high_category_spending',
          title: 'High Category Spending',
          message: `📊 ${topCategoryPercentage.toFixed(0)}% of your expenses ($${topCategory[1].toFixed(2)}) are in ${topCategory[0]}. Consider reviewing this category.`,
          severity: 'medium'
        });
      }
    }

    // Alert for positive financial performance
    if (totalIncome > 0 && currentBalance > 0) {
      const savingsRate = (currentBalance / totalIncome) * 100;
      if (savingsRate > 20) {
        await createAlert(userId, {
          type: 'good_savings_rate',
          title: 'Great Savings Rate!',
          message: `🎉 You saved ${savingsRate.toFixed(0)}% of your income ($${currentBalance.toFixed(2)}) this month. Keep up the great work!`,
          severity: 'low'
        });
      }
    }

  } catch (error) {
    console.error('Error analyzing spending patterns:', error);
  }
};

module.exports = {
  generateAlerts,
  checkBudgetAlerts,
  checkSavingsGoalAlerts,
  checkBalanceAlerts,
  checkSavingsRateAlerts,
  checkFinancialHealthAlerts,
  createAlert,
  clearOutdatedAlerts,
  analyzeUserSpendingPatterns
};