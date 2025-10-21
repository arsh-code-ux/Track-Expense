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
  const [activeTab, setActiveTab] = useState('overview')
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showSavingsModal, setShowSavingsModal] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { formatAmount } = useCurrency()

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  useEffect(() => {
    fetchData()
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('=== FETCHDATA CALLED ===')
      console.log('Is authenticated:', isAuthenticated)
      console.log('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing')
      
      // Fetch transactions
      const transactionsUrl = isAuthenticated 
        ? `${API_BASE}/api/transactions`
        : `${API_BASE}/api/transactions/demo`
      
      const transactionsResponse = await fetch(transactionsUrl, {
        headers: isAuthenticated ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      })
      const transactionsData = await transactionsResponse.json()
      
      if (Array.isArray(transactionsData)) {
        setTransactions(transactionsData)
      } else {
        console.error('Transaction fetch error:', transactionsData)
        setTransactions([])
      }

      // Fetch budgets if authenticated
      if (isAuthenticated) {
        const budgetsResponse = await fetch(`${API_BASE}/api/budgets`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        const budgetsData = await budgetsResponse.json()
        if (Array.isArray(budgetsData)) {
          setBudgets(budgetsData)
        }

        // Fetch savings goals
        const savingsResponse = await fetch(`${API_BASE}/api/savings-goals`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        const savingsData = await savingsResponse.json()
        if (Array.isArray(savingsData)) {
          setSavingsGoals(savingsData)
        }

        // Fetch alerts
        console.log('=== FETCHING ALERTS ===')
        const alertsResponse = await fetch(`${API_BASE}/api/alerts`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        
        console.log('Alerts response status:', alertsResponse.status)
        console.log('Alerts response ok:', alertsResponse.ok)
        
        if (!alertsResponse.ok) {
          console.error('Alerts fetch failed:', alertsResponse.status, alertsResponse.statusText)
          setAlerts([])
          return
        }
        
        const alertsData = await alertsResponse.json()
        console.log('Alerts data received:', alertsData)
        console.log('Alerts data type:', typeof alertsData)
        console.log('Is alerts array?', Array.isArray(alertsData))
        
        if (Array.isArray(alertsData)) {
          setAlerts(alertsData)
          console.log('Set alerts state with', alertsData.length, 'alerts')
        } else {
          console.error('Alerts response is not an array:', alertsData)
          setAlerts([])
        }
      }

      // Always try to fetch demo alerts regardless of authentication state
      console.log('=== FETCHING DEMO ALERTS ===')
      try {
        const demoAlertsResponse = await fetch(`${API_BASE}/api/alerts/demo`)
        console.log('Demo alerts response status:', demoAlertsResponse.status)
        if (demoAlertsResponse.ok) {
          const demoAlertsData = await demoAlertsResponse.json()
          console.log('Demo alerts received:', demoAlertsData)
          console.log('Demo alerts length:', demoAlertsData.length)
          if (Array.isArray(demoAlertsData)) {
            setAlerts(demoAlertsData)
            console.log('✅ Set demo alerts state with', demoAlertsData.length, 'alerts')
          }
        } else {
          console.error('Demo alerts fetch failed:', demoAlertsResponse.status)
        }
      } catch (error) {
        console.error('Error fetching demo alerts:', error)
        setAlerts([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isAuthenticated ? `Welcome back, ${user?.name || 'User'}!` : 'Expense Tracker Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {isAuthenticated ? 'Here\'s your financial overview' : 'Demo mode - Track your expenses'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700 transition-colors">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Total Income</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">{formatAmount(totalIncome)}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl border border-red-200 dark:border-red-700 transition-colors">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-300">{formatAmount(totalExpenses)}</p>
            </div>
            <div className={`p-6 rounded-xl border transition-colors ${balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700'}`}>
              <h3 className={`text-lg font-semibold ${balance >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'}`}>Balance</h3>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-300' : 'text-orange-600 dark:text-orange-300'}`}>
                {formatAmount(balance)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Expense Categories Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Expenses by Category</h3>
              {getCategoryData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatAmount(value), 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500 dark:text-gray-400">
                  No expense data available
                </div>
              )}
            </div>

            {/* Monthly Income vs Expenses */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Overview</h3>
              {getMonthlyData().length > 0 ? (
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <BarChart data={getMonthlyData()}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatAmount(value), '']} />
                    <Legend />
                    <Bar dataKey="income" fill="#10B981" name="Income" />
                    <Bar dataKey="expense" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  No monthly data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Transactions</h3>
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Management</h2>
                <button 
                  onClick={() => setShowBudgetModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Create Budget
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {budgets.map(budget => (
                  <BudgetCard key={budget._id} budget={budget} transactions={transactions} />
                ))}
              </div>
              {budgets.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No budgets created yet. Create your first budget to start tracking your spending.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Please login to access budget features.</p>
            </div>
          )}
        </div>
      )}

      {/* Savings Goals Tab */}
      {activeTab === 'savings' && (
        <div className="space-y-6">
          {isAuthenticated ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
                <button 
                  onClick={() => setShowSavingsModal(true)}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Goal
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {savingsGoals.map(goal => (
                  <SavingsGoalCard key={goal._id} goal={goal} />
                ))}
              </div>
              {savingsGoals.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No savings goals set yet. Create your first goal to start saving.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Please login to access savings goals.</p>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Financial Alerts</h2>
            <button 
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition-colors"
            >
              Refresh Alerts
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Debug Information:</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700 dark:text-gray-300">Authenticated: <span className="font-mono text-blue-600 dark:text-blue-400">{isAuthenticated ? 'YES' : 'NO'}</span></p>
              <p className="text-gray-700 dark:text-gray-300">User: <span className="font-mono text-blue-600 dark:text-blue-400">{user?.name || 'None'}</span></p>
              <p className="text-gray-700 dark:text-gray-300">Token: <span className="font-mono text-blue-600 dark:text-blue-400">{localStorage.getItem('token') ? 'Present' : 'Missing'}</span></p>
              <p className="text-gray-700 dark:text-gray-300">Alerts Count: <span className="font-mono text-blue-600 dark:text-blue-400">{alerts?.length || 0}</span></p>
              <p className="text-gray-700 dark:text-gray-300">Loading: <span className="font-mono text-blue-600 dark:text-blue-400">{loading ? 'YES' : 'NO'}</span></p>
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
  )
}
