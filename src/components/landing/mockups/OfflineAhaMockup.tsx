import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, CloudOff, CloudLightning, CheckCircle2, Server, Smartphone, ArrowRight } from "lucide-react";

export default function OfflineAhaMockup() {
  const [step, setStep] = useState(0); // 0: Online, 1: Cable Cut, 2: Offline Sale, 3: Reconnected, 4: Synced

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans flex flex-col relative" dir="rtl">
      {/* Top Header */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors duration-500"
             style={{ backgroundColor: step === 1 || step === 2 ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)", 
                      color: step === 1 || step === 2 ? "#f43f5e" : "#10b981" }}>
          {step === 1 || step === 2 ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          {step === 1 || step === 2 ? "أوفلاين - جاري حفظ المبيعات محلياً" : "أونلاين - متصل بالخادم"}
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-8 relative">
        {/* Left: Server Status */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full transition-all duration-500 ${step === 1 || step === 2 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
            <Server className="w-12 h-12" />
          </div>
          <p className="text-sm font-bold text-slate-300">سيرفر مصلحة الضرائب / السحابة</p>
          <AnimatePresence mode="popLayout">
            {(step === 1 || step === 2) && (
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <CloudOff className="w-10 h-10 text-rose-500 bg-[#0f172a] rounded-full p-1" />
              </motion.div>
            )}
            {step === 4 && (
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <CloudLightning className="w-10 h-10 text-emerald-500 bg-[#0f172a] rounded-full p-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: POS Action */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">كاشير الفرع الرئيسي</p>
                <p className="text-[10px] text-slate-400">الفاتورة #1042</p>
              </div>
            </div>
          </div>

          {/* Action Simulation */}
          <div className="h-24 flex items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/50">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center text-sm font-bold text-slate-300">
                  <p>الإنترنت متصل 🟢</p>
                  <p className="text-xs text-slate-500">جاهز لاستقبال الطلبات</p>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center text-sm font-bold text-rose-400">
                  <p className="flex items-center justify-center gap-1.5"><WifiOff className="w-4 h-4"/> الكابل اتقطع!</p>
                  <p className="text-xs text-rose-500/70">النظام تحول للوضع المحلي فوراً</p>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center text-sm font-bold text-emerald-400">
                  <p>العميل بيحاسب 🛒</p>
                  <p className="text-xs text-emerald-500/70">تمت العملية بنجاح بدون إنترنت (Offline)</p>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center text-sm font-bold text-blue-400">
                  <p className="flex items-center justify-center gap-1.5"><Wifi className="w-4 h-4"/> الإنترنت رجع!</p>
                  <p className="text-xs text-blue-500/70">جاري اكتشاف الفواتير المحفوظة...</p>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center text-sm font-bold text-emerald-400">
                  <p className="flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> تم رفع البيانات</p>
                  <p className="text-xs text-emerald-500/70">تزامن تلقائي بدون تدخل العامل</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Visual Connection Line */}
      <div className="absolute top-[60%] left-[25%] right-[25%] h-1 overflow-hidden">
        <div className={`w-full h-full transition-colors duration-500 ${step === 1 || step === 2 ? "bg-rose-500/20" : "bg-emerald-500/20"}`} />
        {(step === 0 || step === 4) && (
           <motion.div 
             animate={{ x: [200, -200] }} 
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="absolute top-0 w-16 h-full bg-emerald-400 blur-sm"
           />
        )}
      </div>

    </div>
  );
}
