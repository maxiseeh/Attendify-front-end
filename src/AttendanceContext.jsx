import { createContext, useState, useCallback, useContext } from 'react'
import {
  getSessions,
  getAllSessions,
  createSession as createSessionApi,
  markAttendance,
  getSessionAttendance,
  getStudentAttendance,
} from './services/attendanceService'
import api from './services/api'
import { AuthContext } from './AuthContext'

export const AttendanceContext = createContext()

const LOCAL_SESSIONS_KEY = 'local_sessions'
const LOCAL_ATTENDANCE_KEY = 'local_attendance'

function loadLocalSessions() {
  try { return JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || '[]') } catch { return [] }
}
function saveLocalSessions(s) { localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(s)) }

function loadLocalAttendance() {
  try { return JSON.parse(localStorage.getItem(LOCAL_ATTENDANCE_KEY) || '[]') } catch { return [] }
}
function saveLocalAttendance(a) { localStorage.setItem(LOCAL_ATTENDANCE_KEY, JSON.stringify(a)) }

function normalizeSession(s) {
  return { ...s, status: s.is_active ? 'Active' : 'Closed' }
}

export function AttendanceProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = user?.role === 'teacher' ? await getSessions() : await getAllSessions()
      const normalized = (res.data?.sessions || []).map(normalizeSession)
      saveLocalSessions(normalized)
      setSessions(normalized)
    } catch {
      setSessions(loadLocalSessions())
    } finally {
      setLoading(false)
    }
  }, [user?.role])

  const createSession = async (data) => {
    const res = await createSessionApi({ session_name: data.name })
    const newSession = normalizeSession(res.data.session)
    const updated = [...loadLocalSessions(), newSession]
    saveLocalSessions(updated)
    setSessions(updated)
  }

  const closeSession = async (sessionId) => {
    try {
      await api.delete(`/sessions/${sessionId}`)
    } catch { /* update locally regardless */ }
    const updated = loadLocalSessions().map(s =>
      s.id === sessionId
        ? { ...s, is_active: false, status: 'Closed', end_time: new Date().toISOString() }
        : s
    )
    saveLocalSessions(updated)
    setSessions(updated)
  }

  const markPresent = async ({ sessionId, studentId, studentName, wifiConnected }) => {
    const sid = parseInt(studentId)
    const sessId = parseInt(sessionId)

    try {
      const res = await markAttendance({
        session_id: sessId,
        student_id: sid,
        check_in_method: wifiConnected ? 'device_mac' : 'qr_code',
      })
      const record = {
        id: res.data?.record?.id || Date.now(),
        session_id: sessId,
        student_id: sid,
        student_name: studentName || 'Student',
        check_in_time: res.data?.check_in_time || new Date().toISOString(),
        method: wifiConnected ? 'wifi' : 'qr_code',
        status: 'present',
      }
      const existing = loadLocalAttendance()
      if (!existing.find(a => a.session_id === sessId && a.student_id === sid)) {
        saveLocalAttendance([...existing, record])
      }
      return record
    } catch (err) {
      const msg = err.response?.data?.error || ''
      if (msg.includes('already marked')) return { alreadyMarked: true }
      // fallback: save locally only if backend is unreachable
      const existing = loadLocalAttendance()
      if (existing.find(a => a.session_id === sessId && a.student_id === sid)) {
        return { alreadyMarked: true }
      }
      const record = {
        id: Date.now(),
        session_id: sessId,
        student_id: sid,
        student_name: studentName || 'Student',
        check_in_time: new Date().toISOString(),
        method: wifiConnected ? 'wifi' : 'qr_code',
        status: 'present',
      }
      saveLocalAttendance([...existing, record])
      return record
    }
  }

  const getSessionAttendees = async (sessionId) => {
    try {
      const res = await getSessionAttendance(sessionId)
      return res.data?.records || []
    } catch {
      return loadLocalAttendance().filter(a => String(a.session_id) === String(sessionId))
    }
  }

  const getStudentRecords = async (studentId) => {
    try {
      const res = await getStudentAttendance(studentId)
      const records = res.data?.records || []
      const allSessions = loadLocalSessions()
      return records.map(r => ({
        ...r,
        check_in_time: r.check_in,
        session_name: allSessions.find(s => s.id === r.session_id)?.session_name || 'Session',
        method: r.check_in_method || 'qr_code',
      }))
    } catch {
      const attendance = loadLocalAttendance().filter(a => String(a.student_id) === String(studentId))
      const allSessions = loadLocalSessions()
      return attendance.map(a => ({
        ...a,
        session_name: allSessions.find(s => s.id === a.session_id)?.session_name || 'Session',
      }))
    }
  }

  return (
    <AttendanceContext.Provider value={{
      sessions, loading, error,
      fetchSessions, createSession, closeSession,
      markPresent, getSessionAttendees, getStudentRecords,
    }}>
      {children}
    </AttendanceContext.Provider>
  )
}
