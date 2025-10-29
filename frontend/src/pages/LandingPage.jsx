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

  const features = [
    {
      icon: "💰",
      title: "Smart Budget Tracking",
      description: "Set budgets for different categories and get alerts when you're approaching limits",
      details: ["Real-time budget monitoring", "Category-wise spending limits", "Overspending alerts", "Weekly/Monthly budget cycles"]
    },
    {
      icon: "📊",
      title: "Visual Analytics",
      description: "Beautiful charts and graphs to understand your spending patterns at a glance",
      details: ["Interactive pie charts", "Bar graphs for trends", "Monthly comparisons", "Category breakdowns"]
    },
    {
      icon: "🏷️",
      title: "Custom Categories",
      description: "Organize expenses with custom categories tailored to your lifestyle",
      details: ["9+ preset categories", "Create custom categories", "Color-coded organization", "Category-wise filtering"]
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Bank-level security with encrypted data storage and secure authentication",
      details: ["256-bit SSL encryption", "JWT authentication", "Secure password storage", "No data sharing"]
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Access your finances from any device - desktop, tablet, or mobile",
      details: ["Mobile-first design", "Touch-optimized interface", "Cross-platform sync", "Works offline"]
    },
    {
      icon: "💾",
      title: "Export Data",
      description: "Export your financial data in multiple formats for tax preparation or analysis",
      details: ["CSV export", "PDF reports", "Date range selection", "Custom filtering"]
    },
    {
      icon: "🔔",
      title: "Smart Alerts",
      description: "Get notified about unusual spending, upcoming bills, and budget limits",
      details: ["Budget limit warnings", "Unusual spending detection", "Bill reminders", "Goal progress updates"]
    },
    {
      icon: "📈",
      title: "Monthly Reports",
      description: "Comprehensive monthly reports with insights and spending trends",
      details: ["Automated reports", "Spending insights", "Savings recommendations", "Year-over-year comparison"]
    },
    {
      icon: "🎯",
      title: "Savings Goals",
      description: "Set and track multiple savings goals with progress monitoring",
      details: ["Multiple goal tracking", "Progress visualization", "Target date reminders", "Milestone celebrations"]
    },
    {
      icon: "💱",
      title: "Multi-Currency",
      description: "Support for multiple currencies with automatic conversion",
      details: ["10+ currencies", "Real-time exchange rates", "Currency conversion", "Default currency setting"]
    },
    {
      icon: "🤖",
      title: "AI Insights",
      description: "Get intelligent spending recommendations and financial advice",
      details: ["Smart spending patterns", "Personalized tips", "Anomaly detection", "Future predictions"]
    },
    {
      icon: "🔄",
      title: "Recurring Transactions",
      description: "Auto-track recurring expenses and income for better planning",
      details: ["Auto-repeat transactions", "Subscription tracking", "Bill reminders", "Frequency customization"]
    }
  ]

  const howItWorks = [
    { step: 1, title: "Sign Up", description: "Create your free account in seconds" },
    { step: 2, title: "Add Expenses", description: "Log your daily expenses easily" },
    { step: 3, title: "Track & Analyze", description: "Monitor spending with visual insights" },
    { step: 4, title: "Save Money", description: "Make informed financial decisions" }
  ]

  const faqs = [
    {
      question: "Is TrackExpense really free?",
      answer: "Yes! Our core features are completely free. We believe everyone should have access to powerful expense tracking tools."
    },
    {
      question: "How secure is my financial data?",
      answer: "We use bank-level encryption (256-bit SSL) to protect your data. Your information is encrypted both in transit and at rest. We never share your data with third parties."
    },
    {
      question: "Can I use TrackExpense on mobile?",
      answer: "Absolutely! TrackExpense is fully responsive and works seamlessly on all devices - smartphones, tablets, and desktop computers."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export your expense data in CSV or PDF format anytime. Your data is always yours to download and use as you wish."
    },
    {
      question: "Do I need to connect my bank account?",
      answer: "No, TrackExpense allows you to manually enter your expenses. We don't require bank account connections, giving you complete control over your data."
    },
    {
      question: "Can I track multiple currencies?",
      answer: "Yes! TrackExpense supports 10+ major currencies with real-time conversion rates. Perfect for travelers and international users."
    },
    {
      question: "Is there a mobile app?",
      answer: "While we don't have a native app yet, our web app is fully responsive and works perfectly on mobile browsers. You can add it to your home screen for app-like experience."
    },
    {
      question: "Can I share access with family members?",
      answer: "Currently, TrackExpense is designed for individual use. However, you can export reports to share with family or financial advisors."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      image: "👩‍💼",
      rating: 5,
      text: "TrackExpense has completely transformed how I manage my business finances. The budget alerts have saved me from overspending multiple times!"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      image: "👨‍💻",
      rating: 5,
      text: "As a tech person, I appreciate the clean interface and powerful features. The analytics dashboard gives me insights I never had before."
    },
    {
      name: "Priya Patel",
      role: "Small Business Owner",
      image: "👩‍💼",
      rating: 5,
      text: "The export feature is a lifesaver during tax season. I can generate reports in seconds and my accountant loves the organized data!"
    },
    {
      name: "David Rodriguez",
      role: "College Student",
      image: "👨‍🎓",
      rating: 5,
      text: "Perfect for students on a budget! The free version has everything I need. I've saved over $500 in the first 3 months by tracking my spending."
    },
    {
      name: "Emma Wilson",
      role: "Marketing Manager",
      image: "👩‍💼",
      rating: 5,
      text: "The savings goals feature keeps me motivated. I'm finally building my emergency fund and the progress tracking makes it fun!"
    },
    {
      name: "James Taylor",
      role: "Entrepreneur",
      image: "👨‍💼",
      rating: 5,
      text: "I've tried many expense trackers, but TrackExpense stands out with its intuitive design and powerful insights. Highly recommended!"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Unlimited transactions",
        "Basic analytics & charts",
        "Up to 3 budgets",
        "Up to 2 savings goals",
        "9 preset categories",
        "CSV export",
        "Email support"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious money managers",
      features: [
        "Everything in Free",
        "Unlimited budgets & goals",
        "Advanced analytics & insights",
        "AI-powered recommendations",
        "Custom categories",
        "PDF & CSV export",
        "Recurring transactions",
        "Priority support",
        "Multi-device sync",
        "Dark mode"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Family",
      price: "$19.99",
      period: "per month",
      description: "For the whole family",
      features: [
        "Everything in Pro",
        "Up to 5 family members",
        "Shared budgets",
        "Family financial reports",
        "Parental controls",
        "Allowance tracking",
        "Bill splitting",
        "Dedicated account manager"
      ],
      popular: false,
      cta: "Start Free Trial"
    }
  ]

  const stats = [
    { number: "25,000+", label: "Active Users", icon: "👥" },
    { number: "$5M+", label: "Money Tracked", icon: "💰" },
    { number: "500K+", label: "Transactions Logged", icon: "📝" },
    { number: "4.9/5", label: "User Rating", icon: "⭐" },
    { number: "50+", label: "Countries", icon: "🌍" },
    { number: "99.9%", label: "Uptime", icon: "🚀" }
  ]

  const [selectedFeature, setSelectedFeature] = useState(null)

  // If user is authenticated, they'll be redirected by useEffect
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
      {/* Shared Navigation */}
      <SharedNav />

      {/* Hero Section - Modern & Professional */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ✨ Track. Analyze. Save.
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy leading-tight">
                Master Your
                <span className="block bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>
              
              <p className="text-xl text-neutral-600 leading-relaxed max-w-xl">
                Take control with intelligent expense tracking, real-time insights, and powerful budgeting tools designed for modern life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/login" 
                  className="btn-primary text-lg group inline-flex items-center justify-center"
                >
                  Start Free Today
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a 
                  href="#features" 
                  className="btn-secondary text-lg"
                >
                  See How It Works
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8 border-t border-neutral-200">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">25K+</div>
                  <div className="text-sm text-neutral-500 font-medium">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-success-600 to-success-800 bg-clip-text text-transparent">$5M+</div>
                  <div className="text-sm text-neutral-500 font-medium">Money Tracked</div>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-3xl font-bold text-accent-500">4.9</span>
                    <span className="text-accent-500 text-2xl">★</span>
                  </div>
                  <div className="text-sm text-neutral-500 font-medium">User Rating</div>
                </div>
              </div>
            </div>
            
            {/* Right - Dashboard Preview */}
            <div className="relative animate-slide-up">
              {/* Floating elements for visual interest */}
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-3xl"></div>
              
              <div className="relative card-gradient p-8 shadow-2xl border-2 border-neutral-100">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 mb-6 text-white shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm opacity-90 font-medium">Total Balance</div>
                      <div className="text-4xl font-bold mt-2">$12,845.00</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="bg-success-500/30 text-success-100 px-3 py-1 rounded-full font-semibold">
                      ↑ 12.5%
                    </span>
                    <span className="opacity-80">vs last month</span>
                  </div>
                </div>
                
                {/* Recent Transactions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Recent Activity</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow border border-neutral-100">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl text-white text-xl">
                        🍕
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Lunch at Pizzeria</div>
                        <div className="text-sm text-neutral-500">Today, 12:30 PM</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-danger-600">-$42.50</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow border border-neutral-100">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-success-500 to-success-600 p-3 rounded-xl text-white text-xl">
                        💼
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Monthly Salary</div>
                        <div className="text-sm text-neutral-500">Jan 1, 2025</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-success-600">+$4,500</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow border border-neutral-100">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-3 rounded-xl text-white text-xl">
                        🎮
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Gaming Subscription</div>
                        <div className="text-sm text-neutral-500">Yesterday</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-danger-600">-$14.99</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">FEATURES</span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mt-4 mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Powerful tools designed to simplify your financial life and help you achieve your money goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                onClick={() => setSelectedFeature(selectedFeature === index ? null : index)}
                className="group relative bg-gradient-to-br from-white to-neutral-50 p-8 rounded-2xl border-2 border-neutral-100 hover:border-primary-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon Container */}
                <div className="mb-6 inline-block">
                  <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-primary-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                {/* Click indicator */}
                <div className="flex items-center text-primary-600 text-sm font-semibold group-hover:text-primary-700">
                  <span>Click for details</span>
                  <svg className={`w-4 h-4 ml-2 transform transition-transform ${selectedFeature === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Expanded Details */}
                {selectedFeature === index && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 animate-slide-down">
                    <h4 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Key Features:</h4>
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <svg className="w-4 h-4 mr-2 text-success-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-neutral-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Decorative gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Modern Timeline */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">SIMPLE PROCESS</span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mt-4 mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-neutral-600">
              Four simple steps to financial clarity
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-neutral-100 hover:border-primary-300 group">
                  {/* Step Number */}
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  
                  <h3 className="text-xl font-bold text-navy mb-3 text-center group-hover:text-primary-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Connector Arrow (hidden on mobile, last item) */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 z-10">
                    <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section - Modern Counter */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Social Proof */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mt-4 mb-6">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-neutral-600">
              See what our community has to say
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-neutral-100 hover:border-primary-300 group"
              >
                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-neutral-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                
                {/* Author */}
                <div className="flex items-center border-t border-neutral-100 pt-6">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-navy">{testimonial.name}</div>
                    <div className="text-sm text-neutral-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Modern Cards */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">PRICING</span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mt-4 mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-neutral-600">
              Start free, upgrade when you need more
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl scale-105 border-4 border-accent-400'
                    : 'bg-gradient-to-br from-white to-neutral-50 border-2 border-neutral-200 hover:border-primary-300 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-navy'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className={`text-5xl font-extrabold ${plan.popular ? 'text-white' : 'text-primary-700'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-2 ${plan.popular ? 'text-white/80' : 'text-neutral-500'}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-neutral-600'}`}>
                    {plan.description}
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-success-400' : 'text-success-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-sm ${plan.popular ? 'text-white' : 'text-neutral-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/login"
                  className={`block w-full py-4 px-6 rounded-xl text-center font-bold transition-all transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-white text-primary-700 hover:bg-accent-500 hover:text-white shadow-xl'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-neutral-600">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern Accordion */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mt-4 mb-6">
              Questions? We've Got Answers
            </h2>
            <p className="text-xl text-neutral-600">
              Everything you need to know about TrackExpense
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-neutral-50 rounded-2xl border-2 border-neutral-100 overflow-hidden transition-all duration-300 hover:border-primary-300 hover:shadow-lg"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-primary-50/50 transition-colors group"
                >
                  <span className="text-lg font-bold text-navy pr-4 group-hover:text-primary-700 transition-colors">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center transform transition-all duration-300 ${expandedFaq === index ? 'rotate-180 bg-primary-600' : 'group-hover:bg-primary-200'}`}>
                    <svg className={`w-5 h-5 ${expandedFaq === index ? 'text-white' : 'text-primary-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-neutral-600 leading-relaxed animate-slide-down border-t border-neutral-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern & Engaging */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 md:p-16 shadow-2xl border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join 25,000+ users who are already saving money and achieving their financial goals with TrackExpense
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/login" 
                className="bg-white text-primary-700 hover:bg-accent-500 hover:text-white px-10 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-2xl inline-flex items-center group"
              >
                Get Started for Free
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a 
                href="#features" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-700 px-10 py-4 rounded-xl text-lg font-bold transition-all"
              >
                Learn More
              </a>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free forever
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <SharedFooter />
    </div>
  )
}