import { useEffect, useState, useContext } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import api from '../services/api'
import { CheckCircle2, XCircle, Loader2, Rocket } from 'lucide-react'

function Attend() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useContext(AuthContext)

  const [status, setStatus] = useState('loading') // loading | success | error | redirect
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (authLoading) return

    const sessionParam = searchParams.get('session')

    // extract session_id — supports both formats:
    // ?session=123  or the old QR value  session_123_SessionName
    let sessionId = null
    if (sessionParam) {
      if (sessionParam.includes('_')) {
        sessionId = sessionParam.split('_')[1]
      } else {
        sessionId = sessionParam
      }
    }

    if (!sessionId) {
      setStatus('error')
      setMessage('Invalid QR code. No session found.')
      return
    }

    // not logged in — send to login, then come back
    if (!user) {
      navigate(`/login?redirect=/attend?session=${sessionParam}`, { replace: true })
      return
    }

    // mark attendance
    const markAndRedirect = async () => {
      try {
        const res = await api.post('/attendance/qr-scan', { session_id: parseInt(sessionId) })
        const { role, redirect, already_marked } = res.data

        if (already_marked) {
          setStatus('success')
          setMessage('You are already marked present for this session!')
        } else {
          setStatus('success')
          setMessage('Attendance marked successfully! Redirecting...')
        }

        setTimeout(() => {
          navigate(redirect || getDashboardByRole(role || user.role), { replace: true })
        }, 2000)

      } catch (err) {
        const msg = err.response?.data?.error || 'Could not mark attendance. Please try again.'
        setStatus('error')
        setMessage(msg)
      }
    }

    markAndRedirect()
  }, [authLoading, user])

  const getDashboardByRole = (role) => {
    if (role === 'technical_mentor') return '/faculty/sessions'
    if (role === 'admin') return '/admin/analytics'
    return '/dashboard'
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">

        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-cyan-500 rounded-[2rem] shadow-2xl shadow-primary/30 text-white mx-auto">
          <Rocket size={36} />
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-12 shadow-2xl space-y-6">

          {status === 'loading' && (
            <>
              <Loader2 size={48} className="text-primary animate-spin mx-auto" />
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Marking Attendance</h2>
                <p className="text-slate-400 text-sm font-medium mt-2">Please wait...</p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">You're In!</h2>
                <p className="text-slate-400 text-sm font-medium mt-2">{message}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Redirecting to your dashboard...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={48} className="text-rose-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Something went wrong</h2>
                <p className="text-slate-400 text-sm font-medium mt-2">{message}</p>
              </div>
              <button
                onClick={() => navigate(getDashboardByRole(user?.role), { replace: true })}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all"
              >
                Go to Dashboard
              </button>
            </>
          )}

        </div>

        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Attendify · Smart Attendance System
        </p>
      </div>
    </div>
  )
}

export default Attend