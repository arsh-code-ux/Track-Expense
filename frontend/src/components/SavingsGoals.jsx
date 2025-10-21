import React from 'react'
import SavingsGoalCard from './SavingsGoalCard'

export default function SavingsGoals({ savings, onSavingsUpdated }) {
  if (!savings || savings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No savings goals yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Create your first savings goal to start building your future!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savings.map(goal => (
        <SavingsGoalCard
          key={goal._id}
          goal={goal}
          onSavingsUpdated={onSavingsUpdated}
        />
      ))}
    </div>
  )
}