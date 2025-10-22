import React, { useState, useEffect } from 'react'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { useDataSync } from '../contexts/DataSyncContext'
import { getApiUrl, getApiHeaders } from '../utils/apiConfig'

export default function SavingsGoalModal({ onClose, onGoalCreated, currentBalance = 0 }) {
  const { getToken } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { formatAmount } = useCurrency()
  const { isAuthenticated } = useAuth()
  const { refreshData } = useDataSync()

  // Pre-fill current amount with user's current balance
  useEffect(() => {
    if (currentBalance > 0) {
      setFormData(prev => ({
        ...prev,
        currentAmount: currentBalance.toString()
      }))
    }
  }, [currentBalance])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError('Please login to create savings goals')
      return
    }

    setLoading(true)
    setError('')

    try {
      const API_BASE = getApiUrl()
      const token = getToken()

      console.log('🎯 Creating savings goal at:', API_BASE)

      const response = await fetch(`${API_BASE}/api/savings-goals`, {
        method: 'POST',
        headers: getApiHeaders(token),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount) || 0,
          deadline: formData.deadline
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create savings goal')
      }

      const newGoal = await response.json()
      onGoalCreated(newGoal)
      
      // Refresh all data including alerts
      await refreshData(['all'])
      
      setFormData({ title: '', description: '', targetAmount: '', currentAmount: '', deadline: '' })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate default date (6 months from now)
  const defaultDate = new Date()
  defaultDate.setMonth(defaultDate.getMonth() + 6)
  const defaultDateString = defaultDate.toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Create Savings Goal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your goal"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="How much do you want to save?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              placeholder={`Enter your current savings amount (Current Balance: ${formatAmount(currentBalance)})`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Your account balance is {formatAmount(currentBalance)}. Enter how much you want to allocate for this goal.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Date *
            </label>
            <input
              type="date"
              value={formData.deadline || defaultDateString}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}