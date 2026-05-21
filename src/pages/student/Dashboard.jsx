import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { AuthContext } from "../../AuthContext";
import { getStudentAttendance, getSessions } from "../../services/attendanceService";
import {
  CheckCircle,
  Calendar,
  Users,
  Activity,
  ArrowRight,
  Clock,
  Zap,
  BarChart3,
  Cpu,
  TrendingUp,
  Target,
} from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const isFaculty = user?.role === "teacher";

  const [stats, setStats] = useState({ attended: 0, total: 0, hours: 0 });
  const [recentSessions, setRecentSessions] = useState([]);
  const [adminStats, setAdminStats] = useState({ totalStudents: 0, totalSessions: 0, avgAttendance: "0%" });
  const [adminModules, setAdminModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchStudentData();
    }
  }, [isAdmin]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const [attendanceRes, sessionsRes] = await Promise.all([
        getStudentAttendance(user?.id || "me"),
        getSessions(),
      ]);

      const records = attendanceRes?.data?.records || [];
      const sessions = sessionsRes?.data?.sessions || [];

      const attended = records.filter((r) => r.status === "present").length;
      const total = sessions.length;
      const hours = Math.round(attended * 1.5);

      setStats({ attended, total, hours });

      const recent = records
        .filter((r) => r.status === "present")
        .slice(0, 3)
        .map((r) => ({
          id: r._id || r.id || r.session_id,
          name: r.sessionName || r.session_name || r.session || "Session",
          room: r.room || r.location || "Campus",
          time: r.check_in_time || r.date
            ? new Date(r.check_in_time || r.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : "—",
          date: r.check_in_time || r.date
            ? new Date(r.check_in_time || r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : "—",
        }));

      setRecentSessions(recent);
    } catch (err) {
      console.log("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const sessionsRes = await getSessions();
      const sessions = sessionsRes?.data?.sessions || [];
      setAdminStats({
        totalStudents: 0,
        totalSessions: sessions.length,
        avgAttendance: "—",
      });
      setAdminModules(sessions.slice(0, 4).map((s) => ({
        label: s.session_name || s.name || "Session",
        total: s.total_students || 0,
        attended: s.present_count || 0,
        percent: s.total_students > 0
          ? `${Math.round((s.present_count / s.total_students) * 100)}%`
          : "0%",
      })));
    } catch (err) {
      console.log("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const studentHighlights = [
    { label: "Present", value: loading ? "..." : String(stats.attended), icon: CheckCircle, color: "text-primary", bg: "bg-primary/5" },
    { label: "Total Sessions", value: loading ? "..." : String(stats.total), icon: Calendar, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
    { label: "Hours Logged", value: loading ? "..." : `${stats.hours}h`, icon: Clock, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  ];

  const adminHighlights = [
    { label: "Total Students", value: loading ? "..." : String(adminStats.totalStudents), icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Total Sessions", value: loading ? "..." : String(adminStats.totalSessions), icon: Cpu, color: "text-primary-light", bg: "bg-primary/10" },
    { label: "Avg Attendance", value: loading ? "..." : adminStats.avgAttendance, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  if (isFaculty) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Navbar title="Faculty Dashboard" />
          <main className="p-10 flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">
                Welcome, {user?.name || "Faculty"} 
              </h2>
              <p className="text-slate-400 font-medium">Manage your attendance sessions from the Sessions page.</p>
            </div>
            <button
              onClick={() => navigate("/faculty/sessions")}
              className="btn-cool flex items-center gap-2 mt-4"
            >
              Go to Sessions
              <ArrowRight size={18} />
            </button>
          </main>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Navbar title="Oversight Dashboard" />
          <main className="p-10 space-y-10 max-w-[1600px] mx-auto w-full">
            <div className="flex justify-between items-end border-b border-slate-900 pb-10">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tighter">Command Center</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">
                  Administrative Authority — Live Data
                </p>
              </div>
              <div className="flex gap-4">
                <div className="px-6 py-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Feed</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adminHighlights.map((item, i) => (
                <div key={i} className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl flex items-center justify-between group hover:border-primary-light transition-all">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
                    <p className="text-4xl font-black text-white tracking-tighter">{item.value}</p>
                  </div>
                  <div className={`p-5 rounded-3xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-slate-900/50 rounded-[4rem] p-12 border border-slate-800 backdrop-blur-xl">
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
                  <BarChart3 size={24} className="text-primary-light" />
                  Session Participation
                </h3>
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : adminModules.length === 0 ? (
                  <p className="text-slate-500 text-sm font-medium">No session data available yet.</p>
                ) : (
                  <div className="space-y-8">
                    {adminModules.map((m, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                          <span className="truncate max-w-[200px]">{m.label}</span>
                          <span className="text-white">{m.percent}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full shadow-[0_0_15px_#273BE2]"
                            style={{ width: m.percent === "—" ? "0%" : m.percent }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-primary/20 rounded-[4rem] p-12 border border-slate-800 relative overflow-hidden flex flex-col justify-center">
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Quick Actions</h3>
                <p className="text-slate-400 text-sm font-medium max-w-sm mb-10 leading-relaxed">
                  View detailed analytics, export reports, or review all attendance records.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/admin/analytics")}
                    className="w-fit px-10 py-4 bg-white text-slate-950 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
                  >
                    <TrendingUp size={16} />
                    View Analytics
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  
  const attendancePct = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Navbar title="Student Space" />
        <main className="p-10 space-y-10">
          {/* Hero banner */}
          <div className="relative p-10 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden shadow-2xl border border-white/5">
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-2 tracking-tight">Hey {user?.name || "there"}! 👋</h2>
              <p className="text-slate-400 font-medium max-w-lg">
                {attendancePct >= 75
                  ? `You're at ${attendancePct}% attendance — great work! Keep it up.`
                  : attendancePct > 0
                  ? `You're at ${attendancePct}% attendance. Try to attend more sessions!`
                  : "Welcome! Start attending sessions to track your progress."}
              </p>
              <button
                onClick={() => navigate("/student/attendance")}
                className="mt-8 px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2"
              >
                Check Attendance Log
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px]"></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studentHighlights.map((item, i) => (
              <div key={i} className="glass-card p-10 flex items-center justify-between group hover:scale-[1.02] transition-transform duration-300 dark:bg-slate-900/50 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-4xl font-black text-slate-800 dark:text-slate-100">{item.value}</p>
                </div>
                <div className={`p-5 rounded-3xl ${item.bg} ${item.color} group-hover:rotate-6 transition-transform shadow-xl`}>
                  <item.icon size={28} />
                </div>
              </div>
            ))}
          </div>

          {/* Attendance rate bar */}
          {stats.total > 0 && (
            <div className="glass-card p-8 dark:bg-slate-900/50 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Target size={16} className="text-primary" />
                  Attendance Rate
                </p>
                <span className={`text-sm font-black ${attendancePct >= 75 ? "text-emerald-500" : "text-rose-500"}`}>
                  {attendancePct}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${attendancePct >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${attendancePct}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">
                {attendancePct >= 75 ? "Above minimum threshold (75%)" : "Below minimum threshold — attend more classes!"}
              </p>
            </div>
          )}

          {/* Recent sessions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Attended Sessions</h3>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="glass-card p-12 flex flex-col items-center text-center dark:bg-slate-900/50 dark:border-slate-800 opacity-60">
                <Calendar size={40} strokeWidth={1} className="text-slate-400 mb-4" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No sessions attended yet</p>
                <p className="text-xs text-slate-400 mt-1">Scan a session QR code to mark your attendance.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((s) => (
                  <div key={s.id} className="glass-card p-8 flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 shadow-inner">
                        <Zap size={24} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">{s.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">{s.room} • {s.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">{s.time}</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5 justify-end mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block"></span>
                        Present
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
