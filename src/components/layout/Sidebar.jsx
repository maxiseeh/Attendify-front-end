import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  Zap,
  Activity,
  BookOpen
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useContext(AuthContext) || {};
  const location = useLocation();

  const role = user?.role || "student";
  const isAdmin = role === "admin";
  const isFaculty = role === "technical_mentor";

  const studentMenu = [
    { name: "Home", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Attendance", path: "/student/attendance", icon: Calendar },
    { name: "Campus Hub", path: "/student/attendance", icon: Users },
  ];

  const facultyMenu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Sessions", path: "/faculty/sessions", icon: BookOpen },
  ];

  const adminMenu = [
    { name: "Oversight", path: "/dashboard", icon: Zap },
    { name: "Analytics", path: "/admin/analytics", icon: Activity },
    { name: "Nodes", path: "/admin/analytics", icon: Settings },
  ];

  const menu = isAdmin ? adminMenu : isFaculty ? facultyMenu : studentMenu;

  return (
    <aside className={`w-64 fixed inset-y-0 left-0 flex flex-col z-50 transition-all duration-500 border-r ${isAdmin ? 'bg-slate-950 border-slate-800 shadow-2xl' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'}`}>
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isAdmin ? 'bg-white' : 'bg-primary'}`}>
            <span className={`font-black text-lg ${isAdmin ? 'text-slate-950' : 'text-white'}`}>A</span>
          </div>
          <span className={`text-2xl font-black tracking-tighter transition-colors duration-500 ${isAdmin ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Attendify</span>
        </Link>
      </div>

      <div className="px-6 mb-6">
        <div className={`h-[1px] w-full ${isAdmin ? 'bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menu.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${
                active 
                ? (isAdmin ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.05]" : "bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light") 
                : (isAdmin ? "text-slate-500 hover:text-white hover:bg-slate-900" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100")
              }`}
            >
              <item.icon size={18} className={active ? (isAdmin ? "text-white" : "text-primary dark:text-primary-light") : "text-slate-500"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className={`rounded-[2rem] p-6 transition-all duration-500 border ${isAdmin ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'}`}>
          <div className="flex items-center gap-4 mb-5">
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black border transition-all duration-500 ${isAdmin ? 'bg-primary text-white border-primary/20 shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-700 text-primary dark:text-primary-light border-slate-200 dark:border-slate-600'}`}>
               {user?.name?.charAt(0) || "U"}
             </div>
             <div className="flex-1 min-w-0">
               <p className={`text-xs font-black truncate uppercase tracking-tighter ${isAdmin ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{user?.name || "Student"}</p>
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{isAdmin ? "Admin Root" : isFaculty ? "Technical Mentor" : "Class of 2026"}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAdmin ? 'bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 hover:border-rose-100'}`}
          >
            <LogOut size={14} />
            LOG OUT
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;