import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAdminStore } from "../../store/adminStore";
import { Store, Monitor, FileText, Clock } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const numericPart = target.replace(/[^0-9]/g, "");
          const end = parseInt(numericPart) || 0;
          const suffix2 = target.replace(/[0-9]/g, "");
          const duration = 1500;
          const startTime = Date.now();

          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * end);
            setDisplay(current.toLocaleString() + suffix2);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-[900] tracking-tight text-brand-navy">
      {display}
    </div>
  );
}

export default function StatsBar() {
  const { config } = useAdminStore();

  const statsData = [
    { label: "متجر نشط", value: config.stats.storesCount, icon: Store },
    { label: "جهاز كاشير", value: config.stats.terminalsCount, icon: Monitor },
    { label: "فاتورة شهرياً", value: config.stats.invoicesCount, icon: FileText },
    { label: "وقت تشغيل", value: config.stats.uptime, icon: Clock },
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-y border-brand-border/50 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center mx-auto text-brand-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <AnimatedCounter target={stat.value} />
                <p className="text-sm font-bold text-brand-muted">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
