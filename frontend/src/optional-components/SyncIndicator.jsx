import React from 'react'
import { useDataSync } from '../contexts/DataSyncContext'

export default function SyncIndicator() {
  const { isLoading, lastSyncTime, syncTrigger } = useDataSync()

  if (!isLoading && syncTrigger === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className={`
        px-4 py-2 rounded-lg shadow-lg border transition-all duration-300
        ${isLoading 
          ? 'bg-blue-500 text-white border-blue-600 animate-pulse' 
          : 'bg-green-500 text-white border-green-600'
        }
      `}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
          <span className="text-sm font-medium">
            {isLoading ? 'Syncing data...' : `Synced at ${lastSyncTime.toLocaleTimeString()}`}
          </span>
        </div>
      </div>
    </div>
  )
}