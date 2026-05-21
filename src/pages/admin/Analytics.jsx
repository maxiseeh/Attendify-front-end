import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import {
  getSessions,
  getSessionAttendance,
} from "../../services/attendanceService";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Download,
  Zap,
  AlertCircle,
  Loader2,
} from "lucide-react";

function Analytics() {
  const [sessions, setSessions] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getSessions();
        const sessionList = res.data?.sessions || [];
        setSessions(sessionList);

        // fetch attendance per session
        const results = await Promise.allSettled(
          sessionList.map((s) => getSessionAttendance(s.id || s._id)),
        );

        let allPresent = 0;
        let allTotal = 0;

        const computed = sessionList.map((s, i) => {
          const data =
            results[i].status === "fulfilled" ? results[i].value?.data : null;
          const records = data?.attendance_records || data?.records || [];
          const present = records.filter(
            (r) => r.status === "present" || r.check_in_method,
          ).length;
          const total = records.length;
          allPresent += present;
          allTotal += total;
          return {
            label: s.session_name || s.name || "Session",
            course: s.course_code || "",
            location: s.location || "",
            total,
            attended: present,
            percent:
              total > 0 ? `${Math.round((present / total) * 100)}%` : "0%",
          };
        });

        setModules(computed);
        setTotalPresent(allPresent);
        setTotalRecords(allTotal);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const avgAttendance =
    totalRecords > 0
      ? `${Math.round((totalPresent / totalRecords) * 100)}%`
      : "—";

  const statCards = [
    {
      label: "Avg Attendance",
      val: loading ? "..." : avgAttendance,
      sub: "Across all sessions",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Sessions",
      val: loading ? "..." : String(sessions.length),
      sub: "All time",
      icon: Target,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Total Check-ins",
      val: loading ? "..." : String(totalPresent),
      sub: "Verified attendances",
      icon: Users,
      color: "text-primary-light",
      bg: "bg-primary/20",
    },
    {
      label: "System Status",
      val: "Optimal",
      sub: "All nodes responding",
      icon: Zap,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
  ];

  const handleExport = () => {
    const csv = [
      "Session,Course,Location,Total,Present,Rate",
      ...modules.map(
        (m) =>
          `"${m.label}","${m.course}","${m.location}",${m.total},${m.attended},${m.percent}`,
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Navbar title="Intelligence Command" />

        <main className="p-10 space-y-12 max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-800 pb-10">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">
                System Oversight
              </h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 flex items-center gap-2">
                <Zap size={14} className="text-primary-light" />
                Live Institutional Telemetry
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleExport}
                disabled={modules.length === 0}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statCards.map((stat, i) => (
              <div
                key={i}
                className="bg-slate-800/50 p-10 rounded-[40px] border border-slate-700/50 shadow-2xl flex flex-col gap-6 group hover:border-primary/50 transition-all duration-500"
              >
                <div
                  className={`p-4 w-fit rounded-[24px] ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-2">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-black text-white tracking-tighter">
                    {stat.val}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold mt-2">
                    {stat.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Session breakdown table */}
          <div className="bg-slate-800/30 rounded-[48px] shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
            <div className="px-10 py-10 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-2xl text-slate-500 border border-slate-700 shadow-sm">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Session Attendance Breakdown
                </h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800">
                <AlertCircle size={14} className="text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Live Data
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Loading analytics...
                  </p>
                </div>
              ) : modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-40">
                  <BarChart3
                    size={40}
                    strokeWidth={1}
                    className="text-slate-500"
                  />
                  <p className="text-sm font-bold text-slate-400">
                    No session data yet
                  </p>
                  <p className="text-xs text-slate-500">
                    Sessions created by teachers will appear here.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-y border-slate-800">
                    <tr>
                      <th className="px-10 py-6">Session</th>
                      <th className="px-10 py-6">Course</th>
                      <th className="px-10 py-6 text-center">Check-ins</th>
                      <th className="px-10 py-6 text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {modules.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0"></div>
                            <div>
                              <span className="text-sm font-bold text-slate-200 group-hover:text-primary-light transition-colors block">
                                {row.label}
                              </span>
                              {row.location && (
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {row.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-xs text-slate-400 font-black">
                          {row.course || "—"}
                        </td>
                        <td className="px-10 py-8 text-center text-xs text-slate-400 font-black">
                          {row.attended}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-5">
                            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-primary rounded-full shadow-[0_0_15px_#273BE2] transition-all"
                                style={{
                                  width:
                                    row.percent === "—" ? "0%" : row.percent,
                                }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-primary-light px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                              {row.percent}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;
