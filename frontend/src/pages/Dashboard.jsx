import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import BudgetCard from '../components/BudgetCard'
import SavingsGoalCard from '../components/SavingsGoalCard'
import AlertsList from '../components/AlertsList'
import BudgetModal from '../components/BudgetModal'
import SavingsGoalModal from '../components/SavingsGoalModal'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickLoading, setQuickLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showSavingsModal, setShowSavingsModal] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { formatAmount } = useCurrency()

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  // Load cached data immediately for faster initial render
  useEffect(() => {
    const cachedData = localStorage.getItem('dashboard_cache')
    if (cachedData) {
      try {
        const { transactions: cachedTx, alerts: cachedAlerts } = JSON.parse(cachedData)
        if (cachedTx) setTransactions(cachedTx)
        if (cachedAlerts) setAlerts(cachedAlerts)
        console.log('📦 Loaded cached data for faster initial render')
      } catch (e) {
        console.log('Cache parse error, fetching fresh data')
      }
    }
    fetchData()
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      // Use quickLoading for subsequent calls, full loading for initial
      if (transactions.length > 0) {
        setQuickLoading(true)
      } else {
        setLoading(true)
      }
      console.log('=== FETCHDATA CALLED (Performance Optimized) ===')
      console.log('Is authenticated:', isAuthenticated)
      console.log('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing')
      
      const token = localStorage.getItem('token')
      const headers = isAuthenticated ? { 'Authorization': `Bearer ${token}` } : {}

      if (isAuthenticated) {
        // Make all API calls in parallel for authenticated users
        console.log('🚀 Making parallel API calls for authenticated user...')
        const [transactionsRes, budgetsRes, savingsRes, alertsRes] = await Promise.all([
          fetch(`${API_BASE}/api/transactions`, { headers }),
          fetch(`${API_BASE}/api/budgets`, { headers }),
          fetch(`${API_BASE}/api/savings-goals`, { headers }),
          fetch(`${API_BASE}/api/alerts`, { headers })
        ])

        // Process transactions
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json()
          if (Array.isArray(transactionsData)) {
            setTransactions(transactionsData)
          } else {
            console.error('Transaction fetch error:', transactionsData)
            setTransactions([])
          }
        } else {
          console.error('Transactions fetch failed:', transactionsRes.status)
          setTransactions([])
        }

        // Process budgets
        if (budgetsRes.ok) {
          const budgetsData = await budgetsRes.json()
          if (Array.isArray(budgetsData)) {
            setBudgets(budgetsData)
          }
        } else {
          console.error('Budgets fetch failed:', budgetsRes.status)
          setBudgets([])
        }

        // Process savings goals
        if (savingsRes.ok) {
          const savingsData = await savingsRes.json()
          if (Array.isArray(savingsData)) {
            setSavingsGoals(savingsData)
          }
        } else {
          console.error('Savings goals fetch failed:', savingsRes.status)
          setSavingsGoals([])
        }

        // Process alerts
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json()
          console.log('Alerts data received:', alertsData)
          if (Array.isArray(alertsData)) {
            setAlerts(alertsData)
            console.log('Set alerts state with', alertsData.length, 'alerts')
          } else {
            console.error('Alerts response is not an array:', alertsData)
            setAlerts([])
          }
        } else {
          console.error('Alerts fetch failed:', alertsRes.status)
          setAlerts([])
        }

      } else {
        // For non-authenticated users, fetch demo data in parallel
        console.log('🚀 Making parallel API calls for demo user...')
        const [transactionsRes, alertsRes] = await Promise.all([
          fetch(`${API_BASE}/api/transactions/demo`),
          fetch(`${API_BASE}/api/alerts/demo`)
        ])

        // Process demo transactions
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json()
          if (Array.isArray(transactionsData)) {
            setTransactions(transactionsData)
          } else {
            console.error('Demo transaction fetch error:', transactionsData)
            setTransactions([])
          }
        } else {
          console.error('Demo transactions fetch failed:', transactionsRes.status)
          setTransactions([])
        }

        // Process demo alerts
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json()
          console.log('Demo alerts received:', alertsData)
          if (Array.isArray(alertsData)) {
            setAlerts(alertsData)
            console.log('✅ Set demo alerts state with', alertsData.length, 'alerts')
          }
        } else {
          console.error('Demo alerts fetch failed:', alertsRes.status)
          setAlerts([])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setQuickLoading(false)
      
      // Cache data for faster next load
      try {
        const cacheData = {
          transactions: transactions.slice(0, 50), // Cache only recent 50 transactions
          alerts: alerts.slice(0, 20), // Cache only recent 20 alerts
          timestamp: Date.now()
        }
        localStorage.setItem('dashboard_cache', JSON.stringify(cacheData))
        console.log('💾 Cached data for faster next load')
      } catch (e) {
        console.log('Cache save error:', e)
      }
    }
  }

  const getCategoryData = () => {
    const categoryTotals = {}
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
      }
    })
    
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
  }

  const getMonthlyData = () => {
    const monthlyTotals = {}
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { month, income: 0, expense: 0 }
      }
      if (transaction.type === 'income') {
        monthlyTotals[month].income += transaction.amount
      } else {
        monthlyTotals[month].expense += transaction.amount
      }
    })
    
    return Object.values(monthlyTotals).sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']
  
  const tabs = ['overview', 'transactions', 'budgets', 'savings', 'alerts']

  if (loading && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-8 border-primary-200 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-3 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
            <span className="text-3xl">💰</span>
          </div>
        </div>
        <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent animate-pulse">
          Loading your financial dashboard...
        </p>
        <p className="text-sm text-neutral-500 mt-2">⚡ Optimized for fast loading</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-32">
        {/* Header */}
        <div className="mb-8 sm:mb-10 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-gradient-to-br from-primary-500 via-secondary-600 to-accent-600 p-4 rounded-2xl shadow-2xl animate-bounce-subtle">
                  <span className="text-6xl">💰</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent leading-tight drop-shadow-lg animate-gradient-shift">
                  {isAuthenticated ? `Welcome back, ${user?.name || 'User'}!` : 'Expense Tracker'}
                </h1>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-xl sm:text-2xl font-black ml-20">
                {isAuthenticated ? '✨ Here\'s your financial overview' : '🎯 Demo mode - Track your expenses'}
              </p>
            </div>
            {quickLoading && (
              <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-2xl border-2 border-primary-300 dark:border-primary-600">
                <div className="w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-black text-primary-600 dark:text-primary-400">Updating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar - NEW FEATURE */}
        <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-primary-200 dark:border-primary-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">This Month</p>
                <p className="text-2xl font-black text-primary-600 dark:text-primary-400">{formatAmount(totalExpenses)}</p>
              </div>
              <span className="text-3xl">💳</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Transactions</p>
                <p className="text-2xl font-black text-secondary-600 dark:text-secondary-400">{transactions.length}</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-accent-200 dark:border-accent-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Active Budgets</p>
                <p className="text-2xl font-black text-accent-600 dark:text-accent-400">{budgets.length}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-success-200 dark:border-success-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Savings Goals</p>
                <p className="text-2xl font-black text-success-600 dark:text-success-400">{savingsGoals.length}</p>
              </div>
              <span className="text-3xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8 animate-slide-up">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-4 border-neutral-200 dark:border-slate-700 p-3 overflow-x-auto">
            <nav className="flex space-x-3 min-w-max sm:min-w-0">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-8 rounded-2xl font-black text-lg capitalize transition-all duration-300 whitespace-nowrap animate-scale-in ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white shadow-2xl transform scale-110'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-slate-700 hover:scale-105'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {tab === 'overview' && '📊'}
                      {tab === 'transactions' && '💳'}
                      {tab === 'budgets' && '💰'}
                      {tab === 'savings' && '🎯'}
                      {tab === 'alerts' && '🔔'}
                    </span>
                    <span>{tab}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 p-8 sm:p-10 rounded-3xl border-4 border-green-300 dark:border-green-700 shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all transform hover:-translate-y-2 hover:scale-105 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-green-900 dark:text-green-300">Total Income</h3>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-xl">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-green-700 dark:text-green-400 drop-shadow-lg">{formatAmount(totalIncome)}</p>
              <p className="text-base sm:text-lg text-green-700 dark:text-green-400 mt-3 font-black">📈 +12.5% from last month</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-100 via-rose-100 to-pink-100 dark:from-red-900/30 dark:via-rose-900/30 dark:to-pink-900/30 p-8 sm:p-10 rounded-3xl border-4 border-red-300 dark:border-red-700 shadow-2xl hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all transform hover:-translate-y-2 hover:scale-105 animate-scale-in delay-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-red-900 dark:text-red-300">Total Expenses</h3>
                <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-2xl shadow-xl">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-red-700 dark:text-red-400 drop-shadow-lg">{formatAmount(totalExpenses)}</p>
              <p className="text-base sm:text-lg text-red-700 dark:text-red-400 mt-3 font-black">📉 -8.3% from last month</p>
            </div>
            
            <div className={`p-8 sm:p-10 rounded-3xl border-4 shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 animate-scale-in delay-200 ${
              balance >= 0 
                ? 'bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 dark:from-primary-900/30 dark:via-secondary-900/30 dark:to-accent-900/30 border-primary-300 dark:border-primary-700 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]' 
                : 'bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 border-amber-300 dark:border-amber-700 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl sm:text-2xl font-black ${balance >= 0 ? 'text-primary-900 dark:text-primary-300' : 'text-amber-900 dark:text-amber-300'}`}>Balance</h3>
                <div className={`p-4 rounded-2xl shadow-xl ${balance >= 0 ? 'bg-gradient-to-br from-primary-500 to-secondary-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className={`text-4xl sm:text-5xl lg:text-6xl font-black drop-shadow-lg ${balance >= 0 ? 'text-primary-700 dark:text-primary-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {formatAmount(balance)}
              </p>
              <p className={`text-base sm:text-lg mt-3 font-black ${balance >= 0 ? 'text-primary-700 dark:text-primary-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {balance >= 0 ? '✨ Great savings!' : '⚠️ Watch your spending'}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
            {/* Expense Categories Pie Chart */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border-4 border-primary-200 dark:border-primary-700 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all animate-slide-in-left">
              <h3 className="text-3xl sm:text-4xl font-black mb-8 flex items-center bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent drop-shadow-lg">
                <span className="bg-gradient-to-br from-primary-100 to-secondary-200 dark:from-primary-900 dark:to-secondary-900 p-4 rounded-2xl mr-4 text-4xl shadow-lg">📊</span>
                Expenses by Category
              </h3>
              {getCategoryData().length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={getCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatAmount(value), 'Amount']} contentStyle={{fontWeight: 'bold', fontSize: '16px'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
                  <div className="bg-neutral-100 dark:bg-slate-700 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                    <span className="text-5xl">📊</span>
                  </div>
                  <p className="font-black text-xl">No expense data available</p>
                </div>
              )}
            </div>

            {/* Monthly Income vs Expenses */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border-4 border-secondary-200 dark:border-secondary-700 hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all animate-slide-in-right">
              <h3 className="text-3xl sm:text-4xl font-black mb-8 flex items-center bg-gradient-to-r from-secondary-600 via-accent-600 to-danger-600 bg-clip-text text-transparent drop-shadow-lg">
                <span className="bg-gradient-to-br from-secondary-100 to-accent-200 dark:from-secondary-900 dark:to-accent-900 p-4 rounded-2xl mr-4 text-4xl shadow-lg">📈</span>
                Monthly Overview
              </h3>
              {getMonthlyData().length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={getMonthlyData()}>
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                    <Tooltip formatter={(value) => [formatAmount(value), '']} contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: '3px solid #e5e7eb', fontWeight: 'bold', fontSize: '16px'}} />
                    <Legend wrapperStyle={{ fontSize: '16px', fontWeight: 'bold' }} />
                    <Bar dataKey="income" fill="#22c55e" name="Income" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="expense" fill="#dc2626" name="Expenses" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
                  <div className="bg-neutral-100 dark:bg-slate-700 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                    <span className="text-5xl">📈</span>
                  </div>
                  <p className="font-black text-xl">No monthly data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="animate-slide-up">
            <TransactionList 
              transactions={transactions.slice(0, 5)} 
              onTransactionUpdated={fetchData}
              showLimited={true}
            />
          </div>
        </>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm onTransactionAdded={fetchData} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} onTransactionUpdated={fetchData} />
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          {isAuthenticated ? (
            <>
              <div className="flex justify-between items-center bg-gradient-to-r from-primary-50 to-neutral-50 p-6 rounded-2xl border border-primary-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy flex items-center">
                  <span className="bg-primary-100 p-3 rounded-xl mr-3 text-2xl">💰</span>
                  Budget Management
                </h2>
                <button 
                  onClick={() => setShowBudgetModal(true)}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl transition-all text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ➕ Create Budget
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {budgets.map(budget => (
                  <BudgetCard key={budget._id} budget={budget} transactions={transactions} onBudgetUpdated={fetchData} />
                ))}
              </div>
              {budgets.length === 0 && (
                <div className="text-center py-16 bg-gradient-to-br from-neutral-50 to-primary-50 rounded-2xl border-2 border-dashed border-primary-300">
                  <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">💰</span>
                  </div>
                  <p className="text-primary-800 font-semibold text-lg">No budgets created yet.</p>
                  <p className="text-primary-600 mt-2">Create your first budget to start tracking your spending.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-neutral-50 to-primary-50 rounded-2xl border-2 border-primary-200">
              <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔒</span>
              </div>
              <p className="text-primary-800 font-semibold text-lg">Please login to access budget features.</p>
            </div>
          )}
        </div>
      )}

      {/* Savings Goals Tab */}
      {activeTab === 'savings' && (
        <div className="space-y-6">
          {isAuthenticated ? (
            <>
              <div className="flex justify-between items-center bg-gradient-to-r from-success-50 to-neutral-50 p-6 rounded-2xl border border-success-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy flex items-center">
                  <span className="bg-success-100 p-3 rounded-xl mr-3 text-2xl">🎯</span>
                  Savings Goals
                </h2>
                <button 
                  onClick={() => setShowSavingsModal(true)}
                  className="bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ➕ Create Goal
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savingsGoals.map(goal => (
                  <SavingsGoalCard key={goal._id} goal={goal} currentBalance={balance} onSavingsUpdated={fetchData} />
                ))}
              </div>
              {savingsGoals.length === 0 && (
                <div className="text-center py-16 bg-gradient-to-br from-neutral-50 to-success-50 rounded-2xl border-2 border-dashed border-success-300">
                  <div className="bg-success-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">🎯</span>
                  </div>
                  <p className="text-success-800 font-semibold text-lg">No savings goals set yet.</p>
                  <p className="text-success-600 mt-2">Create your first goal to start saving.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-neutral-50 to-success-50 rounded-2xl border-2 border-success-200">
              <div className="bg-success-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔒</span>
              </div>
              <p className="text-success-800 font-semibold text-lg">Please login to access savings goals.</p>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-danger-50 to-neutral-50 p-6 rounded-2xl border border-danger-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy flex items-center">
              <span className="bg-danger-100 p-3 rounded-xl mr-3 text-2xl">🔔</span>
              Financial Alerts
            </h2>
            <button 
              onClick={fetchData}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl text-sm sm:text-base transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🔄 Refresh Alerts
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border-2 border-primary-200 shadow-lg">
            <h3 className="font-bold mb-4 text-navy text-lg flex items-center">
              <span className="bg-primary-100 p-2 rounded-lg mr-2">🔍</span>
              Debug Information
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-primary-800 flex justify-between">
                <span className="font-semibold">Authenticated:</span>
                <span className={`font-mono px-3 py-1 rounded-lg ${isAuthenticated ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'}`}>
                  {isAuthenticated ? '✅ YES' : '❌ NO'}
                </span>
              </p>
              <p className="text-primary-800 flex justify-between">
                <span className="font-semibold">User:</span>
                <span className="font-mono px-3 py-1 rounded-lg bg-primary-100 text-primary-800">{user?.name || 'None'}</span>
              </p>
              <p className="text-primary-800 flex justify-between">
                <span className="font-semibold">Token:</span>
                <span className={`font-mono px-3 py-1 rounded-lg ${localStorage.getItem('token') ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'}`}>
                  {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}
                </span>
              </p>
              <p className="text-primary-800 flex justify-between">
                <span className="font-semibold">Alerts Count:</span>
                <span className="font-mono px-3 py-1 rounded-lg bg-accent-100 text-accent-800">{alerts?.length || 0}</span>
              </p>
              <p className="text-primary-800 flex justify-between">
                <span className="font-semibold">Loading:</span>
                <span className={`font-mono px-3 py-1 rounded-lg ${loading ? 'bg-accent-100 text-accent-800' : 'bg-neutral-100 text-neutral-800'}`}>
                  {loading ? '⏳ YES' : '✅ NO'}
                </span>
              </p>
            </div>
          </div>
          
          <AlertsList alerts={alerts} onAlertsUpdated={fetchData} />
        </div>
      )}

      {/* Modals */}
      {showBudgetModal && (
        <BudgetModal 
          onClose={() => setShowBudgetModal(false)}
          onBudgetCreated={fetchData}
        />
      )}

      {showSavingsModal && (
        <SavingsGoalModal 
          onClose={() => setShowSavingsModal(false)}
          onGoalCreated={fetchData}
          currentBalance={balance}
        />
      )}
      </div>
    </div>
  )
}
