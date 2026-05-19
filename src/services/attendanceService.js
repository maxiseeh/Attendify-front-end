import api from './api'
 
// get all attendance records
export const getAllAttendance = () => api.get('/attendance')
 
// get records for one student
export const getStudentAttendance = (studentId) => api.get(`/attendance/student/${studentId}`)
 
// mark attendance (student submits)
export const markAttendance = (data) => api.post('/attendance/mark', data)
 
// create a new session (faculty)
export const createSession = (data) => api.post('/attendance/session', data)
 
// get all sessions
export const getSessions = () => api.get('/attendance/sessions')
 