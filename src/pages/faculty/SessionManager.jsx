import { useState, useContext, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import QRGenerator from "../../components/attendance/QRGenerator";
import Modal from "../../components/common/Modal";
import { AttendanceContext } from "../../AttendanceContext";
import { Plus, LayoutGrid, Loader2, QrCode, Users, XCircle, History, Clock, CheckCircle, BookOpen } from "lucide-react";

function SessionManager() {
  const { sessions, loading, fetchSessions, createSession, closeSession, getSessionAttendees } = useContext(AttendanceContext);

  const [tab, setTab] = useState("active"); // 'active' | 'history'
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [location, setLocation] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const activeSessions = sessions.filter(s => s.status === "Active");
  const closedSessions = sessions.filter(s => s.status === "Closed");

  const handleCreate = async () => {
    if (!sessionName.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      await createSession({ name: sessionName.trim(), course_code: courseCode.trim(), location: location.trim() });
      setShowModal(false);
      setSessionName(""); setCourseCode(""); setLocation("");
      setTab("active");
    } catch (err) {
      setCreateError(err.response?.data?.error || "Failed to create session.");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = (sessionId) => {
    closeSession(sessionId);
    if (selectedSession?.id === sessionId) setSelectedSession(null);
  };

  const attendees = selectedSession ? getSessionAttendees(selectedSession.id) : [];

  const formatDate = (iso) => iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Navbar title="Session Control" />

    <main className="p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Sessions</h2>
          <p className="text-slate-400 font-medium mt-1 text-sm">
            {activeSessions.length} active · {closedSessions.length} closed
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-cool flex items-center gap-2">
          <Plus size={20} /> New Session
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[{ key: "active", label: "Active", icon: CheckCircle }, { key: "history", label: "History", icon: History }].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSelectedSession(null); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === key ? "bg-white dark:bg-slate-900 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sessions list */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (tab === "active" ? activeSessions : closedSessions).length === 0 ? (
            <div className="glass-card p-16 flex flex-col items-center text-center dark:bg-slate-900/50 dark:border-slate-800">
              <LayoutGrid size={32} className="text-slate-300 mb-4" />
              <p className="font-bold text-slate-500">{tab === "active" ? "No active sessions" : "No closed sessions yet"}</p>
              {tab === "active" && <p className="text-xs text-slate-400 mt-1">Click New Session to start one.</p>}
            </div>
          ) : (
            (tab === "active" ? activeSessions : closedSessions).map((session) => {
              const isSelected = selectedSession?.id === session.id;
              const attendeeCount = getSessionAttendees(session.id).length;
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(isSelected ? null : session)}
                  className={`glass-card p-6 cursor-pointer transition-all hover:shadow-md dark:bg-slate-900/50 dark:border-slate-800 ${isSelected ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-950" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${session.status === "Active" ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <BookOpen size={18} className={session.status === "Active" ? "text-emerald-500" : "text-slate-400"} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-slate-100">{session.session_name}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {session.course_code && <span className="mr-2">{session.course_code}</span>}
                          {session.location && <span>{session.location}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        session.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {session.status === "Active" && <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />}
                        {session.status}
                      </span>
                      {session.status === "Active" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleClose(session.id); }}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                          title="End session"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {formatDate(session.created_at)}</span>
                    <span className="flex items-center gap-1.5"><Users size={12} /> {attendeeCount} present</span>
                    {session.closed_at && <span className="flex items-center gap-1.5 text-rose-400"><XCircle size={12} /> Ended {formatDate(session.closed_at)}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right panel: QR + attendees */}
        <div className="lg:col-span-5">
          {selectedSession ? (
            <div className="sticky top-28 space-y-6">
              {selectedSession.status === "Active" && (
                <QRGenerator
                  value={`session_${selectedSession.id}_${selectedSession.session_name}`}
                  title={selectedSession.session_name}
                  subtitle="Students scan this to check in."
                />
              )}
              <div className="glass-card p-6 dark:bg-slate-900/50 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  Attendees ({attendees.length})
                </h4>
                {attendees.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">No students have checked in yet.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {attendees.map((a, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{a.student_name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {formatDate(a.check_in_time)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Present</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">{a.method === "wifi" ? "📶 WiFi" : "📷 QR"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card min-h-[300px] flex flex-col items-center justify-center text-center p-10 opacity-50 dark:bg-slate-900/50 dark:border-slate-800">
              <QrCode size={40} className="text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-400">Select a session to view QR & attendees</p>
            </div>
          )}
        </div>
      </div>
    </main>
  </div>

  <Modal isOpen={showModal} onClose={() => { setShowModal(false); setCreateError(""); }} title="Start New Session">
    <div className="space-y-5">
      {[
        { label: "Session Name", value: sessionName, set: setSessionName, placeholder: "e.g. Software Engineering — Week 4", required: true },
        { label: "Course Code", value: courseCode, set: setCourseCode, placeholder: "e.g. CS301" },
        { label: "Location / Room", value: location, set: setLocation, placeholder: "e.g. Room 101" },
      ].map(({ label, value, set, placeholder, required }) => (
        <div key={label} className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{label}</label>
          <input
            type="text" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold dark:text-white transition-all"
            required={required}
          />
        </div>
      ))}
      {createError && <p className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold">{createError}</p>}
      <button onClick={handleCreate} disabled={creating || !sessionName.trim()} className="w-full btn-cool py-4 flex items-center justify-center gap-2 disabled:opacity-50">
        {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
        Start Session
      </button>
    </div>
  </Modal>
</div>
  );
}

export default SessionManager;