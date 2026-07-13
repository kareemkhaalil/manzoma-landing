import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

export default function Hero() {
  const { config } = useAdminStore();

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-32 flex flex-col items-center justify-center overflow-hidden bg-brand-bg min-h-[90vh]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      {/* Glowing Orb */}
      {config.designTokens.primaryGlow && (
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-full max-w-[1000px] rounded-full opacity-[0.08] blur-[150px] pointer-events-none"
          style={{ backgroundColor: config.primaryColor || "#3B5BFF" }}
        />
      )}

      {/* Brand Pattern */}
      {config.patternUrl && config.designTokens.showMeshBackground && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url(${config.patternUrl})`,
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
      )}

      {/* === FLOATING DECORATIVE SHAPES === */}
      {/* Top-right circle */}
      <div className="absolute top-20 right-[10%] w-20 h-20 rounded-full border-2 border-brand-primary/10 animate-float-slow pointer-events-none" />
      {/* Top-left dots */}
      <div className="absolute top-32 left-[8%] w-3 h-3 rounded-full bg-brand-emerald/20 animate-float-medium pointer-events-none" />
      <div className="absolute top-44 left-[12%] w-2 h-2 rounded-full bg-brand-primary/20 animate-float-fast pointer-events-none" />
      {/* Mid-right diamond */}
      <motion.div
        className="absolute top-1/3 right-[5%] w-10 h-10 border-2 border-brand-primary/8 rotate-45 animate-float-medium pointer-events-none hidden md:block"
        animate={{ rotate: [45, 90, 45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom-left large ring */}
      <div className="absolute bottom-20 left-[5%] w-32 h-32 rounded-full border border-brand-primary/5 animate-spin-slow pointer-events-none hidden md:block" />
      {/* Mid-left small ring */}
      <div className="absolute top-1/2 left-[15%] w-6 h-6 rounded-full bg-brand-amber/10 animate-pulse-glow pointer-events-none" />
      {/* Bottom-right triangle dots */}
      <div className="absolute bottom-32 right-[12%] w-4 h-4 rounded-full bg-brand-emerald/15 animate-float-fast pointer-events-none hidden md:block" />
      <div className="absolute bottom-40 right-[15%] w-2 h-2 rounded-full bg-brand-primary/15 animate-float-slow pointer-events-none hidden md:block" />

      {/* Diagonal accent line */}
      <div className="absolute top-0 right-0 w-[200px] h-[2px] bg-gradient-to-l from-brand-primary/20 to-transparent transform rotate-[-30deg] origin-top-right pointer-events-none hidden md:block" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[2px] bg-gradient-to-r from-brand-emerald/15 to-transparent transform rotate-[-30deg] origin-bottom-left pointer-events-none hidden md:block" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-brand-border shadow-sm mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
          <span className="text-xs font-bold text-slate-600">
            {config.hero.badgeText || "تحديث جديد: فواتير الواتساب أصبحت متاحة"}
          </span>
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tighter text-brand-navy leading-[1.1] mb-6"
        >
          {config.hero.titleLine1} <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: config.designTokens?.heroGradient || "linear-gradient(135deg, #0D1B4A, #3B5BFF)",
            }}
          >
            {config.hero.titleLine2}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-brand-muted font-medium max-w-2xl text-center leading-relaxed mb-10"
        >
          {config.hero.subtitle}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button className="btn-primary px-7 py-3.5 text-base flex items-center justify-center gap-2">
            {config.hero.ctaText}
            <ChevronLeft className="w-4 h-4 opacity-70" />
          </button>
          <button className="btn-outline px-7 py-3.5 text-base flex items-center justify-center gap-2">
            {config.hero.ctaSecondaryText || "تواصل مع المبيعات"}
          </button>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", damping: 20 }}
          className="mt-16 md:mt-20 w-full max-w-5xl relative"
        >
          <div className="absolute -inset-4 rounded-3xl opacity-15 blur-2xl bg-brand-primary pointer-events-none" />
          <div className="relative rounded-2xl border border-brand-border bg-white shadow-premium-xl p-1.5 sm:p-2">
            <div className="rounded-xl overflow-hidden bg-slate-50 border border-brand-border/50 aspect-video relative">
              <img
                src={config.hero.mockupImage || "/cdn/logo.png"}
                alt="لوحة تحكم منظومة"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
