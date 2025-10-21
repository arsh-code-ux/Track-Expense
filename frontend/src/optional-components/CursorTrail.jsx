import React, { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const trailRef = useRef([])
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Initialize trail particles
    const initTrail = () => {
      trailRef.current = []
      for (let i = 0; i < 20; i++) {
        trailRef.current.push({
          x: 0,
          y: 0,
          opacity: 0,
          scale: 0,
          hue: Math.random() * 360
        })
      }
    }

    // Update mouse position
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    // Animation loop
    const animate = () => {
      const trail = trailRef.current
      
      // Update each particle
      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x = trail[i - 1].x
        trail[i].y = trail[i - 1].y
        trail[i].opacity = (i / trail.length) * 0.5
        trail[i].scale = (i / trail.length) * 0.5
      }
      
      // Update first particle to mouse position
      if (trail[0]) {
        trail[0].x = mouseRef.current.x
        trail[0].y = mouseRef.current.y
        trail[0].opacity = 0.8
        trail[0].scale = 1
      }

      // Render particles
      const existingParticles = document.querySelectorAll('.cursor-particle')
      existingParticles.forEach(p => p.remove())

      trail.forEach((particle, index) => {
        if (particle.opacity > 0.01) {
          const element = document.createElement('div')
          element.className = 'cursor-particle'
          element.style.cssText = `
            position: fixed;
            left: ${particle.x - 6}px;
            top: ${particle.y - 6}px;
            width: 12px;
            height: 12px;
            background: radial-gradient(circle, 
              hsl(${particle.hue + index * 10}, 70%, 60%) 0%, 
              hsl(${particle.hue + index * 10}, 70%, 60%) 40%,
              transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${particle.opacity};
            transform: scale(${particle.scale});
            transition: all 0.1s ease-out;
            mix-blend-mode: screen;
          `
          document.body.appendChild(element)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    initTrail()
    document.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Clean up particles
      const particles = document.querySelectorAll('.cursor-particle')
      particles.forEach(p => p.remove())
    }
  }, [])

  return null // This component doesn't render anything directly
}

// Optional: Add cursor glow effect
export function CursorGlow() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const glow = document.querySelector('.cursor-glow')
      if (glow) {
        glow.style.left = e.clientX + 'px'
        glow.style.top = e.clientY + 'px'
      }
    }

    // Create glow element
    const glowElement = document.createElement('div')
    glowElement.className = 'cursor-glow'
    glowElement.style.cssText = `
      position: fixed;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, 
        rgba(99, 102, 241, 0.1) 0%, 
        rgba(99, 102, 241, 0.05) 25%,
        transparent 50%);
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
      transform: translate(-50%, -50%);
      transition: all 0.2s ease-out;
      opacity: 0;
    `
    document.body.appendChild(glowElement)

    const handleMouseEnter = () => {
      glowElement.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      glowElement.style.opacity = '0'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (glowElement && glowElement.parentNode) {
        glowElement.parentNode.removeChild(glowElement)
      }
    }
  }, [])

  return null
}