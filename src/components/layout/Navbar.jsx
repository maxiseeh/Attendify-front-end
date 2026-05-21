import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import { Bell, Search, User, Sun, Moon } from "lucide-react";

// Top navigation bar - clean and simple
function Navbar({ title = "Overview" }) {
  const { user } = useContext(AuthContext) || {};
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-3 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <Search size={16} className="text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none text-sm outline-none w-40 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-light shadow-sm border border-slate-100 dark:border-slate-700 transition-all"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-light shadow-sm border border-slate-100 dark:border-slate-700 transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700 transition-colors">
           <div className="text-right">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.name || "Student"}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{user?.role || "Member"}</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <User size={20} />
           </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
