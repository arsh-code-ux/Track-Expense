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
    <div className="min-h-screen bg-gradient-to-br from-light-cream via-silver-gray/20 to-light-cream">
      {/* Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-blue to-dark-charcoal bg-clip-text text-transparent">
                TrackExpense
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-dark-charcoal hover:text-slate-blue transition-colors">Features</a>
              <a href="#how-it-works" className="text-dark-charcoal hover:text-slate-blue transition-colors">How It Works</a>
              <a href="#faq" className="text-dark-charcoal hover:text-slate-blue transition-colors">FAQ</a>
              <Link 
                to="/login" 
                className="btn-primary px-6 py-2 rounded-lg font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-dark-charcoal leading-tight">
                Take Control of Your 
                <span className="block bg-gradient-to-r from-slate-blue to-dark-charcoal bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>
              <p className="text-xl text-dark-charcoal/80 leading-relaxed">
                Track expenses, set budgets, and gain insights into your spending habits with our intuitive expense tracking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/login" 
                  className="btn-primary px-8 py-4 rounded-lg text-lg font-semibold text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                  Start Free Today
                </Link>
                <a 
                  href="#features" 
                  className="bg-white border-2 border-slate-blue text-slate-blue px-8 py-4 rounded-lg text-lg font-semibold text-center hover:bg-slate-blue hover:text-white transition-all"
                >
                  Learn More
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-blue">10K+</div>
                  <div className="text-sm text-dark-charcoal/70">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-blue">$2M+</div>
                  <div className="text-sm text-dark-charcoal/70">Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-blue">4.9/5</div>
                  <div className="text-sm text-dark-charcoal/70">Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="card bg-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-light-cream rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🍔</span>
                      <div>
                        <div className="font-semibold text-dark-charcoal">Food & Dining</div>
                        <div className="text-sm text-dark-charcoal/60">Today, 12:30 PM</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-500">-$45.00</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-light-cream rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💼</span>
                      <div>
                        <div className="font-semibold text-dark-charcoal">Salary</div>
                        <div className="text-sm text-dark-charcoal/60">Jan 1, 2024</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-green-500">+$3,500</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-light-cream rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎮</span>
                      <div>
                        <div className="font-semibold text-dark-charcoal">Entertainment</div>
                        <div className="text-sm text-dark-charcoal/60">Yesterday</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-500">-$29.99</div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-slate-blue to-dark-charcoal rounded-lg text-white">
                  <div className="text-sm opacity-90">Current Balance</div>
                  <div className="text-3xl font-bold">$8,425.01</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-dark-charcoal mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-xl text-dark-charcoal/70 max-w-2xl mx-auto">
              Powerful features designed to make expense tracking simple, intuitive, and insightful
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card bg-white p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-charcoal/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-charcoal mb-4">
              How It Works
            </h2>
            <p className="text-xl text-dark-charcoal/70">
              Get started in just 4 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                    {step.step}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-slate-blue to-dark-charcoal/30"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-dark-charcoal/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-charcoal mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-dark-charcoal/70">
              Everything you need to know about TrackExpense
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="card bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-light-cream/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-dark-charcoal pr-4">
                    {faq.question}
                  </span>
                  <span className={`text-2xl text-slate-blue transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    ⌄
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-dark-charcoal/70 animate-slide-down">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already taking control of their money
            </p>
            <Link 
              to="/login" 
              className="inline-block bg-white text-slate-blue px-10 py-4 rounded-lg text-lg font-bold hover:bg-light-cream transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started for Free
            </Link>
            <p className="mt-4 text-sm opacity-75">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-charcoal text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">💰</span>
                <span className="text-xl font-bold">TrackExpense</span>
              </div>
              <p className="text-silver-gray text-sm">
                Your personal finance companion for smarter money management.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-silver-gray text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-silver-gray text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-silver-gray text-sm">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-silver-gray/30 pt-8 text-center text-silver-gray text-sm">
            <p>&copy; 2024 TrackExpense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}