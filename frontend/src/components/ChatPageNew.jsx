import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ChatPage = ({ isDarkMode }) => {
  const { getToken, isAuthenticated, user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI financial assistant. How can I help you manage your expenses today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const messagesEndRef = useRef(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check connection status on component mount
    checkConnectionStatus()
  }, [isAuthenticated])

  const checkConnectionStatus = async () => {
    try {
      setConnectionStatus('checking')
      const token = getToken()
      
      if (!isAuthenticated || !token) {
        setConnectionStatus('unauthenticated')
        return
      }

      // Test connection to chat endpoint
      const response = await fetch(`${API_BASE}/api/chat/test`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      console.error('Connection check failed:', error)
      setConnectionStatus('error')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return
    
    if (!isAuthenticated) {
      setError('Please log in to use the chat feature')
      return
    }

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)
    setError('')

    try {
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('Sending chat message:', userMessage.text)
      console.log('API URL:', `${API_BASE}/api/chat`)
      console.log('Token exists:', !!token)

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.text
        })
      })

      console.log('Chat response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Chat error response:', errorData)
        throw new Error(errorData.message || `HTTP ${response.status}: Chat request failed`)
      }

      const data = await response.json()
      console.log('Chat response received:', data)

      const aiMessage = {
        id: Date.now() + 1,
        text: data.response || 'Sorry, I didn\'t understand that. Could you please rephrase?',
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setConnectionStatus('connected')

    } catch (error) {
      console.error('Chat error:', error)
      setError(error.message || 'Failed to send message. Please try again.')
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I'm having trouble responding right now. Error: ${error.message}`,
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'checking': return 'bg-yellow-500'
      case 'unauthenticated': return 'bg-orange-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected'
      case 'checking': return 'Checking...'
      case 'unauthenticated': return 'Not Authenticated'
      case 'error': return 'Connection Error'
      default: return 'Unknown'
    }
  }

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">AI Financial Assistant</h1>
            <p className="text-sm opacity-75">
              {user ? `Welcome, ${user.name}` : 'Chat about your finances'}
            </p>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm">{getStatusText()}</span>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="mt-2">
          <span className={`text-xs px-2 py-1 rounded ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated ? '✓ Authenticated' : '✗ Not Authenticated'}
          </span>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.isError
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 opacity-75`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              isAuthenticated 
                ? "Ask me about your expenses, budgets, or financial goals..." 
                : "Please log in to chat"
            }
            disabled={!isAuthenticated || loading}
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } ${(!isAuthenticated || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <button
            type="submit"
            disabled={!isAuthenticated || loading || !inputMessage.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              (!isAuthenticated || loading || !inputMessage.trim())
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
        
        {/* Help text */}
        <p className="text-xs mt-2 opacity-75">
          {isAuthenticated 
            ? "Try asking: 'What did I spend on food this month?' or 'Help me create a budget'"
            : "Please log in to start chatting with your AI financial assistant"
          }
        </p>
      </div>
    </div>
  )
}

export default ChatPage