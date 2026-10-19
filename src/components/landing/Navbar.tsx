import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Download, LogIn, ArrowRight, ArrowLeft } from "lucide-react";
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
  const isAr = language === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

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

  const defaultLinks = [
    { to: "/", label: t.home || (isAr ? "الرئيسية" : "Home") },
    { to: "/#features", label: t.features || (isAr ? "المميزات" : "Features") },
    { to: "/#pricing", label: t.pricing || (isAr ? "الأسعار" : "Pricing") },
    { to: "/download", label: isAr ? "تحميل البرنامج" : "Download" },
    { to: "/academy", label: t.academy || (isAr ? "الأكاديمية" : "Academy") },
    { to: "/blog", label: isAr ? "المدونة" : "Blog" },
  ];

  const headerLinksArray = Array.isArray(config?.headerLinks) ? config.headerLinks : [];
  const visibleLinks = headerLinksArray.filter((link) => link && link.url?.trim()).length
    ? headerLinksArray.map((link) => ({ ...link, to: link.url }))
    : defaultLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-[1360px] mx-auto">
        <nav className="h-16 rounded-2xl px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl bg-white/90 dark:bg-[#0B132B]/90 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-300">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={config.siteName || "Manzoma"}>
            <img
              src={config.logoUrl || "/cdn/Asset 1.png"}
              onError={(event) => { event.currentTarget.src = "/cdn/Asset 1.png"; }}
              alt={config.siteName || "Manzoma"}
              className="h-8 sm:h-9 w-auto max-w-36 object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {visibleLinks.map((link) => {
              const isCurrent = location.pathname === link.to || (link.to.includes("#") && location.hash === link.to.slice(link.to.indexOf("#")));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isCurrent
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={resolvedDark ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              {resolvedDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(isAr ? "en" : "ar")}
              className="h-9 px-2.5 rounded-xl flex items-center justify-center text-xs font-black font-mono tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
              title={isAr ? "Switch to English" : "تحويل إلى العربية"}
            >
              {isAr ? "EN" : "عربي"}
            </button>

            {/* Login Link */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 opacity-70" />
              <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
            </Link>

            {/* Primary Action Button */}
            <Link
              to="/signup"
              className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t.startFree || (isAr ? "ابدأ مجاناً" : "Get Started")}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="lg:hidden mt-2 rounded-2xl p-4 space-y-1.5 backdrop-blur-2xl bg-white/95 dark:bg-[#0B132B]/95 border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              {visibleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="h-10 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
                </Link>
                <Link
                  to="/download"
                  onClick={() => setIsOpen(false)}
                  className="h-10 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? "تحميل البرنامج" : "Download"}</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
