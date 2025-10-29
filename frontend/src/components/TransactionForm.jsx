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
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 hover:shadow-2xl transition-all">
      <h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
        <span className="bg-primary-100 p-2 rounded-lg mr-3">💰</span>
        Add New Transaction
      </h3>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Transaction Type
          </label>
          <select 
            value={type} 
            onChange={e=>setType(e.target.value)}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl bg-white text-navy focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            <option value="expense">💸 Expense</option>
            <option value="income">💰 Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Amount ({currency?.symbol})
          </label>
          <input 
            value={amount} 
            onChange={e=>setAmount(e.target.value)} 
            type="number" 
            step="0.01"
            placeholder="Enter amount..."
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl bg-white text-navy placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Category
          </label>
          <select 
            value={category} 
            onChange={e=>setCategory(e.target.value)}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl bg-white text-navy focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Notes (Optional)
          </label>
          <input 
            value={notes} 
            onChange={e=>setNotes(e.target.value)} 
            placeholder="Add a note..."
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl bg-white text-navy placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 px-4 rounded-xl font-bold transition-all text-base transform ${
            loading 
              ? 'bg-neutral-300 cursor-not-allowed text-neutral-500' 
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Adding...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              ➕ Add Transaction
            </span>
          )}
        </button>
      </form>
    </div>
  )
}
