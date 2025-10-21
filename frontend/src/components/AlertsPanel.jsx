import React from 'react'
import AlertsList from './AlertsList'

export default function AlertsPanel({ alerts, onAlertsUpdated }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Alerts ({alerts.length})
          </h3>
          <AlertsList alerts={alerts} onAlertsUpdated={onAlertsUpdated} />
        </div>
      </div>
    </div>
  )
}