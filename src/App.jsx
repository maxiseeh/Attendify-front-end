import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/admin/Analytics'
import SessionManager from './pages/faculty/SessionManager'
import MyAttendance from './pages/student/MyAttendance'
import { AuthProvider } from './AuthContext'
import { AttendanceProvider } from './AttendanceContext'

// main app with all the routes
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AttendanceProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/faculty/sessions" element={<SessionManager />} />
            <Route path="/student/attendance" element={<MyAttendance />} />
          </Routes>
        </AttendanceProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
