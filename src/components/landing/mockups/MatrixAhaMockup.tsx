import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, CheckSquare, Plus, Check } from "lucide-react";

export default function MatrixAhaMockup() {
  const [step, setStep] = useState(0); // 0: select, 1: generating, 2: generated

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["أحمر", "أسود", "أبيض"];

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans relative" dir="rtl">
      
      {/* Header */}
      <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-3">
        <Shirt className="w-5 h-5 text-indigo-400" />
        <span className="text-sm font-bold text-white">تكويد صنف جديد (جاكيت كاجوال)</span>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">اختر المقاسات:</p>
                <div className="flex gap-2">
                  {sizes.map((s, i) => (
                    <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-500/20">
                      <CheckSquare className="w-3.5 h-3.5" />
                      {s}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">اختر الألوان:</p>
                <div className="flex gap-2">
                  {colors.map((c, i) => (
                    <motion.div key={c} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-500/20">
                      <CheckSquare className="w-3.5 h-3.5" />
                      {c}
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="w-full h-10 mt-4 bg-emerald-500 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                توليد الأصناف (12 صنف)
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-indigo-400">جاري توليد المصفوفة والباركود...</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="generated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 h-48 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />
              
              <div className="space-y-2">
                {sizes.flatMap((s) => colors.map((c) => `${s} - ${c}`)).slice(0, 5).map((combo, i) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">جاكيت كاجوال ({combo})</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">BAR-{Math.floor(10000 + Math.random() * 90000)}</span>
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
