/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      screens: {
        'xs': '475px',      // Extra small devices
        'sm': '640px',      // Small devices (default)
        'md': '768px',      // Medium devices (tablets)
        'lg': '1024px',     // Large devices (laptops)
        'xl': '1280px',     // Extra large devices (desktops)
        '2xl': '1536px',    // 2X large devices (large desktops)
        '3xl': '1920px',    // Ultra-wide screens
      },
      colors: {
        // Fresh Modern Color Palette - Indigo, Teal, Coral
        'primary': {
          50: '#eef2ff',   // Very light indigo
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',  // Main indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',  // Deep indigo
        },
        'secondary': {
          50: '#f0fdfa',   // Very light teal
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // Main teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',  // Deep teal
        },
        'accent': {
          50: '#fff7ed',   // Very light coral
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',  // Main coral/orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',  // Deep orange
        },
        // Success and Danger colors (Emerald and Rose)
        'success': {
          50: '#ecfdf5',   // Very light emerald
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Main emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',  // Deep emerald
        },
        'danger': {
          50: '#fff1f2',   // Very light rose
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',  // Main rose
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',  // Deep rose
        },
        'neutral': {
          50: '#fafafa',    // Very light gray
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',  // Main neutral
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',  // Almost black
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}