import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileSpreadsheet, Gift } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { language } = useAdminStore();
  const isAr = language === "ar";

  useEffect(() => {
    // Check if we already showed it
    const hasSeen = localStorage.getItem("manzoma_exit_intent");
    if (hasSeen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        localStorage.setItem("manzoma_exit_intent", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Dummy API fetch to the backend to store lead
    try {
      await fetch("https://api.manzoma.online/v1/leads/magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent" }),
      }).catch(() => {}); // ignore errors for demo
      
      setSubmitted(true);
      
      // Auto close after 3 seconds
      setTimeout(() => setIsVisible(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" dir={isAr ? "rtl" : "ltr"}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-emerald-500 pt-10 pb-6 px-6 text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400 rounded-full blur-2xl opacity-50" />
              <Gift className="w-16 h-16 text-white mx-auto drop-shadow-md mb-4 relative z-10 animate-bounce" />
              <h2 className="text-2xl font-black text-white relative z-10">
                {isAr ? "لسه بتفكر تقفل؟ استنى!" : "Thinking of leaving? Wait!"}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 text-center space-y-6">
              {!submitted ? (
                <>
                  <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                    {isAr 
                      ? "إيه رأيك تحمل شيت إكسيل مجاني عملناه بيحسب (نسبة الهالك وربحك الصافي) كهدية منا؟ هيساعدك تدير محلك أحسن." 
                      : "How about a free Excel template that calculates your shrinkage and net profit? It's our gift to help you run your store better."}
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isAr ? "أدخل بريدك الإلكتروني هنا..." : "Enter your email address..."}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-center dir-ltr"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full h-12 bg-slate-900 dark:bg-emerald-500 text-white font-black rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      {isAr ? "حمل الشيت المجاني الآن" : "Download Free Template Now"}
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isAr ? "مش هنبعتلك سبام. نوعدك." : "We won't spam you. Promise."}
                  </p>
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    {isAr ? "تم الإرسال بنجاح!" : "Sent successfully!"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {isAr ? "شيك على الإيميل بتاعك، الشيت في السكة." : "Check your inbox, the template is on its way."}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
