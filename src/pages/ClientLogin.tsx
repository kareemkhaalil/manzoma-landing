import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { 
  User, 
  Loader2, 
  ArrowLeft, 
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Phone
} from "lucide-react";
import POSMockup from "../components/landing/mockups/POSMockup";

export default function ClientLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.manzoma.online';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
      
      localStorage.setItem('manzoma_client_token', data.token);
      navigate('/account');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-hidden font-sans" dir="rtl">
      <title>تسجيل الدخول — منظومة</title>
      
      {/* 1. Header (Floating Overlay) */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-5 flex items-center justify-between" dir="rtl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/icon.png" alt="منظومة" className="w-9 h-9 rounded-xl shadow-md shadow-black/5" />
          <span className="text-[16px] font-black tracking-tight text-slate-900">
            منظومة
          </span>
        </Link>
        
        {/* Right tools: Support */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://wa.me/201099600048"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-xl border border-slate-200/85 text-[11px] font-black flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 bg-white shadow-sm"
            style={{ color: "var(--text-2)" }}
          >
            <Phone className="w-3.5 h-3.5 text-indigo-500" />
            <span>الدعم الفني</span>
          </a>
        </div>
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
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/50 blur-3xl pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 40, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[620px] rounded-3xl overflow-hidden border border-white bg-white/50 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:rotate-0 transition-all duration-500 relative z-10"
          >
            <div className="px-4 py-3 border-b border-white bg-white/40 backdrop-blur-md flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white/60 border border-slate-200/50 rounded-lg px-6 py-0.5 text-[9px] text-slate-400 font-mono tracking-wider">
                app.manzoma.online
              </div>
              <div className="w-5" />
            </div>

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
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                تسجيل الدخول
              </h1>
              <p className="text-xs text-slate-400 font-bold mt-1.5">
                مرحباً بك مجدداً! قم بتسجيل الدخول لإدارة متجرك
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3 rounded-xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Form fields */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500">اسم المستخدم أو رقم الهاتف</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    dir="ltr"
                    className="w-full h-11 bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 text-xs font-bold text-slate-850 focus:outline-none transition-all"
                    placeholder="ادخل اسم المستخدم..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500">كلمة المرور</label>
                <div className="relative flex items-center h-11 bg-slate-50/50 border border-slate-200/80 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    className="flex-grow h-full bg-transparent px-4 text-xs font-bold text-slate-850 focus:outline-none"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="h-full px-3 text-slate-400 hover:text-slate-600 transition-colors border-0 bg-transparent cursor-pointer"
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "جاري التحقق..." : "تسجيل الدخول"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                أو
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Footer Navigation */}
            <div className="space-y-3.5 pt-4 text-center">
              <p className="text-xs text-slate-400 font-bold">
                ليس لديك حساب؟{" "}
                <Link to="/signup" className="text-indigo-600 hover:underline">
                  اشترك الآن مجاناً
                </Link>
              </p>
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
