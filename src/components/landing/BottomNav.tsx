import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, CreditCard, BookOpen, LogIn } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";
import { translations } from "../../lib/translations";

export default function BottomNav() {
  const location = useLocation();
  const { language } = useAdminStore();
  const t = translations[language];

  // Helper to determine if a route/hash is active
  const isActive = (path: string, hash?: string) => {
    if (hash) {
      return location.pathname === path && location.hash === hash;
    }
    return location.pathname === path && !location.hash;
  };

  const navItems = [
    {
      to: "/",
      label: t.home || "الرئيسية",
      icon: Home,
      active: isActive("/"),
    },
    {
      to: "/#features",
      label: t.features || "المميزات",
      icon: Sparkles,
      active: isActive("/", "#features"),
    },
    {
      to: "/#pricing",
      label: t.pricing || "الأسعار",
      icon: CreditCard,
      active: isActive("/", "#pricing"),
    },
    {
      to: "/academy",
      label: t.academy || "الأكاديمية",
      icon: BookOpen,
      active: isActive("/academy"),
    },
    {
      to: "/login",
      label: language === "ar" ? "دخول" : "Login",
      icon: LogIn,
      active: isActive("/login"),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <nav 
        className="mx-auto max-w-md w-full bg-white/80 dark:bg-[#0A192F]/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-around py-2.5 px-3 pointer-events-auto"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.to}
              className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all relative ${
                item.active 
                  ? "text-indigo-600 dark:text-cyan-400 font-black scale-105" 
                  : "text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-500 dark:hover:text-cyan-300"
              }`}
            >
              <Icon className="w-5 h-5 transition-transform" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              
              {/* Active Indicator dot */}
              {item.active && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600 dark:bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
