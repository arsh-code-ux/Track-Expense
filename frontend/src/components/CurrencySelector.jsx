import React from 'react'
import { useCurrency } from '../context/CurrencyContext'

export default function CurrencySelector({ className = '' }) {
  const { currency, setCurrency, currencies } = useCurrency()

  return (
    <div className={`relative ${className}`}>
      <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        💰 Currency
      </label>
      <select
        id="currency-select"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {Object.entries(currencies).map(([code, info]) => (
          <option key={code} value={code}>
            {info.symbol} {info.name} ({code})
          </option>
        ))}
      </select>
      
      {/* Currency Preview */}
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">Preview:</div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {currencies[currency]?.symbol}1,234.56
        </div>
      </div>
    </div>
  )
}