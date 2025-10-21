import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { CurrencyProvider, useCurrency } from './context/CurrencyContext'
import { DataSyncProvider } from './contexts/DataSyncContext'
import LandingPage from './pages/LandingPage'
import DashboardClean from './pages/DashboardClean'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import FloatingActionButtons from './components/FloatingActionButtons'
import './styles.css'
import ErrorBoundary from './components/ErrorBoundary'

function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { currency, setCurrency, currencies } = useCurrency()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Don't show navigation on landing page for non-authenticated users
  if (!isAuthenticated && location.pathname === '/') {
    return null
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-b border-white/20 dark:border-gray-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              💰 ExpenseTracker
            </h1>
          </div>
          
          {/* Center Navigation Links - Hidden on small screens */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/chat" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              🤖 AI Assistant
            </Link>
            <Link 
              to="/settings" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              ⚙️ Settings
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Right Side - Controls and Auth (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            >
              {Object.entries(currencies).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.symbol} {code}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="hidden xl:block text-sm text-gray-600 dark:text-gray-400">
                  👋 {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/chat"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                🤖 AI Assistant
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚙️ Settings
              </Link>
              
              {/* Mobile Controls */}
              <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(currencies).map(([code, info]) => (
                      <option key={code} value={code}>
                        {info.symbol} {code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded"
                  >
                    {isDark ? '☀️ Light' : '🌙 Dark'}
                  </button>
                </div>
                
                {isAuthenticated && (
                  <div className="px-3 py-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Welcome, {user?.name || 'User'}! 👋
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function AppContent() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/' 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors relative overflow-hidden">
      <div className="relative z-10">
        <Navigation />
        
        <main className={isLandingPage ? "" : "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardClean/>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage/>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={<Settings/>} />
          </Routes>
        </main>
        
        {/* Floating Action Buttons - Only on dashboard */}
        {!isLandingPage && <FloatingActionButtons />}
      </div>
    </div>
  )
}

function App(){
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <DataSyncProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </DataSyncProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  )
}

// Global error handlers (catch unhandled errors and promise rejections)
window.addEventListener('error', (event) => {
  console.error('Global error captured:', event.error || event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
