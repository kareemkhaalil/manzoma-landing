import React from "react";
import { motion } from "framer-motion";
import {
  WifiOff, MessageCircle, Shirt, ShieldCheck, Layers, QrCode, TrendingUp,
  CreditCard, Store, Cloud, BarChart3, Globe
} from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

const iconMap: Record<string, React.ComponentType<any>> = {
  WifiOff, MessageCircle, Shirt, ShieldCheck, Layers, QrCode, TrendingUp,
  CreditCard, Store, Cloud, BarChart3, Globe,
};

export default function Features() {
  const { config } = useAdminStore();
  const features = config.features;

  return (
    <section id="features" className="py-24 md:py-32 bg-white relative z-10 overflow-hidden">
      {/* Decorative dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-40" />

      {/* Floating decorative shapes */}
      <div className="absolute top-20 left-[5%] w-16 h-16 rounded-full border border-brand-primary/8 animate-float-slow pointer-events-none hidden md:block" />
      <div className="absolute bottom-20 right-[8%] w-24 h-24 rounded-full border border-brand-emerald/8 animate-float-medium pointer-events-none hidden md:block" />
      <div className="absolute top-1/2 right-[3%] w-4 h-4 rounded-full bg-brand-primary/10 animate-pulse-glow pointer-events-none hidden md:block" />

      {/* Diagonal accent line */}
      <div className="absolute top-0 left-0 w-[400px] h-[1px] bg-gradient-to-r from-brand-primary/10 to-transparent transform rotate-[15deg] origin-top-left pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 md:mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            مميزات حصرية
          </span>
          <h2 className="text-3xl md:text-5xl font-[900] text-brand-navy tracking-tight mb-4">
            بنية تحتية مصممة{" "}
            <span className="text-gradient">للسرعة والأمان.</span>
          </h2>
          <p className="text-base md:text-lg text-brand-muted font-medium max-w-2xl mx-auto">
            كل أداة في "منظومة" تم هندستها بعناية لتقليل الأخطاء البشرية وتسريع دورة المبيعات في متاجرك.
          </p>
        </motion.div>

        {/* Features Grid — first 2 cards are large, rest are 3-col */}
        <div className="space-y-5">
          {/* Top row — 2 hero features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.slice(0, 2).map((feat, idx) => {
              const Icon = iconMap[feat.iconName] || Layers;
              return (
                <motion.div
                  key={feat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, type: "spring", damping: 20 }}
                  className="feature-card-accent card-glow p-8 md:p-10 rounded-3xl bg-brand-bg/60 border border-brand-border/60 hover:bg-white hover:border-brand-primary/20 transition-all duration-400 group cursor-default"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border shadow-sm flex items-center justify-center mb-6 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-[900] text-brand-navy mb-3 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-sm md:text-base text-brand-muted font-medium leading-relaxed">
                    {feat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom grid — 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.slice(2).map((feat, idx) => {
              const Icon = iconMap[feat.iconName] || Layers;
              return (
                <motion.div
                  key={feat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx + 2) * 0.06, type: "spring", damping: 20 }}
                  className="feature-card-accent card-glow p-7 md:p-8 rounded-3xl bg-brand-bg/60 border border-brand-border/60 hover:bg-white hover:border-brand-primary/20 transition-all duration-400 group cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-brand-border shadow-sm flex items-center justify-center mb-5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-[900] text-brand-navy mb-2.5 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-brand-muted font-medium leading-relaxed">
                    {feat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
