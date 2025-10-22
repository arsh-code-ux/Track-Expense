import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function FloatingActionButtons() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const actions = [
    {
      icon: '📊',
      label: 'Analytics',
      color: 'from-orange-400 to-red-500',
      action: () => {
        setIsOpen(false)
        console.log('📊 Analytics button clicked - navigating to dashboard')
        navigate('/dashboard')
        // Switch to overview tab first, then scroll to charts section
        setTimeout(() => {
          console.log('🔍 Looking for overview tab...')
          // Click the overview tab
          const overviewTab = document.querySelector('[data-tab="overview"]')
          console.log('📈 Overview tab found:', !!overviewTab)
          if (overviewTab) {
            overviewTab.click()
            console.log('✅ Overview tab clicked')
            // Wait for tab switch, then scroll to charts
            setTimeout(() => {
              console.log('🔍 Looking for charts section...')
              const chartsSection = document.querySelector('[data-section="charts"]')
              console.log('📊 Charts section found:', !!chartsSection)
              if (chartsSection) {
                chartsSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                console.log('✅ Scrolled to charts section')
              } else {
                console.log('❌ Charts section not found!')
              }
            }, 500)
          } else {
            console.log('❌ Overview tab not found!')
          }
        }, 300)
      }
    },
    {
      icon: '🎯',
      label: 'Set Budget',
      color: 'from-blue-400 to-indigo-500',
      action: () => {
        setIsOpen(false)
        console.log('🎯 Budget button clicked - navigating to dashboard')
        navigate('/dashboard')
        // Switch to budgets tab first, then trigger budget modal
        setTimeout(() => {
          console.log('🔍 Looking for budgets tab...')
          // Click the budgets tab
          const budgetsTab = document.querySelector('[data-tab="budgets"]')
          console.log('📋 Budgets tab found:', !!budgetsTab)
          if (budgetsTab) {
            budgetsTab.click()
            console.log('✅ Budgets tab clicked')
            // Wait for tab switch, then click create budget
            setTimeout(() => {
              console.log('🔍 Looking for create budget button...')
              const budgetButton = document.querySelector('[data-action="create-budget"]')
              console.log('💰 Create budget button found:', !!budgetButton)
              if (budgetButton) {
                budgetButton.click()
                console.log('✅ Create budget button clicked')
              } else {
                console.log('❌ Create budget button not found!')
              }
            }, 500)
          } else {
            console.log('❌ Budgets tab not found!')
          }
        }, 300)
      }
    },
    {
      icon: '💰',
      label: 'Savings Goal',
      color: 'from-green-400 to-emerald-500',
      action: () => {
        setIsOpen(false)
        console.log('💰 Savings Goal button clicked - navigating to dashboard')
        navigate('/dashboard')
        // Switch to savings tab first, then trigger savings goal modal
        setTimeout(() => {
          console.log('🔍 Looking for savings tab...')
          // Click the savings tab
          const savingsTab = document.querySelector('[data-tab="savings"]')
          console.log('🎯 Savings tab found:', !!savingsTab)
          if (savingsTab) {
            savingsTab.click()
            console.log('✅ Savings tab clicked')
            // Wait for tab switch, then click create savings goal
            setTimeout(() => {
              console.log('🔍 Looking for create savings goal button...')
              const savingsButton = document.querySelector('[data-action="create-savings-goal"]')
              console.log('💎 Create savings goal button found:', !!savingsButton)
              if (savingsButton) {
                savingsButton.click()
                console.log('✅ Create savings goal button clicked')
              } else {
                console.log('❌ Create savings goal button not found!')
              }
            }, 500)
          } else {
            console.log('❌ Savings tab not found!')
          }
        }, 300)
      }
    },
    {
      icon: '💡',
      label: 'AI Assistant',
      color: 'from-purple-400 to-pink-500',
      action: () => {
        setIsOpen(false)
        navigate('/chat')
      }
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300 transform ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={`transform transition-all duration-300 ${
              isOpen ? 'scale-100 translate-x-0' : 'scale-0 translate-x-10'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <button
              onClick={action.action}
              className={`flex items-center space-x-3 bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group`}
            >
              <span className="text-xl group-hover:animate-bounce">{action.icon}</span>
              <span className="font-semibold text-sm whitespace-nowrap">{action.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <span className={`text-2xl transition-transform duration-300 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}>
          {isOpen ? '✕' : '⚡'}
        </span>
        
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-ping opacity-20"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-10"></div>
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Quick Actions
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  )
}