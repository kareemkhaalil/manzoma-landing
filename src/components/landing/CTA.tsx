import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../store/adminStore";

export default function CTA() {
  const { config } = useAdminStore();

  return (
    <section className="py-24 md:py-32 text-center relative overflow-hidden bg-brand-navy">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,91,255,0.15)_0%,transparent_60%)] pointer-events-none" />

      {/* Brand Pattern */}
      {config.patternUrl && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url(${config.patternUrl})`,
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
          }}
        />
      )}

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] text-white tracking-tight mb-6 leading-tight">
            جاهز للسيطرة على تجارتك؟
          </h2>
          <p className="text-base md:text-lg text-white/50 font-medium mb-10 max-w-xl mx-auto">
            انضم للشركات الرائدة التي تعتمد على منظومة يومياً.
            <br />
            إعداد النظام يستغرق أقل من 5 دقائق.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-brand-navy px-8 py-4 rounded-full text-sm font-[900] hover:bg-brand-bg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 inline-flex items-center justify-center gap-2">
              ابدأ إنشاء حسابك الآن
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </Link>
            <a href="https://app.manzoma.online" target="_blank" rel="noopener noreferrer" className="border border-white/20 text-white/80 px-8 py-4 rounded-full text-sm font-[800] hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
              تسجيل الدخول للنظام
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
