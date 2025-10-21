import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005'

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }
      
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('🔄 Starting login process...')
      console.log('📍 API_BASE:', API_BASE)
      console.log('📧 Email:', email)
      
      const loginUrl = `${API_BASE}/api/auth/login`
      console.log('🌐 Login URL:', loginUrl)
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      console.log('📊 Response status:', response.status)
      console.log('📊 Response ok:', response.ok)
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.log('❌ Error data:', errorData)
        } catch (parseError) {
          console.log('❌ Could not parse error response:', parseError)
          const errorText = await response.text()
          console.log('❌ Error text:', errorText)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('📦 Response data:', data)

      if (!data.token) {
        throw new Error('No token received from server')
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token)
      }
      setUser(data.user)
      setIsAuthenticated(true)
      
      console.log('✅ Login successful')
      console.log('👤 User data:', data.user)
      console.log('🎫 Token stored:', !!data.token)
      console.log('🔓 Authentication state:', true)
      return data
    } catch (error) {
      console.error('❌ Login error:', error)
      console.error('❌ Error name:', error.name)
      console.error('❌ Error message:', error.message)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.')
      }
      throw error
    }
  }

  const register = async (name, email, password) => {
    try {
      console.log('📝 Starting registration process...')
      console.log('📍 API_BASE:', API_BASE)
      console.log('👤 Name:', name)
      console.log('📧 Email:', email)
      
      const registerUrl = `${API_BASE}/api/auth/register`
      console.log('🌐 Register URL:', registerUrl)
      
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      console.log('📊 Response status:', response.status)
      console.log('📊 Response ok:', response.ok)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.log('❌ Error data:', errorData)
        } catch (parseError) {
          console.log('❌ Could not parse error response:', parseError)
          const errorText = await response.text()
          console.log('❌ Error text:', errorText)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('📦 Response data:', data)

      if (!data.token) {
        throw new Error('No token received from server')
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token)
      }
      setUser(data.user)
      setIsAuthenticated(true)
      
      console.log('✅ Registration successful')
      return data
    } catch (error) {
      console.error('❌ Registration error:', error)
      console.error('❌ Error name:', error.name)
      console.error('❌ Error message:', error.message)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.')
      }
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    setUser(null)
    setIsAuthenticated(false)
  }

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus,
    getToken
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}