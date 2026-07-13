import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/adminStore";
import { translations } from "../../lib/translations";

interface NavbarProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
  theme?: "default" | "blue";
}

export default function Navbar({ isDark = false, onToggleTheme, theme = "default" }: NavbarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, config, theme: storedTheme, setTheme } = useAdminStore();
  const resolvedDark = onToggleTheme ? isDark : storedTheme === "dark";
  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }
    const nextTheme = storedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const t = translations[language];

  const links = [
    { to: "/#features", label: t.features },
    { to: "/#pricing", label: t.pricing },
    { to: "/integration", label: language === "ar" ? "الربط والتكامل" : "Integrations" },
    { to: "/blog", label: language === "ar" ? "المدونة" : "Blog" },
  ];

  const isBlue = theme === "blue";
  const visibleLinks = config.headerLinks?.filter((link) => link.url?.trim()).length
    ? config.headerLinks.map((link) => ({ ...link, to: link.url }))
    : links;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-[1440px] mx-auto">
        <nav className={`rounded-[1.8rem] px-6 h-[76px] flex items-center justify-between shadow-gabrun relative transition-all duration-300 ${isBlue
            ? "bg-white/10 border border-white/10 backdrop-blur-md"
            : "glass-gabrun"
          }`}>

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={config.siteName || "Manzoma"}>
            <img
              src={config.logoUrl || "/cdn/Asset 1.png"}
              onError={(event) => { event.currentTarget.src = "/cdn/Asset 1.png"; }}
              alt={config.siteName || "Manzoma"}
              className="h-10 w-auto max-w-36 object-contain object-right"
            />
            {/* <span className={`text-lg font-black tracking-tight ${
              isBlue ? "text-white" : "text-slate-900 dark:text-white"
            }`}>
              {language === "ar" ? "منظومة" : "Manzoma"}
            </span> */}
          </Link>

          {/* Desktop Links (Centered) */}
          <div className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isBlue
                    ? "text-white/80 hover:text-white"
                    : "text-slate-650 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions group: Theme, Language, CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${isBlue
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              style={!isBlue ? { background: "rgba(0, 82, 255, 0.05)" } : undefined}
            >
              {resolvedDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Direct Language Toggle Button */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer text-xs font-black shadow-sm hover:scale-105 active:scale-95 ${isBlue
                  ? "text-white hover:bg-white/10"
                  : "text-slate-650 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              style={!isBlue ? { background: "rgba(0, 82, 255, 0.05)" } : undefined}
              title={language === "ar" ? "Switch to English" : "تحويل إلى العربية"}
            >
              <span className="font-mono text-[13px] font-extrabold tracking-wide">
                {language === "ar" ? "EN" : "AR"}
              </span>
            </button>

            {/* Start Free Button */}
            <Link
              to="/signup"
              className={`hidden sm:inline-flex h-11 px-6 rounded-xl text-sm font-black items-center justify-center transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-lg ${isBlue
                  ? "bg-slate-900 text-white hover:bg-slate-950 shadow-slate-900/20"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20"
                }`}
            >
              {t.startFree}
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer ${isBlue ? "text-white hover:bg-white/10" : "text-slate-600 dark:text-slate-200"
                }`}
              style={!isBlue ? { background: "rgba(0, 82, 255, 0.05)" } : undefined}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`md:hidden mt-2 rounded-[2rem] p-5 space-y-2 shadow-2xl border ${isBlue ? "bg-slate-900/95 border-white/10 text-white backdrop-blur-xl" : "glass-gabrun"
                }`}
            >
              {visibleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${isBlue ? "hover:bg-white/10 text-white" : "hover:bg-indigo-500/10 text-slate-900 dark:text-slate-100"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className={`block w-full text-center h-12 leading-[3rem] rounded-xl text-sm font-black mt-3 ${isBlue ? "bg-white text-slate-950" : "text-white bg-indigo-600 hover:bg-indigo-500"
                  }`}
              >
                {t.startFree}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
