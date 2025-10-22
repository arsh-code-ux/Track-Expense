import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useDataSync } from '../contexts/DataSyncContext'
import { getApiUrl, getApiHeaders } from '../utils/apiConfig'

export default function TransactionList({ transactions, onTransactionUpdated, showLimited = false }){
  const { isAuthenticated, getToken } = useAuth()
  const { formatAmount } = useCurrency()
  const { transactionOperations, refreshData } = useDataSync()

  const del = async (id)=>{
    try{
      if (isAuthenticated) {
        // Use sync context for authenticated users
        await transactionOperations.delete(id)
        console.log('✅ Transaction deleted via sync context, all data refreshed')
      } else {
        // Fallback for demo mode
        const API_BASE = getApiUrl()
        const url = `${API_BASE}/api/transactions/demo/${id}`
        const response = await fetch(url, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete transaction')
        }
        
        // Refresh all data including alerts for demo mode
        await refreshData(['all'])
      }

      onTransactionUpdated && onTransactionUpdated()
    }catch(err){
      console.error(err)
      alert('Failed to delete transaction: ' + err.message)
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍽️',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Healthcare': '⚕️',
      'Education': '📚',
      'Travel': '✈️',
      'Other': '📝'
    }
    return icons[category] || '💰'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const displayTransactions = showLimited ? transactions.slice(0, 5) : transactions

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {showLimited ? 'Recent Transactions' : 'All Transactions'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {showLimited ? 'Your latest financial activities' : `Total: ${transactions.length} transactions`}
        </p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto scrollbar-thin">
        {displayTransactions.length === 0 ? (
          <div className="px-4 sm:px-6 py-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">💳</div>
            <p className="text-gray-500 dark:text-gray-400">No transactions yet. Add your first transaction!</p>
          </div>
        ) : (
          displayTransactions.map(tx=> (
            <div key={tx._id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                
                {/* Left side - Transaction info */}
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <div className="text-xl sm:text-2xl flex-shrink-0">
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">{tx.category}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full self-start sm:self-auto mt-1 sm:mt-0 ${
                        tx.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {tx.type === 'income' ? '↗️ Income' : '↘️ Expense'}
                      </span>
                    </div>
                    {tx.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">{tx.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>
                
                {/* Right side - Amount and delete button */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <p className={`text-lg font-bold break-all ${
                      tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                    </p>
                  </div>
                  <button 
                    onClick={()=>del(tx._id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    title="Delete transaction"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {showLimited && transactions.length > 5 && (
        <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700 text-center border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {Math.min(5, transactions.length)} of {transactions.length} transactions
          </p>
        </div>
      )}
    </div>
  )
}
