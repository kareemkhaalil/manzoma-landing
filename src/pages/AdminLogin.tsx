import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import POSMockup from "../components/landing/mockups/POSMockup";
import { loginAsSuperAdmin } from "../lib/apiService";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: localLogin } = useAdminStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginAsSuperAdmin(username, password);

      // Verify SUPER_ADMIN role
      if (data.user?.role !== "SUPER_ADMIN") {
        setError("هذه اللوحة مخصصة للمدير العام فقط (SUPER_ADMIN)");
        setLoading(false);
        return;
      }

      // Update local store for UI state
      localLogin(username, password);
      // Force auth state since we verified via API
      useAdminStore.setState({
        isAuthenticated: true,
        currentUser: {
          id: data.user.id,
          name: data.user.fullName || "المدير العام",
          email: data.user.username,
          role: "super_admin"
        }
      });

      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-hidden font-sans" dir="rtl">
      <title>تسجيل دخول السوبر أدمن — منظومة</title>
      
      {/* 1. Header (Floating Overlay) */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-5 flex items-center justify-between" dir="rtl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/icon.png" alt="منظومة" className="w-9 h-9 rounded-xl shadow-md shadow-black/5" />
          <span className="text-[16px] font-black tracking-tight text-slate-900">
            منظومة
          </span>
        </Link>
      </header>

      {/* Main split-screen container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="w-full flex flex-col lg:flex-row min-h-screen"
      >
        {/* 2. Left Side: Sky Gradient and Mockup Viewer (Desktop only) */}
        <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] relative items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-[#E0F2FE] via-[#F0F9FF] to-[#EEF2FF]">
          {/* Soft floating clouds or circles */}
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/50 blur-3xl pointer-events-none" />
          
          {/* Tilted Floating Mockup Device */}
          <motion.div 
            initial={{ opacity: 0, y: 40, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[620px] rounded-3xl overflow-hidden border border-white bg-white/50 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:rotate-0 transition-all duration-500 relative z-10"
          >
            {/* Browser Topbar */}
            <div className="px-4 py-3 border-b border-white bg-white/40 backdrop-blur-md flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white/60 border border-slate-200/50 rounded-lg px-6 py-0.5 text-[9px] text-slate-400 font-mono tracking-wider">
                admin.manzoma.online
              </div>
              <div className="w-5" />
            </div>

            {/* Render POSMockup inside the float */}
            <div className="scale-[0.93] origin-top py-2">
              <POSMockup />
            </div>
          </motion.div>
        </div>

        {/* 3. Right Side: Login Form */}
        <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 py-24 bg-white z-10 relative">
          <div className="w-full max-w-[420px] space-y-6 pt-10">
            
            {/* Form Header */}
            <div className="flex flex-col items-start text-right">
              {/* Custom Circular profile placeholder icon */}
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                لوحة تحكم السوبر أدمن
              </h1>
              <p className="text-xs text-slate-400 font-bold mt-1.5">
                قم بتسجيل الدخول كمدير عام للوصول للوحة التحكم
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Form fields */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500">اسم المستخدم</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    dir="ltr"
                    className="w-full h-11 bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-11 text-xs font-bold text-slate-800 focus:outline-none transition-all"
                    placeholder="super-admin"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-4 transition-colors" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500">كلمة المرور</label>
                <div className="relative flex items-center h-11 bg-slate-50/50 border border-slate-200/80 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 z-10 transition-colors" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    className="flex-grow h-full bg-transparent pl-11 pr-4 text-xs font-bold text-slate-800 focus:outline-none relative z-0"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="h-full px-3 text-slate-400 hover:text-slate-600 transition-colors border-0 bg-transparent cursor-pointer z-10 relative"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black inline-flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 mt-2 shadow-lg shadow-indigo-600/35 cursor-pointer border-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {loading ? "جاري التحقق..." : "تسجيل الدخول"}
              </button>
            </form>

            {/* Footer Navigation */}
            <div className="space-y-3.5 pt-4 text-center">
              <Link to="/" className="block text-[11px] font-black text-slate-400 hover:text-slate-600 transition-colors">
                العودة للصفحة الرئيسية
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
