import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { login, register, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('User authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const testConnection = async () => {
    try {
      console.log('🔍 Testing backend connection...')
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005'}/api/auth/test`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Backend connection successful:', data)
        setError(`✅ Backend connected: ${data.message}`)
      } else {
        console.log('❌ Backend connection failed:', response.status)
        setError(`❌ Backend returned status ${response.status}`)
      }
    } catch (err) {
      console.error('❌ Connection test failed:', err)
      setError(`❌ Cannot connect to backend: ${err.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    console.log('🚀 Login form submitted')
    console.log('🔄 Is login mode:', isLogin)
    console.log('📝 Form data:', { name: formData.name, email: formData.email, passwordLength: formData.password.length })
    
    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password)
        console.log('✅ Login successful, redirecting to dashboard')
      } else {
        const result = await register(formData.name, formData.email, formData.password)
        console.log('✅ Registration successful, redirecting to dashboard')
      }
      
      // Navigation will happen through useEffect when isAuthenticated becomes true
      
    } catch (err) {
      console.error('Authentication failed:', err)
      const errorMessage = err.message || 'Authentication failed'
      setError(errorMessage)
    }
    setLoading(false)
  }

  const handleDemoMode = () => {
    // Navigate to dashboard in demo mode
    navigate('/dashboard')
  }

  // Show loading if auth is being checked or form is being submitted
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-cream via-silver-gray to-slate-blue">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-charcoal font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-cream via-silver-gray to-slate-blue p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-2xl shadow-2xl mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-dark-charcoal to-slate-blue bg-clip-text text-transparent mb-2">
            Track Expense
          </h1>
          <p className="text-dark-charcoal/70">Smart financial management made simple</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 border-slate-blue/20 animate-slide-up">
          {/* Tab Switcher */}
          <div className="flex mb-8 bg-silver-gray/30 rounded-xl p-1">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess('') }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                isLogin 
                  ? 'bg-gradient-to-r from-slate-blue to-dark-charcoal text-white shadow-lg' 
                  : 'text-dark-charcoal hover:bg-white/50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess('') }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                !isLogin 
                  ? 'bg-gradient-to-r from-slate-blue to-dark-charcoal text-white shadow-lg' 
                  : 'text-dark-charcoal hover:bg-white/50'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-down">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-slide-down">
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white border-2 border-silver-gray rounded-xl focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/20 outline-none transition-all text-dark-charcoal"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border-2 border-silver-gray rounded-xl focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/20 outline-none transition-all text-dark-charcoal"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white border-2 border-silver-gray rounded-xl focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/20 outline-none transition-all text-dark-charcoal"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-dark-charcoal cursor-pointer">
                  <input type="checkbox" className="mr-2 w-4 h-4 accent-slate-blue" />
                  Remember me
                </label>
                <a href="#" className="text-slate-blue hover:text-dark-charcoal font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-slate-blue to-dark-charcoal text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {isLogin ? 'Login to Dashboard' : 'Create Account'}
                  <span className="ml-2">→</span>
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-silver-gray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark-charcoal/60">OR</span>
            </div>
          </div>

          {/* Demo Mode */}
          <button
            onClick={handleDemoMode}
            className="w-full py-3 bg-white border-2 border-slate-blue text-slate-blue rounded-xl font-semibold hover:bg-slate-blue hover:text-white transition-all transform hover:scale-105"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">🎯</span>
              Try Demo Mode
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-dark-charcoal/60">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-blue font-semibold hover:text-dark-charcoal transition-colors"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
          <p className="mt-4">
            © 2025 Track Expense. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {authLoading ? 'Checking authentication...' : 'Signing in...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Track your expenses and manage your finances
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleDemoMode}
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                Continue as Demo User
              </button>
            </div>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={testConnection}
              className="w-full flex justify-center py-2 px-4 border border-green-300 dark:border-green-600 text-sm font-medium rounded-lg text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              🔍 Test Backend Connection
            </button>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
