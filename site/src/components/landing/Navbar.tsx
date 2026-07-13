import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Menu, X } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

export default function Navbar() {
  const { config } = useAdminStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dynamic pages that should appear in header
  const headerPages = (config.pages || []).filter(
    (p) => p.isPublished && p.showInHeader
  ).sort((a, b) => a.order - b.order);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-brand-border/50 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={config.iconUrl || "/cdn/logo.png"}
              alt={config.siteName}
              className="w-9 h-9 rounded-xl object-contain"
            />
            <span className="text-lg font-[900] tracking-tight text-brand-navy">
              {config.siteName || "منظومة"}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Fixed section links */}
            {config.headerLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="text-sm font-bold text-slate-500 hover:text-brand-navy transition-colors relative"
              >
                {link.label}
                {link.isNew && (
                  <span className="absolute -top-2 -left-4 text-[9px] font-[900] text-white bg-brand-emerald px-1.5 py-0.5 rounded-full">
                    جديد
                  </span>
                )}
              </a>
            ))}

            {/* Dynamic page links */}
            {headerPages.map((page) => (
              <Link
                key={page.id}
                to={`/page/${page.slug}`}
                className="text-sm font-bold text-slate-500 hover:text-brand-navy transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-bold text-slate-600 hover:text-brand-navy transition-colors">
              تسجيل الدخول
            </button>
            <button className="btn-primary px-5 py-2.5 text-sm">
              {config.hero.ctaText || "ابدأ مجاناً"}
              <ChevronLeft className="inline-block w-4 h-4 mr-1 opacity-70" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-brand-navy/5 text-brand-navy"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-80 bg-white md:hidden shadow-2xl"
              dir="rtl"
            >
              <div className="flex items-center justify-between p-6 border-b border-brand-border">
                <span className="font-[900] text-brand-navy text-lg">
                  {config.siteName}
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-brand-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-2">
                {/* Fixed links */}
                {config.headerLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 rounded-2xl text-sm font-bold text-brand-navy hover:bg-brand-primary/5 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Dynamic page links */}
                {headerPages.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-brand-border/50">
                    {headerPages.map((page) => (
                      <Link
                        key={page.id}
                        to={`/page/${page.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3.5 rounded-2xl text-sm font-bold text-brand-navy hover:bg-brand-primary/5 transition-colors"
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="pt-6 space-y-3">
                  <button className="w-full btn-primary px-6 py-3.5 text-sm">
                    {config.hero.ctaText}
                  </button>
                  <button className="w-full btn-outline px-6 py-3.5 text-sm">
                    تسجيل الدخول
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
