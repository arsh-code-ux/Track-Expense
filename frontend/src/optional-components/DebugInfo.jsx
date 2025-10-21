import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function DebugInfo() {
  const { user, isAuthenticated, loading } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-sm z-50">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>User: {user ? user.name : 'None'}</p>
      <p>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
    </div>
  )
}