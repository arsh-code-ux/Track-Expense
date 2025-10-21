import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDataSync } from '../contexts/DataSyncContext'

export default function AlertsList({ alerts, onAlertsUpdated }) {
  const { getToken } = useAuth()
  const { syncTrigger, refreshData } = useDataSync()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  console.log('=== ALERTSLIST RENDER ===')
  console.log('Alerts prop:', alerts)
  console.log('Alerts length:', alerts?.length || 'undefined')
  console.log('Alerts type:', typeof alerts)

  // Refresh alerts when sync trigger fires
  useEffect(() => {
    if (syncTrigger > 0) {
      console.log('🔔 Alerts refreshing due to data sync...')
      // Only call onAlertsUpdated, don't call refreshData to avoid circular dependency
      onAlertsUpdated && onAlertsUpdated()
    }
  }, [syncTrigger]) // Remove functions from dependencies to prevent infinite loops

  const getAlertIcon = (type) => {
    switch (type) {
      case 'budget_exceeded':
        return '🚨'
      case 'budget_warning':
        return '⚠️'
      case 'low_balance':
        return '💸'
      case 'negative_balance':
        return '🔴'
      case 'no_savings':
        return '💔'
      case 'low_savings_rate':
        return '📉'
      case 'expense_trend':
        return '📈'
      case 'no_budget':
        return '💡'
      case 'no_savings_goals':
        return '🎯'
      case 'goal_achieved':
        return '🎉'
      case 'goal_milestone':
        return '🎯'
      case 'recurring_due':
        return '📅'
      default:
        return 'ℹ️'
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'budget_exceeded':
      case 'negative_balance':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
      case 'budget_warning':
      case 'low_balance':
      case 'no_savings':
      case 'expense_trend':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
      case 'goal_achieved':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
      case 'goal_milestone':
      case 'no_budget':
      case 'no_savings_goals':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
      case 'low_savings_rate':
        return 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
      case 'recurring_due':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
      default:
        return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const deleteAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) {
      return
    }

    try {
      const headers = {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }

      const response = await fetch(`${API_BASE}/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        console.log('Alert deleted successfully')
        onAlertsUpdated && onAlertsUpdated() // Refresh alerts list
      } else {
        console.error('Failed to delete alert')
        alert('Failed to delete alert. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
      alert('Error deleting alert. Please try again.')
    }
  }

  const markAsRead = async (alertId) => {
    try {
      await fetch(`${API_BASE}/api/alerts/${alertId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      })
      onAlertsUpdated()
    } catch (error) {
      console.error('Error marking alert as read:', error)
    }
  }

  const refreshAlerts = async () => {
    try {
      console.log('🔄 Refreshing alerts...')
      
      const token = getToken()
      const endpoint = token ? '/api/alerts/refresh' : '/api/alerts/refresh/demo'
      
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers
      })

      if (response.ok) {
        console.log('✅ Alerts refreshed successfully')
        onAlertsUpdated && onAlertsUpdated() // Refresh alerts list
      } else {
        console.error('Failed to refresh alerts')
      }
    } catch (error) {
      console.error('Error refreshing alerts:', error)
    }
  }

  const unreadAlerts = alerts?.filter(alert => !alert.isRead) || []
  const readAlerts = alerts?.filter(alert => alert.isRead) || []

  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-4">🔕</div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">No alerts yet</h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
          You'll see notifications here when budgets are exceeded, goals are achieved, or other important events occur.
        </p>
        <button
          onClick={refreshAlerts}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="mr-2">🔄</span>
          Check for Alerts
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {alerts.length} total alerts ({unreadAlerts.length} unread)
        </div>
        <button
          onClick={refreshAlerts}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="mr-1">🔄</span>
          Refresh
        </button>
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Unread Alerts ({unreadAlerts.length})
          </h3>
          <div className="space-y-3">
            {unreadAlerts.map(alert => (
              <div
                key={alert._id}
                className={`p-3 sm:p-4 rounded-lg border-l-4 transition-colors ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium break-words">{alert.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {formatDate(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                    <button
                      onClick={() => markAsRead(alert._id)}
                      className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors whitespace-nowrap"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => deleteAlert(alert._id)}
                      className="text-sm px-2 py-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Recent Alerts ({readAlerts.length})
          </h3>
          <div className="space-y-3">
            {readAlerts.slice(0, 10).map(alert => (
              <div
                key={alert._id}
                className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-75 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <span className="text-base sm:text-lg opacity-50 flex-shrink-0">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-200 break-words">{alert.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAlert(alert._id)}
                    className="text-sm px-2 py-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}