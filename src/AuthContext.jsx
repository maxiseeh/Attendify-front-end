import { createContext, useState, useEffect } from 'react'
import { loginUser, getCurrentUser } from './services/authService'

export const AuthContext = createContext()

// wraps the whole app so any component can access user info
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) //stores login error messages

  useEffect(() => {
    // check if user was already logged in
    const token = localStorage.getItem('token')
    if (token) {
      getCurrentUser()
        .then(res => {
          setUser(res.data)
        })
        .catch(err => {
          console.log('token expired or invalid', err)
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

 
  const login = async (email, password) => {
    try {
      setError(null)
      const res = await loginUser(email, password)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}