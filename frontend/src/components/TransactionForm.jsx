import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useDataSync } from '../contexts/DataSyncContext'

export default function TransactionForm({ onTransactionAdded }){
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, getToken } = useAuth()
  const { currency } = useCurrency()
  const { refreshData } = useDataSync()

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other']

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    
    console.log('💰 Starting transaction submission...')
    console.log('🔐 Is authenticated:', isAuthenticated)
    console.log('📍 API_BASE:', API_BASE)
    console.log('📝 Form data:', { type, amount, category, notes })
    
    try{
      const url = isAuthenticated 
        ? `${API_BASE}/api/transactions`
        : `${API_BASE}/api/transactions/demo`
      
      console.log('🌐 Request URL:', url)
      
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (isAuthenticated) {
        const token = getToken()
        console.log('🎫 Token exists:', !!token)
        headers['Authorization'] = `Bearer ${token}`
      }

      const requestBody = { 
        type, 
        amount: Number(amount), 
        category, 
        notes: notes || undefined
      }
      
      console.log('📦 Request body:', requestBody)
      console.log('📋 Request headers:', headers)

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      console.log('📊 Response status:', response.status)
      console.log('📊 Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        throw new Error('Failed to add transaction')
      }

      const newTransaction = await response.json()
      console.log('✅ Transaction added successfully:', newTransaction)
      
      onTransactionAdded && onTransactionAdded(newTransaction)
      
      // Refresh all data including alerts, budgets, and savings goals
      await refreshData(['all'])
      
      // Reset form
      setAmount('')
      setNotes('')
    }catch(err){
      console.error(err)
      alert('Failed to add transaction: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Transaction</h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <select 
            value={type} 
            onChange={e=>setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          >
            <option value="expense">💸 Expense</option>
            <option value="income">💰 Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount ({currency?.symbol})
          </label>
          <input 
            value={amount} 
            onChange={e=>setAmount(e.target.value)} 
            type="number" 
            step="0.01"
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
            onChange={e=>setCategory(e.target.value)}
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
            onChange={e=>setNotes(e.target.value)} 
            placeholder="Add a note..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
            loading 
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
          }`}
        >
          {loading ? 'Adding...' : '➕ Add Transaction'}
        </button>
      </form>
    </div>
  )
}
