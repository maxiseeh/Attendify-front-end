import { Calendar, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

function SessionCard({ session, onClose, closing }) {
  const isActive = session?.status === "Active" || session?.is_active === true;
  const name = session?.session_name || session?.name || "Untitled Session";
  const dateVal = session?.created_at || session?.date;

  return (
    <div className="glass-card p-8 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"} group-hover:scale-110 transition-transform`}>
          <CheckCircle2 size={24} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`}>
          {session?.status || "Active"}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">
        {name}
      </h3>

      <div className="space-y-3 mt-6">
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
          <Calendar size={14} />
          {dateVal ? new Date(dateVal).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date set"}
        </div>
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
          <Clock size={14} />
          {dateVal ? new Date(dateVal).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—"}
        </div>
      </div>

      {onClose && isActive && (
        <button
          onClick={onClose}
          disabled={closing}
          className="w-full mt-8 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {closing ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          Close Session
        </button>
      )}

      {!onClose && (
        <button className="w-full mt-8 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
          View Details
        </button>
      )}
    </div>
  );
}

export default SessionCard;