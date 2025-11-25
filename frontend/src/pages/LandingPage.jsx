import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SharedNav from '../components/SharedNav'
import SharedFooter from '../components/SharedFooter'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SharedNav />
      
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 pt-32 pb-20 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl animate-fade-in">
            Simple way
          </h1>
          <p className="text-2xl sm:text-3xl text-white/90 mb-4 font-bold animate-fade-in delay-100">
            to manage <span className="text-accent-200 font-black">personal finances</span>
          </p>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-3xl mx-auto font-medium animate-fade-in delay-200">
            Take control of your financial future with our intelligent expense tracking,
            budgeting tools, and AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <Link
              to="/login"
              className="bg-white text-primary-700 px-10 py-4 rounded-xl text-xl font-black shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-4 border-white text-white px-10 py-4 rounded-xl text-xl font-black hover:bg-white hover:text-primary-700 transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Features our users love
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Everything you need to manage your finances efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Budget Tracking */}
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-primary-500 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] group">
              <div className="bg-primary-600 w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Smart Budget Tracking</h3>
              <p className="text-slate-400 font-medium">
                Set budgets for different categories and get alerts when you're approaching limits.
              </p>
            </div>

            {/* Visual Analytics */}
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-secondary-500 transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] group">
              <div className="bg-secondary-600 w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Visual Analytics</h3>
              <p className="text-slate-400 font-medium">
                Beautiful charts and graphs to understand your spending patterns at a glance.
              </p>
            </div>

            {/* Savings Goals */}
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-success-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] group">
              <div className="bg-success-600 w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Savings Goals</h3>
              <p className="text-slate-400 font-medium">
                Set and track multiple savings goals with progress visualization and milestones.
              </p>
            </div>

            {/* AI Financial Assistant */}
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-pink-500 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] group">
              <div className="bg-pink-600 w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="text-2xl font-black text-white mb-3">AI Financial Assistant</h3>
              <p className="text-slate-400 font-medium">
                Get personalized insights and advice from our intelligent assistant system.
              </p>
            </div>

            {/* Multi-Currency Support */}
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-cyan-500 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] group">
              <div className="bg-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                💱
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Multi-Currency Support</h3>
              <p className="text-slate-400 font-medium">
                Track expenses in multiple currencies with real-time conversion rates.
              </p>
            </div>

            {/* Smart Alerts */}
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-amber-500 transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] group">
              <div className="bg-amber-600 w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Smart Alerts</h3>
              <p className="text-slate-400 font-medium">
                Receive notifications about budget limits, bill reminders, and spending patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Money Tracker Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Simple money tracker
              </h2>
              <p className="text-xl text-slate-400 mb-8 font-medium">
                It takes seconds to record daily transactions. Put them into clear and visual categories such as Expense: Food, Shopping or Income: Salary, Gift.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center text-slate-300 text-lg font-bold">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  Quick transaction entry
                </li>
                <li className="flex items-center text-slate-300 text-lg font-bold">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  Automated categorization
                </li>
                <li className="flex items-center text-slate-300 text-lg font-bold">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  Visual spending insights
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-3xl shadow-2xl">
              <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-white">Today's Spending</h3>
                  <span className="text-3xl font-black text-pink-300">$45.50</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🍔</span>
                      <span className="text-white font-bold">Food</span>
                    </div>
                    <span className="text-white font-black">$25.00</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🚗</span>
                      <span className="text-white font-bold">Transport</span>
                    </div>
                    <span className="text-white font-black">$12.50</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">☕</span>
                      <span className="text-white font-bold">Other</span>
                    </div>
                    <span className="text-white font-black">$8.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Painless Budgeting Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-8 rounded-3xl shadow-2xl">
                <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl">
                  <h3 className="text-2xl font-black text-white mb-6">Monthly Budget</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-bold">Food & Drink</span>
                        <span className="text-white font-bold">$200 / $300</span>
                      </div>
                      <div className="bg-slate-800 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{width: '67%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-bold">Shopping</span>
                        <span className="text-white font-bold">$150 / $200</span>
                      </div>
                      <div className="bg-slate-800 rounded-full h-3">
                        <div className="bg-amber-500 h-3 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-bold">Transport</span>
                        <span className="text-white font-bold">$80 / $100</span>
                      </div>
                      <div className="bg-slate-800 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{width: '80%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Painless budgeting
              </h2>
              <p className="text-xl text-slate-400 mb-8 font-medium">
                Set up budgets that actually work for you. Track your progress with beautiful visualizations and get smart alerts before you overspend.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center text-slate-300 text-lg font-bold">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  Smart budget recommendations
                </li>
                <li className="flex items-center text-slate-300 text-lg font-bold">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  Overspending alerts
                </li>
                <li className="flex items-center text-slate-300 text-lg font-bold">
                  <span className="text-green-400 mr-3 text-2xl">✓</span>
                  Goal achievement tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Whole Picture Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                The whole picture in one place
              </h2>
              <p className="text-xl text-slate-400 mb-8 font-medium">
                Get a complete overview of your financial health with comprehensive reports, trend analysis, and AI-powered insights that help you make better financial decisions.
              </p>
              
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-black shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-1"
              >
                Start Tracking Today →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-purple-600 p-2 rounded-3xl shadow-2xl">
              <div className="bg-slate-900 p-6 rounded-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-white font-black">Monthly Report</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-white font-black">Savings Goals</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="text-white font-black">Budget Tracking</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-2">🤖</div>
                    <div className="text-white font-black">AI Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              See what others have to say
            </h2>
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-yellow-400 text-3xl">★★★★★</span>
            </div>
            <p className="text-slate-400 text-lg font-medium">
              4.9/5 rating from 10,000+ users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-purple-500 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xl mr-4">
                  S
                </div>
                <div>
                  <h4 className="text-white font-black">Sarah Johnson</h4>
                  <p className="text-slate-400 text-sm">Small Business Owner</p>
                </div>
              </div>
              <p className="text-slate-300 font-medium italic">
                "This app helped me save $2000+ in just 3 months by tracking my daily expenses. Highly recommend!"
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-purple-500 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-black text-xl mr-4">
                  M
                </div>
                <div>
                  <h4 className="text-white font-black">Mike Chen</h4>
                  <p className="text-slate-400 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-slate-300 font-medium italic">
                "The AI assistant gives amazing insights. I never realized how much I was spending on coffee!"
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-purple-500 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-xl mr-4">
                  E
                </div>
                <div>
                  <h4 className="text-white font-black">Emma Wilson</h4>
                  <p className="text-slate-400 text-sm">Marketing Director</p>
                </div>
              </div>
              <p className="text-slate-300 font-medium italic">
                "Perfect for students! The budget tracking feature has helped me manage my limited income effectively."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-300"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-white/90 mb-10 font-bold">
            Join thousands of users who have already transformed their financial lives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-purple-700 px-10 py-4 rounded-xl text-xl font-black shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Start Free Today
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-4 border-white text-white px-10 py-4 rounded-xl text-xl font-black hover:bg-white hover:text-purple-700 transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Already have an account?
            </Link>
          </div>
          
          <p className="text-white/70 mt-6 text-sm font-bold">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">💰</span>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  ExpenseTracker
                </span>
              </div>
              <p className="text-slate-400 font-medium">
                The simple way to manage your personal finances with AI-powered insights and beautiful visualizations.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-black text-lg mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Budget Tracking</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Expense Analytics</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Savings Goals</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">AI Assistant</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-black text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-black text-lg mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-2xl">📘</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-2xl">🐦</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-500 font-medium">
              © 2025 ExpenseTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
