import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('miras_admin')
    const token = localStorage.getItem('miras_token')
    if (stored && token) {
      try { setAdmin(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token, admin: adminData } = res.data
    localStorage.setItem('miras_token', token)
    localStorage.setItem('miras_admin', JSON.stringify(adminData))
    setAdmin(adminData)
    return adminData
  }

  const logout = () => {
    localStorage.removeItem('miras_token')
    localStorage.removeItem('miras_admin')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
