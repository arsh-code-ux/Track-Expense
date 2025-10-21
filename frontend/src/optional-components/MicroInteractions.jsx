import React, { useEffect } from 'react'

// Button ripple effect
export function useRippleEffect() {
  useEffect(() => {
    const createRipple = (event) => {
      const button = event.currentTarget
      const circle = document.createElement('span')
      const diameter = Math.max(button.clientWidth, button.clientHeight)
      const radius = diameter / 2

      const rect = button.getBoundingClientRect()
      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${event.clientX - rect.left - radius}px`
      circle.style.top = `${event.clientY - rect.top - radius}px`
      circle.classList.add('ripple')

      const ripple = button.getElementsByClassName('ripple')[0]
      if (ripple) {
        ripple.remove()
      }

      button.appendChild(circle)

      setTimeout(() => {
        circle.remove()
      }, 600)
    }

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .btn')
    buttons.forEach(button => {
      button.addEventListener('click', createRipple)
      button.style.position = 'relative'
      button.style.overflow = 'hidden'
    })

    // Add CSS for ripple effect
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style')
      style.id = 'ripple-styles'
      style.textContent = `
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background-color: rgba(255, 255, 255, 0.3);
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', createRipple)
      })
    }
  }, [])
}

// Shake animation for form validation errors
export function shakeElement(element) {
  element.style.animation = 'shake 0.5s'
  setTimeout(() => {
    element.style.animation = ''
  }, 500)
}

// Success animation for form submissions
export function successAnimation(element) {
  element.style.animation = 'success-bounce 0.6s ease-out'
  setTimeout(() => {
    element.style.animation = ''
  }, 600)
}

// Floating animation for cards
export function useFloatingCards() {
  useEffect(() => {
    const cards = document.querySelectorAll('.card, .bg-white, .bg-gradient-to-r, .bg-gradient-to-br')
    
    cards.forEach((card, index) => {
      card.style.animation = `float ${3 + (index % 3)}s ease-in-out infinite`
      card.style.animationDelay = `${index * 0.2}s`
    })

    // Add CSS for floating animation
    if (!document.querySelector('#floating-styles')) {
      const style = document.createElement('style')
      style.id = 'floating-styles'
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes success-bounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
        }
      `
      document.head.appendChild(style)
    }

    return () => {
      cards.forEach(card => {
        card.style.animation = ''
      })
    }
  }, [])
}

// Particle explosion effect for celebrations
export function createParticleExplosion(x, y) {
  const colors = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B']
  
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div')
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `
    
    const angle = (Math.PI * 2 * i) / 15
    const velocity = 50 + Math.random() * 50
    const vx = Math.cos(angle) * velocity
    const vy = Math.sin(angle) * velocity
    
    document.body.appendChild(particle)
    
    let posX = x
    let posY = y
    let opacity = 1
    let scale = 1
    
    const animate = () => {
      posX += vx * 0.02
      posY += vy * 0.02 + 0.5 // gravity
      opacity -= 0.02
      scale -= 0.01
      
      particle.style.left = posX + 'px'
      particle.style.top = posY + 'px'
      particle.style.opacity = opacity
      particle.style.transform = `scale(${scale})`
      
      if (opacity > 0 && scale > 0) {
        requestAnimationFrame(animate)
      } else {
        particle.remove()
      }
    }
    
    requestAnimationFrame(animate)
  }
}

// Main MicroInteractions component
export default function MicroInteractions() {
  useRippleEffect()
  useFloatingCards()

  useEffect(() => {
    // Add hover sound effect (optional)
    const playHoverSound = () => {
      // You can add a subtle hover sound here
      // const audio = new Audio('/hover-sound.mp3')
      // audio.volume = 0.1
      // audio.play().catch(() => {}) // Ignore errors
    }

    const interactiveElements = document.querySelectorAll('button, .btn, a, input, select')
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', playHoverSound)
    })

    return () => {
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', playHoverSound)
      })
    }
  }, [])

  return null
}