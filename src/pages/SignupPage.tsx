import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Copy,
  Phone,
  Eye,
  EyeOff
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import POSMockup from "../components/landing/mockups/POSMockup";
import { useSEO } from "../hooks/useSEO";

const API_URL = import.meta.env.VITE_API_URL || "https://api.manzoma.online";

export default function SignupPage() {
  const { language, setLanguage } = useAdminStore();
  const t = translations[language];
  const isAr = language === "ar";

  useSEO({
    title: t.signupSeoTitle,
    description: t.signupSeoDescription,
    keywords: t.signupSeoKeywords,
  });

  const [form, setForm] = useState({
    companyName: "", 
    adminFullName: "", 
    phone: "", 
    email: "",
    adminUsername: "",
    adminPassword: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<any>(null);
  
  // Copy states
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const copyText = (text: string, type: "user" | "pass") => {
    navigator.clipboard.writeText(text);
    if (type === "user") {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.phone || !form.adminPassword) {
      setError(t.signupRequiredError);
      return;
    }
    if (form.adminPassword.length < 6) {
      setError(t.signupPasswordLenError);
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      ...form,
      adminUsername: form.phone // Auto-generate username from phone to remove signup friction
    };

    try {
      const res = await fetch(`${API_URL}/api/public/register-trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isAr ? "فشل إنشاء الحساب" : "Failed to create account"));
      setSuccess(data);
    } catch (err: any) {
      setError(err.message || (isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  // Success view (Receipt style)
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 justify-center items-center py-12 px-6" dir={isAr ? "rtl" : "ltr"}>
        <title>{isAr ? "تم إنشاء الحساب — منظومة" : "Account Created — Manzoma"}</title>
        
        <main className="w-full max-w-md mx-auto">
          <div className="bg-white border border-slate-200/60 shadow-xl rounded-3xl p-8 text-center space-y-6">
            
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-black text-slate-900">{t.successHeading}</h1>
              <p className="text-xs text-slate-400 font-bold">{success.message}</p>
            </div>

            {/* Receipt Credentials Container */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 text-right space-y-4 font-mono text-[12px] shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-3" dir={isAr ? "rtl" : "ltr"}>
                <span className="text-slate-400 font-bold font-sans">{t.successCompanyName}</span>
                <span className="font-black text-slate-800">{success.credentials?.companyName}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-3" dir={isAr ? "rtl" : "ltr"}>
                <span className="text-slate-400 font-bold font-sans">{t.successUsername}</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 font-mono">{success.credentials?.username}</span>
                  <button 
                    onClick={() => copyText(success.credentials?.username || "", "user")}
                    className="p-1 text-indigo-500 hover:text-indigo-600 active:scale-95 flex items-center gap-1 font-sans font-black text-[10px] cursor-pointer"
                  >
                    <span>{copiedUser ? t.successCopied : t.successCopy}</span>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-slate-200/50 pb-3" dir={isAr ? "rtl" : "ltr"}>
                <span className="text-slate-400 font-bold font-sans">{t.successPassword}</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 font-mono">{form.adminPassword}</span>
                  <button 
                    onClick={() => copyText(form.adminPassword, "pass")}
                    className="p-1 text-indigo-500 hover:text-indigo-600 active:scale-95 flex items-center gap-1 font-sans font-black text-[10px] cursor-pointer"
                  >
                    <span>{copiedPass ? t.successCopied : t.successCopy}</span>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1" dir={isAr ? "rtl" : "ltr"}>
                <span className="text-slate-400 font-bold font-sans">{t.successTrialEnds}</span>
                <span className="font-black text-amber-500 font-mono">
                  {new Date(success.trialEndsAt).toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                </span>
              </div>
            </div>

            <a 
              href="https://app.manzoma.online"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-xl bg-indigo-600 text-white text-xs font-black inline-flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-indigo-500 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              {t.successEnterApp}
              <ArrowLeft className={`w-4 h-4 ${!isAr ? "rotate-180" : ""}`} />
            </a>

            <Link 
              to="/" 
              className="block text-xs font-black text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {t.signupBackHome}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-hidden font-sans" dir={isAr ? "rtl" : "ltr"}>
      <title>{isAr ? "إنشاء حساب تجريبي مجاني — منظومة" : "Create Free Trial Account — Manzoma"}</title>
      
      {/* 1. Header (Floating Overlay) */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-5 flex items-center justify-between" dir={isAr ? "rtl" : "ltr"}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/icon.png" alt="منظومة" className="w-9 h-9 rounded-xl shadow-md shadow-black/5" />
          <span className="text-[16px] font-black tracking-tight text-slate-900">
            {isAr ? "منظومة" : "Manzoma"}
          </span>
        </Link>
        
        {/* Right tools: Support & Language */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://wa.me/201099600048"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-xl border border-slate-200/85 text-[11px] font-black flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 bg-white shadow-sm"
            style={{ color: "var(--text-2)" }}
          >
            <Phone className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.getSupport}</span>
          </a>

          {/* Direct Language Toggle Button (No dropdown) */}
          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer text-xs font-black bg-slate-50 border border-slate-200/50 hover:scale-105 active:scale-95"
            style={{ color: "var(--text-2)" }}
            title={language === "ar" ? "Switch to English" : "تحويل إلى العربية"}
          >
            <span className="font-mono text-[12px] font-extrabold tracking-wide">
              {language === "ar" ? "EN" : "AR"}
            </span>
          </button>
        </div>
      </header>

      {/* Main split-screen container wrapped in motion.div for language fade transition */}
      <motion.div
        key={language}
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
                app.manzoma.online
              </div>
              <div className="w-5" />
            </div>

            {/* Render POSMockup inside the float */}
            <div className="scale-[0.93] origin-top py-2">
              <POSMockup />
            </div>
          </motion.div>
        </div>

        {/* 3. Right Side: Signup Form */}
        <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 py-24 bg-white z-10 relative">
          <div className="w-full max-w-[420px] space-y-6 pt-10">
            
            {/* Form Header */}
            <div className={`flex flex-col items-start ${isAr ? "text-right" : "text-left"}`}>
              {/* Custom Circular profile placeholder icon */}
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                {t.signupTitle}
              </h1>
              <p className="text-xs text-slate-400 font-bold mt-1.5">
                {t.signupSubtitle}
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3 rounded-xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1-Column layout: Store Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500">{t.signupStoreName}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                    className="w-full h-11 bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 text-xs font-bold text-slate-850 focus:outline-none transition-all"
                    placeholder={t.signupStorePlaceholder}
                    required
                  />
                </div>
              </div>

              {/* 1-Column layout: Phone Number */}
              {/* 1-Column layout: Phone Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500">{t.signupPhone}</label>
                <div className="relative flex items-center h-11 bg-slate-50/50 border border-slate-200/80 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:bg-white transition-all">
                    {/* Phone input */}
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      dir="ltr"
                      className="flex-grow h-full bg-transparent px-4 text-xs font-bold text-slate-850 focus:outline-none"
                      placeholder={t.signupPhonePlaceholder}
                      required
                    />
                    {/* Custom Egypt flag suffix */}
                    <div className={`flex items-center gap-1.5 bg-slate-100/50 border-slate-200/60 px-3.5 h-full pointer-events-none font-sans text-xs shrink-0 select-none ${isAr ? "border-r" : "border-l"}`}>
                      <span className="text-base">🇪🇬</span>
                      <span className="text-[11px] font-bold text-slate-500 font-sans">+20</span>
                    </div>
                  </div>
                </div>

              {/* Password with visibility toggler */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500">{t.signupPassword}</label>
                <div className="relative flex items-center h-11 bg-slate-50/50 border border-slate-200/80 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.adminPassword}
                    onChange={(e) => setForm(f => ({ ...f, adminPassword: e.target.value }))}
                    dir="ltr"
                    className="flex-grow h-full bg-transparent px-4 text-xs font-bold text-slate-850 focus:outline-none"
                    placeholder={t.signupPasswordPlaceholder}
                    autoComplete="new-password"
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
                {loading ? t.signupLoading : t.signupSubmit}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {isAr ? "أو" : "OR"}
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full h-12 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700 text-xs font-black cursor-pointer shadow-sm active:scale-95"
              onClick={() => alert(isAr ? "التسجيل عبر Google سيكون متاحاً قريباً!" : "Google Sign-in will be available soon!")}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.324 0-6.013-2.689-6.013-6.013s2.689-6.013 6.013-6.013c1.529 0 2.923.576 3.986 1.512l3.123-3.124C18.846 1.776 15.655 1 12.24 1 6.044 1 12.24 1 12.24 12.24s5.044 11.24 11.24 11.24c5.9 0 10.748-4.277 11.66-9.897H12.24z"/>
              </svg>
              <span>{t.signupGoogle}</span>
            </button>

            {/* Footer Navigation */}
            <div className="space-y-3.5 pt-4 text-center">
              <p className="text-xs text-slate-400 font-bold">
                {t.signupAlreadyHaveAcc}{" "}
                <a href="https://app.manzoma.online" className="text-indigo-600 hover:underline">
                  {t.signupLoginHere}
                </a>
              </p>
              <Link to="/" className="block text-[11px] font-black text-slate-400 hover:text-slate-600 transition-colors">
                {t.signupBackHome}
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
