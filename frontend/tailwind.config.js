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
        'dark-bg': '#1a1a1a',
        'dark-surface': '#2a2a2a',
        'dark-border': '#3a3a3a',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      }
    },
  },
  plugins: [],
}