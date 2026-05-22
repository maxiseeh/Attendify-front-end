import { createContext, useState, useEffect } from 'react'
import { loginUser, registerUser, saveMac } from './services/authService'

export const AuthContext = createContext()

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch {
    return null
  }
}

function getUserFromToken(token) {
  const decoded = decodeToken(token)
  if (!decoded) return null
  const stored = JSON.parse(localStorage.getItem('user_profile') || '{}')
  return {
    email: stored.email || decoded.email || decoded.sub,
    name: stored.name || decoded.name || decoded.sub || 'User',
    role: stored.role || decoded.role || 'student',
    id: stored.id || parseInt(decoded.sub) || decoded.sub,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      const u = getUserFromToken(token)
      if (u) {
        // force re-login if role is stale (old lecturer value)
        if (u.role === 'lecturer') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_profile')
          setLoading(false)
          return
        }
        setUser(u)
      } else {
        localStorage.removeItem('access_token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, passphrase) => {
    setError(null)
    try {
      const res = await loginUser(email, password, passphrase)
      const token = res.data.access_token
      const userData = res.data.user
      localStorage.setItem('access_token', token)
      localStorage.setItem('user_profile', JSON.stringify(userData))
      setUser(userData)
      // save MAC if user has one stored locally but not on server
      const storedMac = localStorage.getItem('device_mac')
      if (storedMac && !userData.mac_address) {
        saveMac(storedMac).catch(() => {})
      }
      return userData
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
      throw err
    }
  }

  const register = async ({ name, email, password, role, batch_code }) => {
    setError(null)
    try {
      await registerUser({ name, email, password, role, batch_code })
      const res = await loginUser(email, password)
      const token = res.data.access_token
      const userData = res.data.user
      localStorage.setItem('access_token', token)
      localStorage.setItem('user_profile', JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch (err) {
      const msg = err.response?.data?.error ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        'Registration failed. Please try again.'
      setError(msg)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_profile')
    localStorage.removeItem('local_attendance')
    localStorage.removeItem('local_sessions')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}