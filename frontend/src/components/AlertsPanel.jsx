import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getApiUrl, getApiHeaders, handleApiError } from '../utils/apiConfig'
import AlertsList from './AlertsList'

export default function AlertsPanel({ alerts, onAlertsUpdated }) {
  const { getToken } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [hasTriedAutoGenerate, setHasTriedAutoGenerate] = useState(false)
  
  const API_BASE = getApiUrl()

  // Auto-generate alerts if none exist and user is authenticated
  useEffect(() => {
    const autoGenerateAlerts = async () => {
      const token = getToken()
      if (!token || alerts.length > 0 || isGenerating || hasTriedAutoGenerate) return

      console.log('🚨 No alerts found, auto-generating alerts...')
      console.log('🌐 Using API URL:', API_BASE)
      setIsGenerating(true)
      setError(null)

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const response = await fetch(`${API_BASE}/api/alerts/refresh`, {
          method: 'POST',
          headers: getApiHeaders(token),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          console.log('✅ Alerts generated successfully')
          setHasTriedAutoGenerate(true)
          // Refresh the alerts data
          onAlertsUpdated && onAlertsUpdated()
        } else {
          console.log('❌ Failed to generate alerts, status:', response.status)
          if (response.status === 401) {
            setError('Authentication failed. Please try logging in again.')
          } else if (response.status >= 500) {
            setError('Server error. Please try again later.')
          } else {
            setError(`Failed to generate alerts (${response.status})`)
          }
        }
      } catch (error) {
        console.error('Error generating alerts:', error)
        setError(handleApiError(error, 'Alert generation'))
      } finally {
        setIsGenerating(false)
        setHasTriedAutoGenerate(true)
      }
    }

    // Only auto-generate after a short delay to prevent rapid calls
    const timer = setTimeout(autoGenerateAlerts, 2000) // Increased delay for deployment
    return () => clearTimeout(timer)
  }, [alerts.length, getToken, onAlertsUpdated, isGenerating, hasTriedAutoGenerate, API_BASE])

  const handleManualRefresh = async () => {
    const token = getToken()
    if (!token || isGenerating) return

    setIsGenerating(true)
    setError(null)
    
    try {
      console.log('🔄 Manual refresh using API:', API_BASE)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout for manual refresh

      const response = await fetch(`${API_BASE}/api/alerts/refresh`, {
        method: 'POST',
        headers: getApiHeaders(token),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        console.log('✅ Alerts refreshed successfully')
        setError(null)
        setHasTriedAutoGenerate(false) // Reset to allow future auto-generation
        onAlertsUpdated && onAlertsUpdated()
      } else {
        console.log('❌ Manual refresh failed, status:', response.status)
        if (response.status === 401) {
          setError('Authentication expired. Please log in again.')
        } else if (response.status >= 500) {
          setError('Server error. The backend may be starting up. Please wait a moment and try again.')
        } else {
          setError(`Failed to refresh alerts (Status: ${response.status})`)
        }
      }
    } catch (error) {
      console.error('Error refreshing alerts:', error)
      setError(handleApiError(error, 'Alert refresh'))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Alerts ({alerts.length})
            </h3>
            <button
              onClick={handleManualRefresh}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  🔄 Refresh Alerts
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <div className="text-red-500 dark:text-red-400 mr-3 mt-0.5">⚠️</div>
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Alert Generation Error</h4>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-2 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && alerts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Generating Your Alerts
                </h4>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  We're analyzing your transactions, budgets, and savings goals to create personalized financial insights...
                </p>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  This may take a few moments on first load
                </div>
              </div>
            </div>
          ) : (
            <AlertsList alerts={alerts} onAlertsUpdated={onAlertsUpdated} />
          )}

          {/* Debug Info in Development */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              <strong>Debug Info:</strong><br />
              API URL: {API_BASE}<br />
              Environment: {import.meta.env.MODE}<br />
              Has tried auto-generate: {hasTriedAutoGenerate.toString()}<br />
              Is generating: {isGenerating.toString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}