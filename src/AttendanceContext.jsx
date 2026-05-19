import { createContext, useState } from 'react'
import { getSessions, markAttendance } from './services/attendanceService'

export const AttendanceContext = createContext()

export function AttendanceProvider({ children }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) 


  const fetchSessions = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getSessions()
      setSessions(res.data)
    } catch (err) {
      console.log('error fetching sessions:', err)
      setError('Could not load sessions. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const submitAttendance = async (data) => {
    try {
      await markAttendance(data)
      await fetchSessions()
    } catch (err) {
      console.error('Failed to mark attendance:', err)
      throw err
    }
  }

  return (

    <AttendanceContext.Provider value={{ sessions, loading, error, fetchSessions, submitAttendance }}>
      {children}
    </AttendanceContext.Provider>
  )
}