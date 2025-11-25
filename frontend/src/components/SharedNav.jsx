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
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b-4 border-primary-300' 
          : 'bg-white/95 backdrop-blur-xl shadow-2xl border-b-4 border-primary-300'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-4 group">
            <div className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 p-4 rounded-2xl shadow-2xl group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all transform group-hover:scale-110 group-hover:rotate-6 animate-pulse-glow">
              <span className="text-5xl">💰</span>
            </div>
            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent drop-shadow-lg animate-gradient-shift mr-8">
              TrackExpense
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {!isAuthenticated ? (
              <>
                <a href="/#features" className="text-neutral-800 dark:text-neutral-200 text-xl lg:text-2xl font-black hover:text-primary-600 dark:hover:text-primary-400 transition-all transform hover:scale-110 hover:drop-shadow-lg">Features</a>
                <a href="/#pricing" className="text-neutral-800 dark:text-neutral-200 text-xl lg:text-2xl font-black hover:text-secondary-600 dark:hover:text-secondary-400 transition-all transform hover:scale-110 hover:drop-shadow-lg">Pricing</a>
                <a href="/#how-it-works" className="text-neutral-800 dark:text-neutral-200 text-xl lg:text-2xl font-black hover:text-accent-600 dark:hover:text-accent-400 transition-all transform hover:scale-110 hover:drop-shadow-lg">How It Works</a>
                <a href="/#faq" className="text-neutral-800 dark:text-neutral-200 text-xl lg:text-2xl font-black hover:text-primary-700 dark:hover:text-primary-300 transition-all transform hover:scale-110 hover:drop-shadow-lg">FAQ</a>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 text-white px-8 py-4 rounded-2xl text-xl font-black shadow-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-1 hover:scale-105"
                >
                  Get Started Free →
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-black text-2xl transition-all transform hover:scale-110 ${
                    isDashboard 
                      ? 'text-primary-600 dark:text-primary-400 drop-shadow-lg' 
                      : 'text-neutral-800 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-5">
                  <div className="text-right">
                    <div className="text-lg font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{user?.name || 'User'}</div>
                    <div className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{user?.email}</div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xl font-black shadow-2xl transform hover:scale-125 transition-transform animate-pulse-glow">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 text-white px-8 py-3.5 rounded-2xl text-lg font-black transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transform hover:-translate-y-1"
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
            className="md:hidden p-2 rounded-lg text-darkblue-700 hover:bg-primary-50 transition-colors"
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
          <div className="md:hidden py-4 border-t border-primary-200 bg-white/95 backdrop-blur-lg animate-slide-down">
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-4">
                <a href="/#features" className="text-darkblue-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">Features</a>
                <a href="/#pricing" className="text-darkblue-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">Pricing</a>
                <a href="/#how-it-works" className="text-darkblue-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">How It Works</a>
                <a href="/#faq" className="text-darkblue-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">FAQ</a>
                <Link 
                  to="/login" 
                  className="btn-darkblue text-center"
                >
                  Get Started Free
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/dashboard" 
                  className="text-darkblue-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="px-4 py-3 bg-primary-50 rounded-lg">
                  <div className="font-bold text-darkblue-900">{user?.name || 'User'}</div>
                  <div className="text-sm text-darkblue-600">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-danger-600 to-danger-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg text-center hover:from-danger-700 hover:to-danger-800 transition-all"
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
