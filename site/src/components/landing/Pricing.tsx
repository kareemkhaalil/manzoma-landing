import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

export default function Pricing() {
  const { packages, config } = useAdminStore();
  const [yearly, setYearly] = useState(false);
  const visiblePackages = packages.filter((p) => p.visible !== false);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-brand-bg relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-[900] text-brand-navy tracking-tight mb-4">
            خطط أسعار شفافة وعادلة.
          </h2>
          <p className="text-base md:text-lg text-brand-muted font-medium max-w-xl mx-auto mb-8">
            اختر الباقة المناسبة لحجم تجارتك. جميع الباقات تشمل فترة تجريبية مجانية {config.trialDays} يوم.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-white rounded-full border border-brand-border p-1 shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                !yearly ? "pricing-toggle-active" : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                yearly ? "pricing-toggle-active" : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              سنوي
              <span className="text-[10px] font-[900] bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded-full">
                وفّر 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className={`grid grid-cols-1 gap-6 ${visiblePackages.length === 3 ? 'lg:grid-cols-3' : visiblePackages.length === 2 ? 'lg:grid-cols-2 max-w-4xl mx-auto' : 'max-w-lg mx-auto'}`}>
          {visiblePackages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", damping: 20 }}
              className={`relative rounded-3xl p-7 md:p-8 border transition-all duration-300 ${
                pkg.isPopular
                  ? "bg-brand-navy text-white border-brand-navy shadow-premium-xl scale-[1.02]"
                  : "bg-white border-brand-border hover:border-brand-primary/30 shadow-premium hover:shadow-premium-lg"
              }`}
            >
              {/* Popular Badge */}
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-brand-emerald text-white text-[11px] font-[900] shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  الأكثر طلباً
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-[900] mb-2 ${pkg.isPopular ? "text-white" : "text-brand-navy"}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm font-medium ${pkg.isPopular ? "text-white/60" : "text-brand-muted"}`}>
                  {pkg.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl md:text-5xl font-[900] tracking-tight ${pkg.isPopular ? "text-white" : "text-brand-navy"}`}>
                    {yearly && pkg.yearlyPrice ? pkg.yearlyPrice : pkg.price}
                  </span>
                  <span className={`text-sm font-bold ${pkg.isPopular ? "text-white/50" : "text-brand-muted"}`}>
                    {pkg.priceSuffix}
                  </span>
                </div>
              </div>

              <button
                className={`w-full py-3.5 rounded-full text-sm font-[800] transition-all duration-300 mb-6 ${
                  pkg.isPopular
                    ? "bg-white text-brand-navy hover:bg-brand-bg shadow-lg"
                    : "bg-brand-primary text-white hover:shadow-brand-glow"
                }`}
              >
                ابدأ تجربة مجانية
              </button>

              <div className="space-y-3">
                {pkg.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      pkg.isPopular ? "bg-brand-emerald/20 text-brand-emerald-light" : "bg-brand-emerald/10 text-brand-emerald"
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={`text-sm font-medium ${pkg.isPopular ? "text-white/80" : "text-slate-600"}`}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
