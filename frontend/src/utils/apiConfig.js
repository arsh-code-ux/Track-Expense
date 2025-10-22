/**
 * API Configuration Utility
 * Handles API URL detection for different environments
 */

export const getApiUrl = () => {
  // For production builds, prioritize production environment variables
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    console.log('🌐 Using production API URL:', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }
  
  // Check if we're on a deployed domain (not localhost)
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    const apiUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3005`
    console.log('🌍 Using deployment API URL:', apiUrl)
    return apiUrl
  }
  
  // Fallback to localhost for development
  const devUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005'
  console.log('🏠 Using development API URL:', devUrl)
  return devUrl
}

export const getApiHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

export const createApiRequest = (endpoint, options = {}) => {
  const apiUrl = getApiUrl()
  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
  
  const defaultOptions = {
    headers: getApiHeaders(),
    ...options
  }
  
  return fetch(url, defaultOptions)
}

export const handleApiError = (error, context = 'API request') => {
  console.error(`Error in ${context}:`, error)
  
  if (error.name === 'AbortError') {
    return import.meta.env.PROD 
      ? 'Request timeout. The server may be starting up after deployment. Please wait a moment and try again.'
      : 'Request timeout. Please check your internet connection.'
  } else if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
    return import.meta.env.PROD
      ? 'Network error. If just deployed, the backend may be starting up. Please wait a moment and try again.'
      : 'Network error. Please check your connection and try again.'
  } else if (error.message.includes('CORS')) {
    return 'Cross-origin request blocked. Please contact support if this persists.'
  } else {
    return `${context} failed. ${import.meta.env.PROD ? 'Please wait and try again.' : 'Please try again.'}`
  }
}

export default {
  getApiUrl,
  getApiHeaders,
  createApiRequest,
  handleApiError
}