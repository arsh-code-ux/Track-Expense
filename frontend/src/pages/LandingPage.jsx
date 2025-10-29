import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: "💰",
      title: "Smart Budget Tracking",
      description: "Set budgets for different categories and get alerts when you're approaching limits"
    },
    {
      icon: "📊",
      title: "Visual Analytics",
      description: "Beautiful charts and graphs to understand your spending patterns at a glance"
    },
    {
      icon: "🏷️",
      title: "Custom Categories",
      description: "Organize expenses with custom categories tailored to your lifestyle"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Bank-level security with encrypted data storage and secure authentication"
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Access your finances from any device - desktop, tablet, or mobile"
    },
    {
      icon: "💾",
      title: "Export Data",
      description: "Export your financial data in multiple formats for tax preparation or analysis"
    },
    {
      icon: "🔔",
      title: "Smart Alerts",
      description: "Get notified about unusual spending, upcoming bills, and budget limits"
    },
    {
      icon: "📈",
      title: "Monthly Reports",
      description: "Comprehensive monthly reports with insights and spending trends"
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
    }
  ]

  // If user is authenticated, they'll be redirected by useEffect
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
      {/* Modern Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-neutral-200' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl shadow-lg">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                TrackExpense
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">How It Works</a>
              <a href="#faq" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">FAQ</a>
              <Link 
                to="/login" 
                className="btn-primary text-sm"
              >
                Get Started Free →
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
                className="group relative bg-gradient-to-br from-white to-neutral-50 p-8 rounded-2xl border-2 border-neutral-100 hover:border-primary-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
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
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
                
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

      {/* Footer - Modern & Clean */}
      <footer className="bg-navy text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-primary-400 to-primary-600 p-2 rounded-xl">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-xl font-bold">TrackExpense</span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Your intelligent financial companion for smarter money management and better financial decisions.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-neutral-300 text-sm">
                <li><a href="#features" className="hover:text-accent-400 transition-colors inline-flex items-center group">
                  Features
                  <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a></li>
                <li><a href="#how-it-works" className="hover:text-accent-400 transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-accent-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Updates</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-neutral-300 text-sm">
                <li><a href="#" className="hover:text-accent-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Press Kit</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-neutral-300 text-sm">
                <li><a href="#faq" className="hover:text-accent-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              &copy; 2025 TrackExpense. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-neutral-400 hover:text-accent-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}