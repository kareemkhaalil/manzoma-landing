import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

export default function ShiftMockup() {
  const [actualCash, setActualCash] = useState<string>("4800");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const shiftStats = {
    openingCash: 500,
    salesCash: 4500,
    expensesCash: 200,
  };

  const expectedCash = shiftStats.openingCash + shiftStats.salesCash - shiftStats.expensesCash; // 4800
  const counted = Number(actualCash) || 0;
  const difference = counted - expectedCash;

  const handleCloseShift = () => {
    setIsSubmitted(true);
  };

  const resetShift = () => {
    setIsSubmitted(false);
    setActualCash("4800");
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border shadow-xl relative select-none font-sans text-right min-h-[500px] flex flex-col"
         style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border)" }}
         dir="rtl">
      
      {/* Shift Header */}
      <header className="px-4 py-3 border-b flex items-center justify-between shrink-0"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-black" style={{ color: "var(--text-1)" }}>إقفال الوردية والتسوية المالية</span>
        </div>
        <span className="text-[9px] font-black bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">
          العد الأعمى (Blind Count)
        </span>
      </header>

      {/* Main shift viewport */}
      <div className="flex-1 p-5 flex flex-col items-center justify-center max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="counting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md w-full p-6 rounded-2xl border shadow-md space-y-6"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {/* Ledger Summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 border rounded-xl"
                     style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                  <span className="text-[9px] font-bold block mb-1" style={{ color: "var(--text-3)" }}>الرصيد الافتتاحي</span>
                  <span className="text-xs font-black" style={{ color: "var(--text-1)" }}>{shiftStats.openingCash} ج.م</span>
                </div>
                <div className="p-3 border rounded-xl"
                     style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                  <span className="text-[9px] font-bold block mb-1" style={{ color: "var(--text-3)" }}>المبيعات نقدية</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">+{shiftStats.salesCash} ج.م</span>
                </div>
                <div className="p-3 border rounded-xl"
                     style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                  <span className="text-[9px] font-bold block mb-1" style={{ color: "var(--text-3)" }}>المصروفات نقدية</span>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400">-{shiftStats.expensesCash} ج.م</span>
                </div>
              </div>

              {/* Counting field */}
              <div className="p-4 border rounded-xl text-center"
                   style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-strong)" }}>
                <span className="text-[10px] font-black block mb-2 uppercase tracking-wider"
                      style={{ color: "var(--brand)" }}>
                  أدخل النقدية الفعلية بالدرج (العد المادي)
                </span>
                <div className="relative max-w-[200px] mx-auto">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm" style={{ color: "var(--text-3)" }}>ج.م</span>
                  <input
                    type="number"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    placeholder="0"
                    className="w-full border rounded-xl pr-4 pl-10 py-3 text-2xl font-black text-center outline-none focus:ring-2 focus:ring-indigo-600/5 transition-all text-right"
                    style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-strong)", color: "var(--text-1)" }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCloseShift}
                  className="w-full h-11 text-white rounded-xl font-black text-xs hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>تأكيد إغلاق الوردية والترحيل المحاسبي</span>
                </button>
                <div className="text-[9px] text-center font-bold leading-relaxed" style={{ color: "var(--text-3)" }}>
                  * يقوم النظام تلقائياً بمقارنة الرقم المدخل مع الدفاتر للكشف عن أي عجز.
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="zreport"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full p-6 rounded-2xl border shadow-md space-y-5 text-right"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="text-center pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-black text-sm" style={{ color: "var(--text-1)" }}>تقرير تسوية الوردية (Z-Report)</h3>
                <span className="text-[9px] font-medium" style={{ color: "var(--text-3)" }}>حالة التصفية: تمت بنجاح</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 border rounded-xl"
                     style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                  <span className="text-[9px] font-bold block mb-1" style={{ color: "var(--text-3)" }}>الرصيد الدفتري المتوقع</span>
                  <span className="text-base font-black" style={{ color: "var(--text-1)" }}>{expectedCash} ج.م</span>
                </div>
                <div className="p-4 border rounded-xl"
                     style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--brand)" }}>
                  <span className="text-[9px] font-bold block mb-1" style={{ color: "var(--brand)" }}>الرصيد الفعلي المجرود</span>
                  <span className="text-base font-black" style={{ color: "var(--brand)" }}>{counted} ج.م</span>
                </div>
              </div>

              {/* Status Alert */}
              <div
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-all ${
                  difference < 0
                    ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400"
                    : difference > 0
                    ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
                    : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow ${
                  difference < 0 ? "bg-rose-500 text-white" : difference > 0 ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                }`}>
                  {difference < 0 ? (
                    <TrendingDown className="w-5 h-5" />
                  ) : difference > 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider mb-0.5">
                    {difference < 0 ? "يوجد عجز مالي في الدرج" : difference > 0 ? "يوجد زيادة مالية بالدرج" : "الخزينة مطابقة بنسبة 100%"}
                  </div>
                  <div className="text-xl font-black">
                    {difference === 0 ? "0 ج.م" : `${Math.abs(difference)} ج.م`}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={resetShift}
                  className="flex-1 h-10 rounded-xl font-black text-xs transition-all cursor-pointer"
                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-1)" }}
                >
                  إعادة تجربة المحاكاة
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
