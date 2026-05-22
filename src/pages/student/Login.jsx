import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { ThemeContext } from "../../ThemeContext";
import { LogIn, UserPlus, Rocket, ShieldCheck, Sun, Moon, Eye, EyeOff, KeyRound, Lock, Cpu } from "lucide-react";

function Login() {
  const [tab, setTab] = useState("login");

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPassphrase, setLoginPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);

  // signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [batchCode, setBatchCode] = useState("");
  const [macAddress, setMacAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login, register, error: authError, user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/analytics", { replace: true });
      else if (user.role === "technical_mentor") navigate("/faculty/sessions", { replace: true });
      else navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const isAdminEmail = loginEmail.toLowerCase().includes("admin");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword, isAdminEmail ? loginPassphrase : undefined);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (signupPassword !== signupConfirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (!macAddress.trim()) {
      setLocalError("MAC address is required.");
      return;
    }
    if (!/^([0-9A-Fa-f]{2}[:\-]){5}([0-9A-Fa-f]{2})$/.test(macAddress.trim())) {
      setLocalError("Invalid MAC address format. Example: AA:BB:CC:DD:EE:FF");
      return;
    }
    if (signupRole === "technical_mentor" && !batchCode.startsWith("STAFF-")) {
      setLocalError("Invalid batch code. Contact your administrator.");
      return;
    }
    setLoading(true);
    try {
      localStorage.setItem('device_mac', macAddress.trim().toUpperCase())
      await register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        batch_code: signupRole === "technical_mentor" ? batchCode : undefined,
        mac_address: macAddress.trim(),
      });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 animate-pulse"></div>

      <div className="absolute top-10 right-10 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-primary shadow-xl border border-white/50 dark:border-slate-800 transition-all"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-cyan-500 rounded-[2rem] shadow-2xl shadow-primary/30 text-white mb-6">
            <Rocket size={36} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-1">Attendify</h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em]">Smart Attendance System</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-900/5 dark:shadow-black/20 border border-white/50 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { setTab("login"); setLocalError(""); }}
              className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                tab === "login" ? "text-primary dark:text-primary-light border-b-2 border-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <LogIn size={14} /> Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setLocalError(""); }}
              className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                tab === "signup" ? "text-primary dark:text-primary-light border-b-2 border-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <UserPlus size={14} /> Sign Up
            </button>
          </div>

          <div className="p-10">
            {/* LOGIN FORM */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="john.doe@university.edu"
                    required
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200 pr-14"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Passphrase field — only shows when email contains "admin" */}
                {isAdminEmail && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-violet-500 px-1 uppercase tracking-widest flex items-center gap-1">
                      <Lock size={10} /> Admin Passphrase
                    </label>
                    <div className="relative">
                      <input
                        type={showPassphrase ? "text" : "password"}
                        value={loginPassphrase}
                        onChange={(e) => setLoginPassphrase(e.target.value)}
                        placeholder="three-word-passphrase"
                        required
                        className="w-full px-6 py-4 bg-violet-50/80 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800/40 rounded-2xl focus:ring-2 focus:ring-violet-400 transition-all outline-none text-sm font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200 pr-14"
                      />
                      <button type="button" onClick={() => setShowPassphrase(!showPassphrase)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassphrase ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-violet-500 font-semibold px-1">Admin access requires a passphrase issued by your institution.</p>
                  </div>
                )}

                {displayError && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/30">
                    {displayError}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full btn-cool py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-60">
                  {loading ? "Signing in..." : "Sign In"}
                  <LogIn size={18} />
                </button>

                <p className="text-center text-xs text-slate-400 font-medium">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("signup")} className="text-primary dark:text-primary-light font-bold hover:underline">Sign up</button>
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {tab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="john.doe@university.edu"
                    required
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest">Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => { setSignupRole(e.target.value); setBatchCode(""); setLocalError(""); }}
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold dark:text-slate-200"
                  >
                    <option value="student">Student</option>
                    <option value="technical_mentor">Technical Mentor / Faculty</option>
                  </select>
                </div>

                {signupRole === "technical_mentor" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-amber-500 px-1 uppercase tracking-widest">Batch Code</label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-400" />
                      <input
                        type="text"
                        value={batchCode}
                        onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                        placeholder="STAFF-2026-XXXX"
                        required
                        className="w-full pl-12 pr-6 py-4 bg-amber-50/80 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold font-mono placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200"
                      />
                    </div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold px-1">Batch code is issued by your institution admin.</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200 pr-14"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 px-1 uppercase tracking-widest">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-cyan-500 px-1 uppercase tracking-widest flex items-center gap-1">
                    <Cpu size={10} /> Device MAC Address
                  </label>
                  <input
                    type="text"
                    value={macAddress}
                    onChange={(e) => setMacAddress(e.target.value.toUpperCase())}
                    placeholder="AA:BB:CC:DD:EE:FF"
                    required
                    className="w-full px-6 py-4 bg-cyan-50/80 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800/40 rounded-2xl focus:ring-2 focus:ring-cyan-400 transition-all outline-none text-sm font-semibold font-mono placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200"
                  />
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold px-1">Used for automatic WiFi check-in. Find it in your device network settings.</p>
                </div>

                {displayError && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/30">
                    {displayError}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full btn-cool py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-60">
                  {loading ? "Creating account..." : "Create Account"}
                  <UserPlus size={18} />
                </button>

                <p className="text-center text-xs text-slate-400 font-medium">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-primary dark:text-primary-light font-bold hover:underline">Sign in</button>
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 dark:bg-slate-900/50 border border-white dark:border-slate-800 rounded-full text-[10px] font-bold text-slate-400 shadow-sm">
            <ShieldCheck size={14} className="text-emerald-500" />
            Secured · Attendify © 2026
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;