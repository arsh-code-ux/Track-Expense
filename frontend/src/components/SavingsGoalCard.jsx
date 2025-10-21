import React from 'react'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'

export default function SavingsGoalCard({ goal, onSavingsUpdated, currentBalance = 0 }) {
  const { formatAmount } = useCurrency()
  const { getToken } = useAuth()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'
  
  // User sets initial current amount when creating goal
  // After that, we track their live account balance for progress
  const actualCurrentAmount = Math.max(0, currentBalance) 
  
  const progressPercentage = goal.targetAmount > 0 ? (actualCurrentAmount / goal.targetAmount) * 100 : 0
  const remaining = Math.max(0, goal.targetAmount - actualCurrentAmount)
  const isCompleted = actualCurrentAmount >= goal.targetAmount
  
  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (progressPercentage >= 75) return 'bg-blue-500'
    if (progressPercentage >= 50) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getCardColor = () => {
    if (isCompleted) return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
    return 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDaysRemaining = () => {
    if (!goal.deadline) return null
    const today = new Date()
    const targetDate = new Date(goal.deadline)
    const diffTime = targetDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

  const deleteSavingsGoal = async () => {
    if (!window.confirm(`Are you sure you want to delete the "${goal.title}" savings goal?`)) {
      return
    }

    try {
      const headers = {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }

      const response = await fetch(`${API_BASE}/api/savings-goals/${goal._id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        console.log('Savings goal deleted successfully')
        onSavingsUpdated && onSavingsUpdated() // Refresh savings goals list
      } else {
        console.error('Failed to delete savings goal')
        alert('Failed to delete savings goal. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting savings goal:', error)
      alert('Error deleting savings goal. Please try again.')
    }
  }

  return (
    <div className={`p-4 sm:p-6 rounded-xl border shadow-lg transition-colors ${getCardColor()}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">{goal.title}</h3>
          {goal.description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">{goal.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
          {isCompleted && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              ✓ Completed
            </span>
          )}
          <button
            onClick={deleteSavingsGoal}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
            title="Delete Savings Goal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">Target Amount</span>
          <span className="font-medium text-gray-900 dark:text-white break-all text-right">{formatAmount(goal.targetAmount)}</span>
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">Current Amount</span>
          <span className="font-medium text-green-600 dark:text-green-400 break-all text-right">{formatAmount(actualCurrentAmount)}</span>
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">Remaining</span>
          <span className={`font-medium break-all text-right ${remaining <= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
            {formatAmount(Math.max(0, remaining))}
          </span>
        </div>
        
        {goal.deadline && (
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600 dark:text-gray-400">Target Date</span>
            <span className="font-medium text-gray-900 dark:text-white text-right">{formatDate(goal.deadline)}</span>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.min(progressPercentage, 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Status Messages */}
        {!isCompleted && goal.deadline && (
          <div className="mt-4 space-y-2">
            {daysRemaining > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs space-y-1 sm:space-y-0">
                <span className="text-gray-500 dark:text-gray-400">
                  {daysRemaining} days remaining
                </span>
                {remaining > 0 && (
                  <span className="text-gray-500 dark:text-gray-400 break-all">
                    {formatAmount(remaining / Math.max(daysRemaining, 1))}/day needed
                  </span>
                )}
              </div>
            ) : (
              <div className="p-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                  ⚠️ Target date has passed
                </p>
              </div>
            )}
          </div>
        )}
        
        {isCompleted && (
          <div className="mt-4 p-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-300 font-medium break-words">
              🎉 Goal achieved! Great job saving!
            </p>
          </div>
        )}
        
        {progressPercentage >= 90 && !isCompleted && (
          <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium break-words">
              🎯 You're almost there! Just {formatAmount(remaining)} to go!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}