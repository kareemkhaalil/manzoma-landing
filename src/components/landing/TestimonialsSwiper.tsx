import React from "react";
import { ShoppingCart, UserCheck, ClipboardCheck } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

interface TestimonialsSwiperProps {
  isAr?: boolean;
}

export default function TestimonialsSwiper({ isAr = true }: TestimonialsSwiperProps) {
  const { language } = useAdminStore();
  const isArLang = isAr || language === "ar";

  const steps = isArLang
    ? [
        {
          num: "01",
          title: "بيع سريع من الكاشير",
          desc: "إدخال الأصناف بالباركود أو البحث السريع وإصدار الفاتورة فوراً سواء كان الإنترنت متصلاً أو مقطوعاً.",
          icon: ShoppingCart,
          badge: "نقطة البيع الأوفلاين",
          color: "from-blue-500/10 to-indigo-500/10",
          iconBg: "bg-indigo-50 dark:bg-indigo-950 text-[#1F41AD] dark:text-indigo-400"
        },
        {
          num: "02",
          title: "خصم أو حركة مسجلة باسم المستخدم",
          desc: "كل حركة بيع أو خصم مالي أو تعديل تُسجل آلياً بحساب الكاشير المسؤول لتوثيق كل تفصيلة بدقة.",
          icon: UserCheck,
          badge: "شفافية وتدقيق الوردية",
          color: "from-emerald-500/10 to-teal-500/10",
          iconBg: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
        },
        {
          num: "03",
          title: "مراجعة الوردية والمخزون",
          desc: "تقفيل وردية الكاشير بمطابقة الخزينة الفعلية، وتحديث أرصدة المخزون ومزامنتها فور توفر الاتصال.",
          icon: ClipboardCheck,
          badge: "مطابقة الخزينة والمخزن",
          color: "from-amber-500/10 to-rose-500/10",
          iconBg: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
        }
      ]
    : [
        {
          num: "01",
          title: "Fast POS Checkout",
          desc: "Scan barcodes or search items and issue receipts instantly, online or offline without interruption.",
          icon: ShoppingCart,
          badge: "Offline-First Register",
          color: "from-blue-500/10 to-indigo-500/10",
          iconBg: "bg-indigo-50 dark:bg-indigo-950 text-[#1F41AD] dark:text-indigo-400"
        },
        {
          num: "02",
          title: "User-Attributed Actions",
          desc: "Every sale, manual discount, or adjustment is automatically recorded under the active shift operator.",
          icon: UserCheck,
          badge: "Shift Audit Trail",
          color: "from-emerald-500/10 to-teal-500/10",
          iconBg: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
        },
        {
          num: "03",
          title: "Shift & Stock Reconciliation",
          desc: "Close the register with physical cash checks and update warehouse balances with automatic sync.",
          icon: ClipboardCheck,
          badge: "Register & Stock Balance",
          color: "from-amber-500/10 to-rose-500/10",
          iconBg: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
        }
      ];

  return (
    <div id="how-it-works" className="w-full" dir={isArLang ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative rounded-[2rem] border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700">
                    {step.num}
                  </span>
                </div>

                <div>
                  <span className="inline-block text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {step.badge}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-[11px] font-bold text-slate-400 dark:text-slate-500">
                <span>{isArLang ? `خطوة ${idx + 1} من 3 في دورة العمل` : `Step ${idx + 1} of 3 in workflow`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
