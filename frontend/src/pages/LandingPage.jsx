import React, { useState, useEffect } from 'react'import React, { useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'import { useAuth } from '../context/AuthContext'



export default function LandingPage() {export default function LandingPage() {

  const { isAuthenticated } = useAuth()  const { isAuthenticated } = useAuth()

  const navigate = useNavigate()  const navigate = useNavigate()

  const [activeFeature, setActiveFeature] = useState(0)

  const [scrollY, setScrollY] = useState(0)  useEffect(() => {

    if (isAuthenticated) {

  useEffect(() => {      navigate('/dashboard')

    if (isAuthenticated) {    }

      navigate('/dashboard')  }, [isAuthenticated, navigate])

    }

  }, [isAuthenticated, navigate])  const features = [

    {

  useEffect(() => {      icon: "💰",

    const handleScroll = () => setScrollY(window.scrollY)      title: "Smart Budget Tracking",

    window.addEventListener('scroll', handleScroll)      description: "Set budgets for different categories and get alerts when you're approaching limits"

    return () => window.removeEventListener('scroll', handleScroll)    },

  }, [])    {

      icon: "📊",

  const features = [      title: "Visual Analytics", 

    {      description: "Beautiful charts and graphs to understand your spending patterns at a glance"

      icon: "💰",    },

      title: "Smart Budget Tracking",    {

      description: "Set budgets for different categories and get real-time alerts when approaching limits. Stay in control of your spending with intelligent notifications.",      icon: "🎯",

      highlight: "Real-time alerts",      title: "Savings Goals",

      stats: "99% accuracy"      description: "Set and track your savings goals with progress visualization and milestones"

    },    },

    {    {

      icon: "📊",      icon: "🤖",

      title: "Visual Analytics",       title: "AI Financial Assistant",

      description: "Beautiful, interactive charts and graphs help you understand spending patterns instantly. Make data-driven financial decisions with ease.",      description: "Get personalized insights and advice from our intelligent chatbot"

      highlight: "Interactive charts",    },

      stats: "10+ chart types"    {

    },      icon: "🌍",

    {      title: "Multi-Currency Support",

      icon: "🎯",      description: "Track expenses in multiple currencies with real-time conversion"

      title: "Savings Goals",    },

      description: "Set and track multiple savings goals with progress visualization. Celebrate milestones and stay motivated on your financial journey.",    {

      highlight: "Progress tracking",      icon: "⚡",

      stats: "Unlimited goals"      title: "Smart Alerts",

    },      description: "Receive notifications for budget limits, bill reminders, and spending patterns"

    {    }

      icon: "🤖",  ]

      title: "AI Financial Assistant",

      description: "Get personalized insights and financial advice powered by advanced AI. Your 24/7 financial advisor at your fingertips.",  const testimonials = [

      highlight: "AI-powered insights",    {

      stats: "24/7 available"      name: "Sarah Johnson",

    },      role: "Marketing Manager",

    {      image: "👩‍💼",

      icon: "🌍",      comment: "This app helped me save $2000 in just 6 months by tracking my daily expenses!"

      title: "Multi-Currency Support",    },

      description: "Track expenses in 150+ currencies with real-time conversion rates. Perfect for travelers and international transactions.",    {

      highlight: "150+ currencies",      name: "Mike Chen", 

      stats: "Real-time rates"      role: "Software Developer",

    },      image: "👨‍💻",

    {      comment: "The AI assistant gives amazing insights. I never realized how much I spent on coffee!"

      icon: "🔔",    },

      title: "Smart Alerts",    {

      description: "Receive intelligent notifications for budget limits, recurring bills, unusual spending patterns, and opportunities to save.",      name: "Emma Wilson",

      highlight: "Proactive alerts",      role: "Student",

      stats: "Never miss a bill"      image: "👩‍🎓", 

    },      comment: "Perfect for students! The budget tracking helps me manage my limited income effectively."

    {    }

      icon: "📱",  ]

      title: "Responsive Design",

      description: "Access your financial data anywhere, anytime. Seamlessly works across desktop, tablet, and mobile devices.",  // If user is authenticated, they'll be redirected by useEffect

      highlight: "Mobile-first",  if (isAuthenticated) {

      stats: "All devices"    return null

    },  }

    {

      icon: "🔒",  return (

      title: "Bank-Level Security",    <div className="min-h-screen bg-white dark:bg-gray-900">

      description: "Your data is protected with enterprise-grade encryption and security protocols. Privacy and security are our top priorities.",      {/* Hero Section */}

      highlight: "256-bit encryption",      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">

      stats: "100% secure"        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

    }          <div className="text-center">

  ]            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">

              Simple way

  const benefits = [            </h1>

    { icon: "⚡", text: "Save 5+ hours per month", color: "slate-blue" },            <p className="text-xl md:text-2xl text-blue-100 mb-4">

    { icon: "💡", text: "Increase savings by 30%", color: "dark-charcoal" },              to manage <span className="text-yellow-300 font-semibold">personal finances</span>

    { icon: "🎯", text: "Achieve financial goals faster", color: "slate-blue" },            </p>

    { icon: "📈", text: "Better spending insights", color: "dark-charcoal" }            <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">

  ]              Take control of your financial future with our intelligent expense tracking, 

              budgeting tools, and AI-powered insights.

  const stats = [            </p>

    { number: "10K+", label: "Active Users" },            

    { number: "₹50Cr+", label: "Money Managed" },            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

    { number: "99.9%", label: "Uptime" },              <Link

    { number: "4.9/5", label: "User Rating" }                to="/login"

  ]                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"

              >

  const howItWorks = [                Get Started Free

    {              </Link>

      step: "1",              <Link

      title: "Sign Up Free",                to="/login"

      description: "Create your account in under 30 seconds. No credit card required.",                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"

      icon: "👤"              >

    },                Sign In

    {              </Link>

      step: "2",            </div>

      title: "Add Transactions",          </div>

      description: "Manually enter or import your expenses and income effortlessly.",        </div>

      icon: "💳"      </div>

    },

    {      {/* Features Grid */}

      step: "3",      <div className="py-20 bg-gray-50 dark:bg-gray-800">

      title: "Set Budgets & Goals",        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      description: "Define spending limits and savings targets that matter to you.",          <div className="text-center mb-16">

      icon: "🎯"            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">

    },              Features our users love

    {            </h2>

      step: "4",            <p className="text-xl text-gray-600 dark:text-gray-300">

      title: "Track & Optimize",              Everything you need to manage your finances efficiently

      description: "Monitor progress, get insights, and make smarter financial decisions.",            </p>

      icon: "📊"          </div>

    }          

  ]          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature, index) => (

  const faqs = [              <div 

    {                key={index}

      question: "Is Track Expense really free?",                className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"

      answer: "Yes! Our core features are completely free forever. We offer premium features for advanced users, but you can manage your finances effectively with our free plan."              >

    },                <div className="text-4xl mb-4">{feature.icon}</div>

    {                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">

      question: "How secure is my financial data?",                  {feature.title}

      answer: "We use bank-level 256-bit encryption to protect your data. Your information is encrypted both in transit and at rest. We never share your data with third parties."                </h3>

    },                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">

    {                  {feature.description}

      question: "Can I use it on mobile devices?",                </p>

      answer: "Absolutely! Track Expense is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile phones."              </div>

    },            ))}

    {          </div>

      question: "Do you support multiple currencies?",        </div>

      answer: "Yes! We support 150+ currencies with real-time exchange rates, making it perfect for international transactions and travel."      </div>

    },

    {      {/* Simple Money Tracker Section */}

      question: "Can I export my data?",      <div className="py-20 bg-white dark:bg-gray-900">

      answer: "Yes, you can export your transaction data in CSV and JSON formats anytime. Your data belongs to you."        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    }          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

  ]            <div>

              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">

  const [openFaq, setOpenFaq] = useState(null)                Simple money tracker

              </h2>

  return (              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">

    <div className="min-h-screen bg-gradient-to-br from-light-cream via-silver-gray to-slate-blue">                It takes seconds to record daily transactions. Put them into clear and visualized categories 

      {/* Navigation */}                such as Expense: Food, Shopping or Income: Salary, Gift.

      <nav className={`fixed w-full z-50 transition-all duration-300 ${              </p>

        scrollY > 50 ? 'bg-dark-charcoal/95 backdrop-blur-lg shadow-2xl' : 'bg-transparent'              <div className="space-y-4">

      }`}>                <div className="flex items-center">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>

          <div className="flex justify-between items-center h-20">                  <span className="text-gray-700 dark:text-gray-300">Quick transaction entry</span>

            <div className="flex items-center space-x-3 animate-slide-down">                </div>

              <div className="w-12 h-12 bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-xl flex items-center justify-center shadow-lg">                <div className="flex items-center">

                <span className="text-2xl">💰</span>                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>

              </div>                  <span className="text-gray-700 dark:text-gray-300">Automatic categorization</span>

              <span className="text-2xl font-bold bg-gradient-to-r from-light-cream to-white bg-clip-text text-transparent">                </div>

                Track Expense                <div className="flex items-center">

              </span>                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>

            </div>                  <span className="text-gray-700 dark:text-gray-300">Visual spending insights</span>

                            </div>

            <div className="hidden md:flex items-center space-x-8">              </div>

              <a href="#features" className="text-light-cream hover:text-white transition-colors font-medium">Features</a>            </div>

              <a href="#how-it-works" className="text-light-cream hover:text-white transition-colors font-medium">How It Works</a>            <div className="relative">

              <a href="#faq" className="text-light-cream hover:text-white transition-colors font-medium">FAQ</a>              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-8 rounded-2xl">

              <Link                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-4">

                to="/login"                   <div className="flex justify-between items-center mb-4">

                className="px-6 py-2.5 text-dark-charcoal bg-light-cream hover:bg-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"                    <span className="text-sm text-gray-500">Today's Expenses</span>

              >                    <span className="text-2xl font-bold text-red-500">$45.50</span>

                Login                  </div>

              </Link>                  <div className="space-y-3">

              <Link                     <div className="flex justify-between">

                to="/login"                       <span className="text-gray-600 dark:text-gray-300">🍕 Food</span>

                className="px-6 py-2.5 bg-gradient-to-r from-slate-blue to-dark-charcoal text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl"                      <span className="text-gray-900 dark:text-white">$25.00</span>

              >                    </div>

                Get Started                    <div className="flex justify-between">

              </Link>                      <span className="text-gray-600 dark:text-gray-300">🚗 Transport</span>

            </div>                      <span className="text-gray-900 dark:text-white">$12.50</span>

                    </div>

            {/* Mobile menu button */}                    <div className="flex justify-between">

            <div className="md:hidden">                      <span className="text-gray-600 dark:text-gray-300">☕ Coffee</span>

              <Link                       <span className="text-gray-900 dark:text-white">$8.00</span>

                to="/login"                     </div>

                className="px-4 py-2 bg-gradient-to-r from-slate-blue to-dark-charcoal text-white rounded-lg font-semibold text-sm"                  </div>

              >                </div>

                Login              </div>

              </Link>            </div>

            </div>          </div>

          </div>        </div>

        </div>      </div>

      </nav>

      {/* Painless Budgeting Section */}

      {/* Hero Section */}      <div className="py-20 bg-gray-50 dark:bg-gray-800">

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="grid lg:grid-cols-2 gap-12 items-center">            <div className="lg:order-2">

            <div className="animate-slide-up">              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">

              <div className="inline-block px-4 py-2 bg-slate-blue/20 rounded-full mb-6">                Painless budgeting

                <span className="text-dark-charcoal font-semibold text-sm">🎉 Trusted by 10,000+ users worldwide</span>              </h2>

              </div>              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">

                              Set up budgets that actually work for you. Track your progress with beautiful 

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">                visualizations and get smart alerts before you overspend.

                <span className="bg-gradient-to-r from-dark-charcoal via-slate-blue to-dark-charcoal bg-clip-text text-transparent">              </p>

                  Take Control of Your              <div className="space-y-4">

                </span>                <div className="flex items-center">

                <br />                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>

                <span className="text-dark-charcoal">Financial Future</span>                  <span className="text-gray-700 dark:text-gray-300">Smart budget recommendations</span>

              </h1>                </div>

                              <div className="flex items-center">

              <p className="text-xl text-dark-charcoal/80 mb-8 leading-relaxed">                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>

                Smart budgeting, intelligent insights, and AI-powered financial advice - all in one beautiful platform.                   <span className="text-gray-700 dark:text-gray-300">Overspending alerts</span>

                Start your journey to financial freedom today.                </div>

              </p>                <div className="flex items-center">

                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">                  <span className="text-gray-700 dark:text-gray-300">Goal achievement tracking</span>

                <Link                 </div>

                  to="/login"               </div>

                  className="group px-8 py-4 bg-gradient-to-r from-slate-blue to-dark-charcoal text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-slate-blue/50 flex items-center justify-center"            </div>

                >            <div className="lg:order-1">

                  Start Free Trial              <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 p-8 rounded-2xl">

                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

                </Link>                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Budget</h3>

                <a                   <div className="space-y-4">

                  href="#how-it-works"                     <div>

                  className="px-8 py-4 bg-white/80 backdrop-blur-sm text-dark-charcoal rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg border-2 border-dark-charcoal/10 flex items-center justify-center hover:bg-white"                      <div className="flex justify-between text-sm mb-1">

                >                        <span className="text-gray-600 dark:text-gray-300">Food & Dining</span>

                  <span className="mr-2">▶</span>                        <span className="text-gray-900 dark:text-white">$320 / $400</span>

                  Watch Demo                      </div>

                </a>                      <div className="w-full bg-gray-200 rounded-full h-2">

              </div>                        <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>

                      </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">                    </div>

                {benefits.map((benefit, index) => (                    <div>

                  <div key={index} className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>                      <div className="flex justify-between text-sm mb-1">

                    <span className="text-2xl">{benefit.icon}</span>                        <span className="text-gray-600 dark:text-gray-300">Shopping</span>

                    <span className="text-sm font-medium text-dark-charcoal">{benefit.text.split(' ').slice(0, 2).join(' ')}</span>                        <span className="text-gray-900 dark:text-white">$180 / $200</span>

                  </div>                      </div>

                ))}                      <div className="w-full bg-gray-200 rounded-full h-2">

              </div>                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '90%'}}></div>

            </div>                      </div>

                    </div>

            <div className="relative animate-slide-down">                    <div>

              <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-slate-blue/20">                      <div className="flex justify-between text-sm mb-1">

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">                        <span className="text-gray-600 dark:text-gray-300">Transport</span>

                  <span className="text-4xl">📊</span>                        <span className="text-gray-900 dark:text-white">$85 / $150</span>

                </div>                      </div>

                                      <div className="w-full bg-gray-200 rounded-full h-2">

                <div className="space-y-6">                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '57%'}}></div>

                  <div className="flex items-center justify-between">                      </div>

                    <h3 className="text-2xl font-bold text-dark-charcoal">November Budget</h3>                    </div>

                    <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">On Track</span>                  </div>

                  </div>                </div>

                                </div>

                  <div className="space-y-4">            </div>

                    <div>          </div>

                      <div className="flex justify-between mb-2">        </div>

                        <span className="text-dark-charcoal font-medium">Spent</span>      </div>

                        <span className="text-dark-charcoal font-bold">₹45,000 / ₹60,000</span>

                      </div>      {/* The Whole Picture Section */}

                      <div className="h-3 bg-silver-gray rounded-full overflow-hidden">      <div className="py-20 bg-white dark:bg-gray-900">

                        <div className="h-full bg-gradient-to-r from-slate-blue to-dark-charcoal rounded-full" style={{ width: '75%' }}></div>        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                      </div>          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    </div>            <div>

              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">

                    <div className="grid grid-cols-3 gap-4 pt-4">                The whole picture in one place

                      <div className="text-center p-4 bg-slate-blue/10 rounded-xl">              </h2>

                        <div className="text-3xl mb-2">🍔</div>              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">

                        <div className="text-sm text-dark-charcoal/60">Food</div>                Get a complete overview of your financial health with comprehensive reports, 

                        <div className="text-lg font-bold text-dark-charcoal">₹12K</div>                trend analysis, and AI-powered insights that help you make better financial decisions.

                      </div>              </p>

                      <div className="text-center p-4 bg-slate-blue/10 rounded-xl">              <Link

                        <div className="text-3xl mb-2">🏠</div>                to="/login"

                        <div className="text-sm text-dark-charcoal/60">Rent</div>                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"

                        <div className="text-lg font-bold text-dark-charcoal">₹20K</div>              >

                      </div>                Start Tracking Today

                      <div className="text-center p-4 bg-slate-blue/10 rounded-xl">                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                        <div className="text-3xl mb-2">🎮</div>                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />

                        <div className="text-sm text-dark-charcoal/60">Fun</div>                </svg>

                        <div className="text-lg font-bold text-dark-charcoal">₹8K</div>              </Link>

                      </div>            </div>

                    </div>            <div className="relative">

                  </div>              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-8 rounded-2xl">

                </div>                <div className="grid grid-cols-2 gap-4">

              </div>                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">

                    <div className="text-center">

              {/* Floating cards */}                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">

              <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 animate-bounce-slow hidden lg:block">                        <span className="text-2xl">📊</span>

                <div className="flex items-center space-x-3">                      </div>

                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">                      <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Report</p>

                    <span className="text-xl">✓</span>                    </div>

                  </div>                  </div>

                  <div>                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">

                    <p className="text-xs text-gray-500">Goal Achieved</p>                    <div className="text-center">

                    <p className="font-bold text-dark-charcoal">Vacation Fund</p>                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">

                  </div>                        <span className="text-2xl">💰</span>

                </div>                      </div>

              </div>                      <p className="text-sm text-gray-600 dark:text-gray-300">Savings Goals</p>

                    </div>

              <div className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 animate-bounce-slow hidden lg:block" style={{ animationDelay: '1s' }}>                  </div>

                <div className="flex items-center space-x-3">                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">

                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">                    <div className="text-center">

                    <span className="text-xl">💡</span>                      <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2">

                  </div>                        <span className="text-2xl">🎯</span>

                  <div>                      </div>

                    <p className="text-xs text-gray-500">AI Insight</p>                      <p className="text-sm text-gray-600 dark:text-gray-300">Budget Tracking</p>

                    <p className="font-bold text-dark-charcoal">Save ₹2K/month</p>                    </div>

                  </div>                  </div>

                </div>                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">

              </div>                    <div className="text-center">

            </div>                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">

          </div>                        <span className="text-2xl">🤖</span>

        </div>                      </div>

      </section>                      <p className="text-sm text-gray-600 dark:text-gray-300">AI Insights</p>

                    </div>

      {/* Stats Section */}                  </div>

      <section className="py-16 bg-gradient-to-r from-dark-charcoal to-slate-blue">                </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">              </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">            </div>

            {stats.map((stat, index) => (          </div>

              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>        </div>

                <div className="text-4xl md:text-5xl font-bold text-light-cream mb-2">{stat.number}</div>      </div>

                <div className="text-light-cream/80 font-medium">{stat.label}</div>

              </div>      {/* Testimonials */}

            ))}      <div className="py-20 bg-gray-50 dark:bg-gray-800">

          </div>        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        </div>          <div className="text-center mb-16">

      </section>            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">

              See what others have to say

      {/* Features Section */}            </h2>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">            <div className="flex justify-center mb-4">

        <div className="max-w-7xl mx-auto">              <div className="flex text-yellow-400">

          <div className="text-center mb-16 animate-slide-up">                {[...Array(5)].map((_, i) => (

            <h2 className="text-4xl md:text-5xl font-bold text-dark-charcoal mb-4">                  <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">

              Powerful Features for                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />

              <span className="bg-gradient-to-r from-slate-blue to-dark-charcoal bg-clip-text text-transparent"> Smart Money Management</span>                  </svg>

            </h2>                ))}

            <p className="text-xl text-dark-charcoal/70 max-w-3xl mx-auto">              </div>

              Everything you need to track, manage, and optimize your finances in one intuitive platform            </div>

            </p>            <p className="text-lg text-gray-600 dark:text-gray-300">4.8/5 rating from 10,000+ users</p>

          </div>          </div>

          

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {features.map((feature, index) => (            {testimonials.map((testimonial, index) => (

              <div               <div 

                key={index}                key={index}

                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-slate-blue cursor-pointer animate-slide-up"                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"

                style={{ animationDelay: `${index * 0.1}s` }}              >

                onMouseEnter={() => setActiveFeature(index)}                <div className="flex items-center mb-4">

              >                  <div className="text-3xl mr-3">{testimonial.image}</div>

                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>                  <div>

                <h3 className="text-xl font-bold text-dark-charcoal mb-3">{feature.title}</h3>                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>

                <p className="text-dark-charcoal/70 mb-4 text-sm leading-relaxed">{feature.description}</p>                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>

                <div className="flex items-center justify-between pt-4 border-t border-silver-gray">                  </div>

                  <span className="text-xs font-semibold text-slate-blue">{feature.highlight}</span>                </div>

                  <span className="text-xs font-bold text-dark-charcoal bg-light-cream px-3 py-1 rounded-full">{feature.stats}</span>                <p className="text-gray-600 dark:text-gray-300 italic">

                </div>                  "{testimonial.comment}"

              </div>                </p>

            ))}              </div>

          </div>            ))}

        </div>          </div>

      </section>        </div>

      </div>

      {/* How It Works Section */}

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">      {/* CTA Section */}

        <div className="max-w-7xl mx-auto">      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">

          <div className="text-center mb-16 animate-slide-up">        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">

            <h2 className="text-4xl md:text-5xl font-bold text-dark-charcoal mb-4">          <h2 className="text-4xl font-bold text-white mb-6">

              Get Started in            Ready to take control of your finances?

              <span className="bg-gradient-to-r from-slate-blue to-dark-charcoal bg-clip-text text-transparent"> 4 Simple Steps</span>          </h2>

            </h2>          <p className="text-xl text-blue-100 mb-8">

            <p className="text-xl text-dark-charcoal/70 max-w-3xl mx-auto">            Join thousands of users who have already transformed their financial lives

              From signup to smart financial management in minutes          </p>

            </p>          <div className="flex flex-col sm:flex-row gap-4 justify-center">

          </div>            <Link

              to="/login"

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"

            {howItWorks.map((step, index) => (            >

              <div key={index} className="relative animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>              Start Free Today

                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-slate-blue/20">            </Link>

                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-xl flex items-center justify-center shadow-lg">            <Link

                    <span className="text-2xl font-bold text-white">{step.step}</span>              to="/login"

                  </div>              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"

                              >

                  <div className="text-6xl mb-6 text-center mt-4">{step.icon}</div>              Already have an account?

                  <h3 className="text-xl font-bold text-dark-charcoal mb-3 text-center">{step.title}</h3>            </Link>

                  <p className="text-dark-charcoal/70 text-center text-sm leading-relaxed">{step.description}</p>          </div>

                </div>          <p className="text-blue-200 text-sm mt-4">No credit card required • Free forever</p>

        </div>

                {index < howItWorks.length - 1 && (      </div>

                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-blue to-dark-charcoal"></div>

                )}      {/* Footer */}

              </div>      <footer className="bg-gray-900 dark:bg-black text-white py-12">

            ))}        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          </div>          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div className="col-span-1 md:col-span-2">

          <div className="text-center mt-12">              <h3 className="text-2xl font-bold mb-4">💰 ExpenseTracker</h3>

            <Link               <p className="text-gray-300 mb-4">

              to="/login"                 The simple way to manage your personal finances with AI-powered insights 

              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-blue to-dark-charcoal text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-slate-blue/50"                and beautiful visualizations.

            >              </p>

              Start Your Free Journey              <div className="flex space-x-4">

              <span className="ml-2">🚀</span>                <span className="text-2xl cursor-pointer hover:text-blue-400">📱</span>

            </Link>                <span className="text-2xl cursor-pointer hover:text-blue-400">💻</span>

          </div>                <span className="text-2xl cursor-pointer hover:text-blue-400">🌐</span>

        </div>              </div>

      </section>            </div>

            <div>

      {/* FAQ Section */}              <h4 className="font-semibold mb-4">Features</h4>

      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">              <ul className="space-y-2 text-gray-300">

        <div className="max-w-4xl mx-auto">                <li>Budget Tracking</li>

          <div className="text-center mb-16 animate-slide-up">                <li>Expense Analytics</li>

            <h2 className="text-4xl md:text-5xl font-bold text-dark-charcoal mb-4">                <li>Savings Goals</li>

              Frequently Asked                <li>AI Assistant</li>

              <span className="bg-gradient-to-r from-slate-blue to-dark-charcoal bg-clip-text text-transparent"> Questions</span>              </ul>

            </h2>            </div>

            <p className="text-xl text-dark-charcoal/70">            <div>

              Everything you need to know about Track Expense              <h4 className="font-semibold mb-4">Support</h4>

            </p>              <ul className="space-y-2 text-gray-300">

          </div>                <li>Help Center</li>

                <li>Privacy Policy</li>

          <div className="space-y-4">                <li>Terms of Service</li>

            {faqs.map((faq, index) => (                <li>Contact Us</li>

              <div               </ul>

                key={index}            </div>

                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slide-up"          </div>

                style={{ animationDelay: `${index * 0.1}s` }}          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">

              >            <p>&copy; 2025 ExpenseTracker. All rights reserved.</p>

                <button          </div>

                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-slate-blue/5 transition-colors"        </div>

                  onClick={() => setOpenFaq(openFaq === index ? null : index)}      </footer>

                >    </div>

                  <span className="font-bold text-lg text-dark-charcoal pr-8">{faq.question}</span>  )

                  <span className={`text-2xl text-slate-blue transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>}
                    ↓
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6 text-dark-charcoal/70 leading-relaxed animate-slide-down">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-charcoal via-slate-blue to-dark-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Financial Life?
            </h2>
            <p className="text-xl text-light-cream/90 mb-8">
              Join thousands of users who have already taken control of their finances
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                to="/login" 
                className="group px-10 py-5 bg-light-cream text-dark-charcoal rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-light-cream/50 flex items-center"
              >
                Get Started Free
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <p className="text-light-cream/70 text-sm">
              ✓ No credit card required  ✓ 100% free to start  ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-charcoal text-light-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-blue to-light-cream rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-xl font-bold">Track Expense</span>
              </div>
              <p className="text-light-cream/70 text-sm">
                Smart financial management made simple and intuitive.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-light-cream/70">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-light-cream/70">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-light-cream/70">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-light-cream/20 pt-8 text-center text-sm text-light-cream/60">
            <p>© 2025 Track Expense. All rights reserved. Made with ❤️ for better financial management.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
