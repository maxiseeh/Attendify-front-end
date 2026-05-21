import { useEffect, useState, useContext, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import WifiStatus from "../../components/attendance/WifiStatus";
import QRScanner from "../../components/attendance/QRScanner";
import { AuthContext } from "../../AuthContext";
import { AttendanceContext } from "../../AttendanceContext";
import useWifiContext from "../../hooks/useWifiContext";
import { Wifi, ScanLine, Clock, CheckCircle2, XCircle, BookOpen, History } from "lucide-react";

function MyAttendance() {
  const { user } = useContext(AuthContext);
  const { sessions, fetchSessions, markPresent, getStudentRecords } = useContext(AttendanceContext);
  const isOnline = useWifiContext();
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [tab, setTab] = useState("sessions");
  const [myRecords, setMyRecords] = useState([]);
  const wifiMarkedRef = useRef(false);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  useEffect(() => {
    if (!user?.id) return;
    getStudentRecords(user.id).then(setMyRecords);
  }, [user?.id, sessions]);

  const markedSessionIds = new Set(myRecords.map(r => r.session_id));

  // Auto-mark present on active sessions when WiFi is connected
  useEffect(() => {
    if (!isOnline || !user?.id || wifiMarkedRef.current) return;
    const activeSessions = sessions.filter(s => s.status === "Active" || s.is_active);
    if (activeSessions.length === 0) return;

    wifiMarkedRef.current = true;
    activeSessions.forEach(async (session) => {
      const result = await markPresent({
        sessionId: session.id,
        studentId: user.id,
        studentName: user.name,
        wifiConnected: true,
      });
      if (result && !result.alreadyMarked) {
        setScanStatus("success");
        setScanMessage(`Auto-checked in to "${session.session_name}" via WiFi`);
        setTimeout(() => setScanStatus(null), 6000);
      }
    });
  }, [isOnline]); // only re-run when WiFi status changes, not on every session update

  // Reset wifi auto-mark when going offline so it can re-trigger on reconnect
  useEffect(() => {
    if (!isOnline) wifiMarkedRef.current = false;
  }, [isOnline]);

  const handleScan = async (qrValue) => {
    setShowScanner(false);
    setScanStatus(null);
    const parts = qrValue.split("_");
    if (parts[0] !== "session" || !parts[1]) {
      setScanStatus("error");
      setScanMessage("Invalid QR code.");
      setTimeout(() => setScanStatus(null), 5000);
      return;
    }
    const sessionId = Number(parts[1]);
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      setScanStatus("error");
      setScanMessage("Session not found.");
      setTimeout(() => setScanStatus(null), 5000);
      return;
    }
    if (session.status !== "Active" && session.is_active !== true) {
      setScanStatus("error");
      setScanMessage("This session is no longer active.");
      setTimeout(() => setScanStatus(null), 5000);
      return;
    }
    if (markedSessionIds.has(sessionId)) {
      setScanStatus("error");
      setScanMessage("You are already marked present for this session.");
      setTimeout(() => setScanStatus(null), 5000);
      return;
    }
    const result = await markPresent({ sessionId, studentId: user.id, studentName: user.name, wifiConnected: false });
    if (result?.alreadyMarked) {
      setScanStatus("error");
      setScanMessage("Already marked present.");
    } else {
      setScanStatus("success");
      setScanMessage(`Checked in to "${session.session_name}" successfully!`);
    }
    setTimeout(() => setScanStatus(null), 5000);
  };

  const formatDate = (iso) => iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Navbar title="Attendance Hub" />

        <main className="p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">My Attendance</h2>
              <p className="text-slate-400 font-medium mt-1 text-sm">{myRecords.length} check-ins recorded</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <WifiStatus isConnected={isOnline} />
              <button
                onClick={() => setShowScanner(v => !v)}
                className="btn-cool flex items-center gap-2"
              >
                <ScanLine size={18} />
                {showScanner ? "Close Scanner" : "Scan QR"}
              </button>
            </div>
          </div>

          {/* WiFi auto-mark banner */}
          {isOnline && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Wifi size={16} />
              Connected to campus WiFi — you will be automatically marked present on active sessions.
            </div>
          )}

          {/* Scan feedback */}
          {scanStatus && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold border ${
              scanStatus === "success"
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
            }`}>
              {scanStatus === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {scanMessage}
            </div>
          )}

          {/* QR Scanner */}
          {showScanner && (
            <div className="glass-card p-8 dark:bg-slate-900/50 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <ScanLine size={16} className="text-primary" /> Scan Session QR Code
              </h3>
              <QRScanner onScan={handleScan} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
            {[{ key: "sessions", label: "All Sessions", icon: BookOpen }, { key: "history", label: "My Check-ins", icon: History }].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  tab === key ? "bg-white dark:bg-slate-900 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* All Sessions tab */}
          {tab === "sessions" && (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="glass-card p-16 flex flex-col items-center text-center dark:bg-slate-900/50 dark:border-slate-800 opacity-60">
                  <BookOpen size={32} className="text-slate-300 mb-3" />
                  <p className="font-bold text-slate-500">No sessions available yet</p>
                </div>
              ) : (
                sessions.map(session => {
                  const isPresent = markedSessionIds.has(session.id);
                  const myRecord = myRecords.find(r => r.session_id === session.id);
                  return (
                    <div key={session.id} className="glass-card p-6 dark:bg-slate-900/50 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${session.status === "Active" ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-slate-100 dark:bg-slate-800"}`}>
                            <BookOpen size={18} className={session.status === "Active" ? "text-emerald-500" : "text-slate-400"} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-slate-100">{session.session_name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {session.course_code && <span className="mr-2">{session.course_code}</span>}
                              {session.location && <span>{session.location}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Session status */}
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            session.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}>
                            {session.status === "Active" && <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />}
                            {session.status}
                          </span>
                          {/* Attendance status */}
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            isPresent
                              ? "bg-primary/5 text-primary dark:text-primary-light"
                              : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}>
                            {isPresent ? "✓ Present" : "Absent"}
                          </span>
                        </div>
                      </div>
                      {/* Check-in time if present */}
                      {isPresent && myRecord && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5"><Clock size={12} /> Checked in: {formatDate(myRecord.check_in_time)}</span>
                          <span>{myRecord.method === "wifi" ? "📶 Via WiFi" : "📷 Via QR Scan"}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* My Check-ins history tab */}
          {tab === "history" && (
            <div className="glass-card overflow-hidden dark:bg-slate-900/50 dark:border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-8 py-5">Session</th>
                    <th className="px-8 py-5">Check-in Time</th>
                    <th className="px-8 py-5">Method</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <History size={36} strokeWidth={1} />
                          <p className="text-sm font-bold text-slate-500">No check-ins yet</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    myRecords.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{r.session_name}</p>
                          {r.course_code && <p className="text-xs text-slate-400">{r.course_code}</p>}
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-400 font-medium">
                          <div className="flex items-center gap-1.5"><Clock size={12} /> {formatDate(r.check_in_time)}</div>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-400 font-medium">
                          {r.method === "wifi" ? "📶 WiFi" : "📷 QR Scan"}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Present
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MyAttendance;
