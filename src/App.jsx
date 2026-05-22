import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/student/Login'
import Dashboard from './pages/student/Dashboard'
import Analytics from './pages/admin/Analytics'
import SessionManager from './pages/faculty/SessionManager'
import MyAttendance from './pages/student/MyAttendance'
import Attend from './pages/Attend'
import { AuthProvider } from './AuthContext'
import { AttendanceProvider } from './AttendanceContext'
import { ThemeProvider } from './ThemeContext'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AttendanceProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/faculty/sessions" element={<SessionManager />} />
              <Route path="/student/attendance" element={<MyAttendance />} />
              <Route path="/attend" element={<Attend />} />
            </Routes>
          </AttendanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App