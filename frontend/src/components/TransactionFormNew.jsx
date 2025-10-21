import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDataSync } from '../contexts/DataSyncContext'

const TransactionForm = ({ onTransactionAdd, isDarkMode, onClose }) => {
  const { getToken, isAuthenticated } = useAuth()
  const { transactionOperations } = useDataSync()
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  const categories = {
    expense: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    if (!formData.category) {
      setError('Please select a category')
      return false
    }
    if (!formData.description.trim()) {
      setError('Please enter a description')
      return false
    }
    if (!formData.date) {
      setError('Please select a date')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    if (!isAuthenticated) {
      setError('Please log in to add transactions')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Submitting transaction via sync context:', formData)

      // Use the sync context transaction operation
      const data = await transactionOperations.add({
        ...formData,
        amount: parseFloat(formData.amount)
      })

      console.log('Transaction added successfully with auto-sync:', data)
      
      setSuccess('Transaction added successfully! All data refreshed.')
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })

      // Call parent callback
      if (onTransactionAdd) {
        onTransactionAdd(data)
      }

      // Auto-close after success
      setTimeout(() => {
        onClose && onClose()
      }, 1500)

    } catch (error) {
      console.error('Error adding transaction:', error)
      setError(error.message || 'Failed to add transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Transaction</h2>
        {onClose && (
          <button
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-700 text-xl ${isDarkMode ? 'hover:text-gray-300' : ''}`}
          >
            ×
          </button>
        )}
      </div>

      {/* Authentication Status */}
      <div className="mb-4">
        <span className={`text-sm px-2 py-1 rounded ${
          isAuthenticated 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isAuthenticated ? '✓ Authenticated' : '✗ Not Authenticated'}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
          <strong>Success:</strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Expense
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Income
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="0.00"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Select a category</option>
            {categories[formData.type].map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Enter description"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isAuthenticated}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
            loading || !isAuthenticated
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adding Transaction...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
}

export default TransactionForm