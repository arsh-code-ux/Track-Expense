import React, { useState, useEffect, useRef } from 'react'

export default function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  className = '',
  startAnimation = true,
  formatter = null // Custom formatter function
}) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const countRef = useRef(null)

  useEffect(() => {
    if (!startAnimation || hasAnimated) return

    const startValue = 0
    const endValue = parseFloat(end.toString().replace(/[^0-9.-]/g, '')) || 0
    
    if (endValue === 0) {
      setCount(0)
      return
    }

    const startTime = Date.now()
    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOutCubic
      
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
        setHasAnimated(true)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, startAnimation, hasAnimated])

  // Format the number
  const formatNumber = (num) => {
    // If custom formatter provided, use it
    if (formatter && typeof formatter === 'function') {
      return formatter(num)
    }
    
    // Default formatting with K/M suffixes
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toFixed(0)
  }

  return (
    <span 
      ref={countRef}
      className={`inline-block ${className}`}
    >
      {prefix}{formatNumber(count)}{suffix}
    </span>
  )
}

// Hook for intersection observer to trigger animation when component is visible
export function useIntersectionObserver(ref, threshold = 0.1) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.unobserve(entry.target) // Only trigger once
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref, threshold])

  return isIntersecting
}