import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'

export default function TransactionForm({ onTransactionAdded }){
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated, token } = useAuth()
  const { currency } = useCurrency()

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other']

  const submit = async (e) => {
    e.preventDefault()
    
    // Reset error state
    setError('')
    
    // Validate form
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    setLoading(true)
    
    try {
      const url = isAuthenticated 
        ? `${API_BASE}/api/transactions`
        : `${API_BASE}/api/transactions/demo`
      
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Use token from context instead of localStorage
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      console.log('Submitting transaction:', { type, amount: Number(amount), category, notes })
      console.log('API URL:', url)
      console.log('Headers:', headers)

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          type, 
          amount: Number(amount), 
          category, 
          notes: notes || undefined
        })
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add transaction' }))
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const newTransaction = await response.json()
      console.log('Transaction created:', newTransaction)
      
      // Call the callback to refresh data
      if (onTransactionAdded) {
        onTransactionAdded(newTransaction)
      }
      
      // Reset form on success
      setAmount('')
      setNotes('')
      setError('')
      
      // Show success feedback
      alert('Transaction added successfully!')
      
    } catch (err) {
      console.error('Transaction submission error:', err)
      setError(`Failed to add transaction: ${err.message}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Transaction</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          >
            <option value="expense">💸 Expense</option>
            <option value="income">💰 Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount ({currency?.symbol || '$'})
          </label>
          <input 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            type="number" 
            step="0.01"
            min="0.01"
            placeholder="Enter amount..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <input 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            placeholder="Add a note..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !amount}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
            loading || !amount
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </div>
          ) : (
            '➕ Add Transaction'
          )}
        </button>
      </form>
    </div>
  )
}