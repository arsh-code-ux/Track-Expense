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
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-2xl shadow-2xl mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-dark-charcoal to-slate-blue bg-clip-text text-transparent mb-2">
            Track Expense
          </h1>
          <p className="text-dark-charcoal/70">Smart financial management made simple</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 border-slate-blue/20 animate-slide-up">
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-silver-gray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark-charcoal/60">OR</span>
            </div>
          </div>

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
