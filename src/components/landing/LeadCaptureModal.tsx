import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, ArrowLeft, Download, Store, Utensils, ShoppingBag } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const { config } = useAdminStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    businessType: "retail",
  });

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({ fullName: "", phone: "", email: "", businessType: "retail" });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Move to processing state
    
    // Simulate API call and provisioning
    setTimeout(() => {
      setStep(3); // Success state
    }, 2500);
  };

  const businessTypes = [
    { id: "retail", label: "محلات التجزئة", icon: ShoppingBag },
    { id: "restaurant", label: "مطعم / كافيه", icon: Utensils },
    { id: "supermarket", label: "سوبر ماركت", icon: Store },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== 2 ? onClose : undefined}
            className="fixed inset-0 z-[100] bg-brand-navy/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 pointer-events-none" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2rem] shadow-premium-xl overflow-hidden pointer-events-auto relative flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              {step !== 2 && (
                <button
                  onClick={onClose}
                  className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-brand-navy transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 right-0 h-full bg-brand-primary"
                  initial={{ width: "33%" }}
                  animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Step 1: Form Collection */}
              {step === 1 && (
                <div className="p-8 md:p-10 overflow-y-auto">
                  <div className="mb-8 text-center">
                    <span className="inline-block px-3 py-1 bg-brand-emerald/10 text-brand-emerald text-[11px] font-[900] rounded-full mb-4">
                      تجربة مجانية لمدة 14 يوم
                    </span>
                    <h2 className="text-2xl font-[900] text-brand-navy mb-2">أهلاً بك في منظومة</h2>
                    <p className="text-sm font-bold text-brand-muted">أدخل بياناتك وسنقوم بتجهيز نسختك في ثوانٍ معدودة.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Business Type */}
                    <div>
                      <label className="block text-sm font-[800] text-brand-navy mb-3">نوع النشاط التجاري</label>
                      <div className="grid grid-cols-3 gap-3">
                        {businessTypes.map((type) => {
                          const Icon = type.icon;
                          const isSelected = formData.businessType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, businessType: type.id })}
                              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                                isSelected
                                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                  : "border-brand-border/60 bg-white text-brand-muted hover:border-brand-border"
                              }`}
                            >
                              <Icon className="w-6 h-6 mb-2" />
                              <span className="text-[11px] font-[900]">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-[800] text-brand-navy mb-1.5">الاسم بالكامل</label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-slate-50 text-sm font-bold text-brand-navy focus:bg-white focus:border-brand-primary outline-none transition-all"
                          placeholder="أحمد محمد"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-[800] text-brand-navy mb-1.5">رقم الموبايل (واتساب)</label>
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-slate-50 text-sm font-bold text-brand-navy text-left focus:bg-white focus:border-brand-primary outline-none transition-all"
                          placeholder="010 0000 0000"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-primary py-4 mt-6 text-[15px] shadow-brand-glow flex items-center justify-center gap-2"
                    >
                      تجهيز النسخة الخاصة بي
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[11px] font-bold text-slate-400 mt-4">
                      بالنقر على الزر، أنت توافق على شروط الاستخدام. لا نطلب بطاقة ائتمانية.
                    </p>
                  </form>
                </div>
              )}

              {/* Step 2: Loading / Provisioning */}
              {step === 2 && (
                <div className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mb-8 relative">
                    <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                  </div>
                  <h3 className="text-xl font-[900] text-brand-navy mb-3">جاري تجهيز مساحة العمل...</h3>
                  <p className="text-brand-muted font-bold text-sm">
                    نقوم بإعداد قاعدة البيانات، وتكوين الإعدادات الخاصة بـ {businessTypes.find(t => t.id === formData.businessType)?.label}.
                  </p>
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-2xl font-[900] text-brand-navy mb-3">تم تجهيز حسابك بنجاح!</h3>
                  <p className="text-brand-muted font-bold text-sm mb-8">
                    مرحباً بك {formData.fullName.split(' ')[0]} في منظومة. تم إرسال رسالة ترحيبية على الواتساب تحتوي على بيانات الدخول.
                  </p>
                  
                  <div className="w-full space-y-3">
                    <button onClick={onClose} className="w-full btn-primary py-4 text-[15px] flex items-center justify-center gap-2 shadow-brand-glow">
                      الانتقال إلى لوحة التحكم
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button className="w-full py-4 text-[14px] font-[800] text-brand-navy bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      تحميل تطبيق الـ Desktop
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
