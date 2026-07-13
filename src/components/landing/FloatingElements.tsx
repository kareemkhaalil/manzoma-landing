import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WifiOff, MessageCircle, BarChart3, ShieldCheck, Zap } from "lucide-react";

interface FloatingElementsProps {
  variant: "hero" | "global";
}

export default function FloatingElements({ variant }: FloatingElementsProps) {
  // Use a stable random seed mechanism so Hydration doesn't fail, 
  // or just hardcode some nice aesthetic positions.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const FloatingCard = ({ children, delay, className, yOffset = 15, duration = 4 }: any) => (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -yOffset, 0] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={`absolute pointer-events-none z-10 ${className}`}
    >
      {children}
    </motion.div>
  );

  if (variant === "hero") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        {/* WhatsApp Notification */}
        <FloatingCard delay={0} yOffset={20} duration={5} className="top-[20%] right-[10%]">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <p className="text-sm font-[900] text-brand-navy leading-none mb-1">فاتورة واتساب</p>
              <p className="text-xs font-bold text-brand-muted">تم إرسالها للعميل ✅</p>
            </div>
          </div>
        </FloatingCard>

        {/* Offline Sync */}
        <FloatingCard delay={1.5} yOffset={15} duration={4.5} className="bottom-[30%] left-[8%]">
          <div className="bg-brand-navy/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-[900] text-white leading-none mb-1">Offline-First</p>
              <p className="text-xs font-bold text-white/70">يعمل بدون إنترنت</p>
            </div>
          </div>
        </FloatingCard>

        {/* Sales Tag */}
        <FloatingCard delay={0.8} yOffset={25} duration={6} className="top-[35%] left-[15%]">
          <div className="bg-white/90 backdrop-blur-md shadow-premium border border-white/50 rounded-full px-5 py-2.5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-primary fill-brand-primary" />
            <span className="font-[900] text-brand-navy text-sm">+20% زيادة مبيعات</span>
          </div>
        </FloatingCard>

        {/* Z-Report */}
        <FloatingCard delay={2.2} yOffset={10} duration={4} className="bottom-[25%] right-[12%]">
          <div className="bg-gradient-to-br from-brand-primary to-blue-600 shadow-brand-glow border border-white/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-[900] text-white leading-none mb-1">Z-Report</p>
              <p className="text-[10px] font-bold text-white/80">إغلاق وردية محمي</p>
            </div>
          </div>
        </FloatingCard>
      </div>
    );
  }

  // Global Variant (sparse scattered elements)
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none hidden lg:block z-0">
      <FloatingCard delay={1} yOffset={30} duration={8} className="top-[40%] right-[3%] opacity-60">
        <div className="w-16 h-16 rounded-3xl bg-white/50 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center rotate-12">
          <BarChart3 className="w-8 h-8 text-brand-primary/50" />
        </div>
      </FloatingCard>
      
      <FloatingCard delay={3} yOffset={25} duration={7} className="top-[70%] left-[4%] opacity-50">
        <div className="w-20 h-20 rounded-full bg-brand-navy/5 backdrop-blur-sm border border-brand-navy/10 flex items-center justify-center -rotate-12">
          <ShieldCheck className="w-10 h-10 text-brand-navy/30" />
        </div>
      </FloatingCard>

      <FloatingCard delay={2} yOffset={40} duration={10} className="top-[15%] left-[2%] opacity-60">
         <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-2 flex items-center gap-2 -rotate-6">
            <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="font-bold text-brand-navy/60 text-xs">نظام حي</span>
          </div>
      </FloatingCard>
    </div>
  );
}
