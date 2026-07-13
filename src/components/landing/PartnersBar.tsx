import React from "react";
import { useAdminStore } from "../../store/adminStore";

export default function PartnersBar() {
  const { config, language } = useAdminStore();
  const isAr = language === "ar";
  
  // Custom styled partner items for Egyptian market
  const defaultPartners = [
    { name: isAr ? "فودافون كاش" : "Vodafone Cash", color: "from-red-500/10 to-red-600/5", textColor: "text-red-600 dark:text-red-400", border: "border-red-500/20" },
    { name: isAr ? "فوري" : "Fawry", color: "from-amber-400/10 to-yellow-500/5", textColor: "text-amber-600 dark:text-yellow-400", border: "border-amber-500/20" },
    { name: isAr ? "أمان" : "Aman", color: "from-blue-500/10 to-indigo-600/5", textColor: "text-blue-600 dark:text-indigo-400", border: "border-blue-500/20" },
    { name: isAr ? "ميزة" : "Meeza", color: "from-teal-500/10 to-emerald-600/5", textColor: "text-teal-600 dark:text-emerald-400", border: "border-teal-500/20" },
    { name: isAr ? "بنك مصر" : "Banque Misr", color: "from-yellow-600/10 to-amber-700/5", textColor: "text-yellow-700 dark:text-amber-300", border: "border-yellow-600/20" },
    { name: isAr ? "البنك الأهلي" : "NBE Bank", color: "from-emerald-700/10 to-green-800/5", textColor: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-700/20" },
    { name: isAr ? "فيزا / ماستركارد" : "Visa / MasterCard", color: "from-indigo-600/10 to-blue-700/5", textColor: "text-indigo-600 dark:text-blue-400", border: "border-indigo-600/20" }
  ];

  const partnersList = config.partners && config.partners.length > 0 
    ? config.partners.map((name, i) => ({
        name,
        color: "from-indigo-500/5 to-blue-600/5",
        textColor: "text-slate-650 dark:text-slate-300",
        border: "border-slate-200/40 dark:border-slate-800"
      }))
    : defaultPartners;

  // Quadruple items to prevent white space gap during animation
  const marqueeItems = [...partnersList, ...partnersList, ...partnersList, ...partnersList];

  return (
    <section className="py-12 bg-white dark:bg-[#060814]/40 border-y border-slate-100 dark:border-slate-900 overflow-hidden relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 text-center space-y-5 mb-6">
        <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-extrabold">
          {isAr ? "طرق الدفع المدعومة وشركاء النجاح في السوق المصري" : "Supported Payments & Merchant Networks"}
        </p>
      </div>

      <div className="relative w-full overflow-hidden depth-fade-x">
        {/* Infinite Scrolling Track */}
        <div className="flex w-max gap-6 py-2 animate-marquee-partners" dir="ltr">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl bg-gradient-to-tr ${item.color} border ${item.border} ${item.textColor} font-black text-xs md:text-sm shadow-sm select-none transition-all duration-300 hover:scale-105`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
