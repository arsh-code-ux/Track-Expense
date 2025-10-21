import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ChatPage(){
  const [messages, setMessages] = useState([
    { 
      from: 'bot', 
      text: 'Hi! 👋 I\'m your personal finance assistant. I can help you understand your spending patterns, provide budgeting advice, and answer questions about your financial data. Ask me anything!' 
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated, token } = useAuth()

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  const send = async () => {
    if (!input.trim()) return;
    
    const userMsg = { from: 'user', text: input }
    setMessages(m => [...m, userMsg])
    setLoading(true)
    setError('')
    
    const userInput = input
    setInput('')
    
    try{
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Use token from context instead of localStorage
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      console.log('Sending chat message:', userInput)
      console.log('API URL:', `${API_BASE}/api/chat`)
      console.log('Headers:', headers)
      
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userInput })
      })
      
      console.log('Chat response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Chat response data:', data)
      
      if (data.reply) {
        setMessages(m => [...m, { from: 'bot', text: data.reply }])
      } else {
        throw new Error('No reply received from server')
      }
      
    } catch(err) {
      console.error('Chat error:', err)
      const errorMessage = `Sorry, I encountered an error: ${err.message}. Please try again later.`
      setMessages(m => [...m, { from: 'bot', text: errorMessage }])
      setError(err.message)
    }
    
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Finance Assistant</h1>
        <p className="text-gray-600 dark:text-gray-300">Get personalized insights and advice about your spending habits</p>
        
        {/* Status indicator */}
        <div className="mt-2 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isAuthenticated ? 'Connected with your account' : 'Demo mode'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">Connection Error: {error}</p>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                m.from === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
              }`}>
                {m.from === 'bot' && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">🤖</span>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-lg max-w-xs lg:max-w-md">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your spending, budgets, or financial advice..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button 
              onClick={send}
              disabled={loading || !input.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                loading || !input.trim()
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Quick Questions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "How much did I spend this month?",
              "What's my biggest expense category?", 
              "Give me a savings tip",
              "Show my spending trends"
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInput(question)}
                disabled={loading}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}