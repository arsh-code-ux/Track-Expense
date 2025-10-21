import React, { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW' },
  MXN: { symbol: '$', name: 'Mexican Peso', code: 'MXN' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', code: 'NZD' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', code: 'SEK' },
  DKK: { symbol: 'kr', name: 'Danish Krone', code: 'DKK' },
  PLN: { symbol: 'zł', name: 'Polish Zloty', code: 'PLN' },
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR' }
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Safe localStorage access
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency')
      return saved || 'USD'
    }
    return 'USD'
  })

  // Load user preferences from backend
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return
        
        const token = localStorage.getItem('token')
        if (token) {
          const response = await fetch('http://localhost:3005/api/preferences', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.preferences?.currency) {
              setCurrency(data.preferences.currency)
            }
          }
        }
      } catch (error) {
        console.log('Could not load user preferences:', error)
        // Fallback to localStorage
      }
    }

    loadUserPreferences()
  }, [])

  // Save to localStorage and backend
  useEffect(() => {
    // Safe localStorage access
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', currency)
    }
    
    // Save to backend if user is authenticated
    const saveToBackend = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return
        
        const token = localStorage.getItem('token')
        if (token) {
          await fetch('http://localhost:3005/api/preferences', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currency })
          })
        }
      } catch (error) {
        console.log('Could not save currency preference:', error)
      }
    }

    saveToBackend()
  }, [currency])

  const formatAmount = (amount, showCode = false) => {
    const currencyInfo = currencies[currency]
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
    
    if (showCode) {
      return `${currencyInfo.symbol}${formattedAmount} ${currency}`
    }
    return `${currencyInfo.symbol}${formattedAmount}`
  }

  const value = {
    currency,
    setCurrency,
    currencies,
    formatAmount,
    currencyInfo: currencies[currency]
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}