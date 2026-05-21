import api from './api'

// sessions
export const getSessions = () => api.get('/sessions/')          // teacher: own sessions
export const getAllSessions = () => api.get('/sessions/all')     // students/admins: all sessions

export const createSession = (data) => api.post('/sessions/', data)

// attendance
export const markAttendance = (data) => api.post('/attendance/mark', data)

export const getStudentAttendance = (studentId) => api.get(`/attendance/student/${studentId}`)

export const getSessionAttendance = (sessionId) => api.get(`/attendance/session/${sessionId}`)

// devices
export const registerDevice = (data) => api.post('/devices/register', data)

export const getUserDevices = (userId) => api.get(`/devices/user/${userId}`)

// connection logs
export const logConnection = (data) => api.post('/connections/log', data)
