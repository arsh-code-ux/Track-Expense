import React from 'react'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { getApiUrl, getApiHeaders } from '../utils/apiConfig'

export default function BudgetCard({ budget, transactions, onBudgetUpdated }) {
  const { formatAmount } = useCurrency()
  const { getToken } = useAuth()
  
  // Calculate spent amount based on transactions in this budget's category and period
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const spent = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return (
        transaction.type === 'expense' &&
        transaction.category === budget.category &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      )
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const remaining = budget.amount - spent
  const percentageSpent = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
  
  const getProgressColor = () => {
    if (percentageSpent <= 50) return 'bg-green-500'
    if (percentageSpent <= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getCardColor = () => {
    if (percentageSpent <= 50) return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
    if (percentageSpent <= 80) return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
    return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
  }

  const deleteBudget = async () => {
    if (!window.confirm(`Are you sure you want to delete the ${budget.category} budget?`)) {
      return
    }

    try {
      const API_BASE = getApiUrl()
      const token = getToken()

      console.log('🗑️ Deleting budget at:', API_BASE)

      const response = await fetch(`${API_BASE}/api/budgets/${budget._id}`, {
        method: 'DELETE',
        headers: getApiHeaders(token)
      })

      if (response.ok) {
        console.log('Budget deleted successfully')
        onBudgetUpdated && onBudgetUpdated() // Refresh budgets list
      } else {
        console.error('Failed to delete budget')
        alert('Failed to delete budget. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
      alert('Error deleting budget. Please try again.')
    }
  }

  return (
    <div className={`p-4 sm:p-6 rounded-xl border ${getCardColor()} transition-colors`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
          {budget.category}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {budget.period === 'monthly' ? 'Monthly' : 'Weekly'}
          </span>
          <button
            onClick={deleteBudget}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
            title="Delete Budget"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">Budget</span>
          <span className="font-medium text-gray-900 dark:text-white break-all text-right">{formatAmount(budget.amount)}</span>
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">Spent</span>
          <span className="font-medium text-gray-900 dark:text-white break-all text-right">{formatAmount(spent)}</span>
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">Remaining</span>
          <span className={`font-medium break-all text-right ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatAmount(remaining)}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.min(percentageSpent, 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentageSpent, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {percentageSpent > 100 && (
          <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-300 font-medium break-words">
              ⚠️ Budget exceeded by {formatAmount(spent - budget.amount)}
            </p>
          </div>
        )}
        
        {percentageSpent > 80 && percentageSpent <= 100 && (
          <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
              ⚠️ Approaching budget limit
            </p>
          </div>
        )}
      </div>
    </div>
  )
}