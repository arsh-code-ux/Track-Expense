import React from 'react'
import BudgetCard from './BudgetCard'

export default function BudgetManager({ budgets, transactions, onBudgetUpdated }) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Create your first budget to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map(budget => (
        <BudgetCard
          key={budget._id}
          budget={budget}
          transactions={transactions}
          onBudgetUpdated={onBudgetUpdated}
        />
      ))}
    </div>
  )
}