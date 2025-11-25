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
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, register, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('User authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const testConnection = async () => {
    try {
      console.log('Testing backend connection...')
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005'}/api/auth/test`)
      if (response.ok) {
        const data = await response.json()
        console.log('Backend connection successful:', data)
        setError(`Backend connected: ${data.message}`)
      } else {
        console.log('Backend connection failed:', response.status)
        setError(`Backend returned status ${response.status}`)
      }
    } catch (err) {
      console.error('Connection test failed:', err)
      setError(`Cannot connect to backend: ${err.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await register(formData.name, formData.email, formData.password)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    }
    setLoading(false)
  }

  const handleDemoMode = () => {
    navigate('/dashboard')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-200"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-400"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-8 border-primary-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
            Loading Your Dashboard...
          </p>
          <p className="text-neutral-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 p-4">
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary-500 rounded-full animate-bounce-subtle"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500 rounded-full animate-bounce-subtle delay-200"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-cyan-500 rounded-full animate-bounce-subtle delay-400"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-primary-500 rounded-full animate-bounce-subtle delay-100"></div>
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-start space-y-8 p-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 via-purple-600 to-cyan-600 rounded-3xl shadow-2xl mb-4 animate-scale-in transform hover:scale-110 transition-transform duration-300">
            <span className="text-5xl animate-bounce-subtle">💰</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight animate-slide-in-left">
              Track Expense
            </h1>
            <p className="text-2xl text-neutral-700 font-medium animate-slide-in-left delay-100">
              Smart financial management made simple
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="space-y-4 animate-slide-in-left delay-200">
            {[
              { icon: '📊', text: 'Visual Analytics & Reports', color: 'from-blue-500 to-blue-600' },
              { icon: '🎯', text: 'Budget & Goals Tracking', color: 'from-purple-500 to-purple-600' },
              { icon: '🔒', text: 'Secure & Private', color: 'from-cyan-500 to-cyan-600' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-4 group">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <span className="text-lg text-neutral-700 font-medium group-hover:text-primary-600 transition-colors">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center animate-slide-in-right">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 via-purple-600 to-cyan-600 rounded-2xl shadow-2xl mb-4 animate-scale-in">
                <span className="text-4xl">💰</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Track Expense
              </h1>
              <p className="text-neutral-600 text-lg">Smart financial management</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-white/50 animate-scale-in">
              {/* Tab Switcher */}
              <div className="flex mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 rounded-2xl p-2">
                <button
                  onClick={() => { setIsLogin(true); setError(''); setSuccess('') }}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 text-white shadow-lg transform scale-105' 
                      : 'text-neutral-600 hover:bg-white/50'
                  }`}
                >
                  Login
                </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess('') }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                  : 'text-darkblue-900 hover:bg-blue-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-50 border-l-4 border-danger-500 rounded-lg animate-slide-down">
              <p className="text-danger-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-success-50 border-l-4 border-success-500 rounded-lg animate-slide-down">
              <p className="text-success-800 text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-sm font-semibold text-darkblue-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-blue-50 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all text-darkblue-900 placeholder-primary-400 font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-darkblue-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-blue-50 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all text-darkblue-900 placeholder-primary-400 font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-darkblue-900 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-blue-50 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all text-darkblue-900 placeholder-primary-400 font-medium"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-darkblue-900 cursor-pointer hover:text-primary-600 transition-colors font-medium">
                  <input type="checkbox" className="mr-2 w-4 h-4 accent-primary-600 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg active:translate-y-0"
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
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-darkblue-900 font-semibold">OR</span>
            </div>
          </div>

          <button
            onClick={handleDemoMode}
            className="w-full py-3 bg-blue-50 border-2 border-primary-600 text-primary-700 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2 text-xl">🎯</span>
              Try Demo Mode
            </span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-600">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
          <p className="mt-4 text-white/90 font-medium">
            © 2025 Track Expense. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
