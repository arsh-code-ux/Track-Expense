import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SharedNav() {
  const { isAuthenticated, user, logout } = useAuth()
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isLandingPage = location.pathname === '/'
  const isDashboard = location.pathname === '/dashboard'

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 50 || !isLandingPage
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-neutral-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
              TrackExpense
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <a href="/#features" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">Features</a>
                <a href="/#pricing" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">Pricing</a>
                <a href="/#how-it-works" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">How It Works</a>
                <a href="/#faq" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">FAQ</a>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started Free →
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition-colors ${
                    isDashboard ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-600'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-navy">{user?.name || 'User'}</div>
                    <div className="text-xs text-neutral-500">{user?.email}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-primary-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 bg-white/95 backdrop-blur-lg animate-slide-down">
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-4">
                <a href="/#features" className="text-neutral-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">Features</a>
                <a href="/#pricing" className="text-neutral-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">Pricing</a>
                <a href="/#how-it-works" className="text-neutral-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">How It Works</a>
                <a href="/#faq" className="text-neutral-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">FAQ</a>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold text-center shadow-lg"
                >
                  Get Started Free
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/dashboard" 
                  className="text-neutral-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="px-4 py-3 bg-primary-50 rounded-lg">
                  <div className="font-bold text-navy">{user?.name || 'User'}</div>
                  <div className="text-sm text-neutral-600">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-danger-600 to-danger-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg text-center"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
