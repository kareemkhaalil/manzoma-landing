import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  initials: string;
  rating?: number;
  metric?: string;
  metricLabel?: string;
  avatarColor?: string;
}

interface TestimonialsSwiperProps {
  isAr?: boolean;
}

const CARD_WIDTH = 380;
const CARD_GAP = 24;
const SLIDE_SIZE = CARD_WIDTH + CARD_GAP;

export default function TestimonialsSwiper({ isAr = true }: TestimonialsSwiperProps) {
  const { language } = useAdminStore();
  const isArLang = isAr || language === "ar";

  const testimonials: Testimonial[] = isArLang
    ? [
        {
          quote: "منظومة حل لنا مشكلة انقطاع الإنترنت تماماً. كنا نتوقف عن البيع لساعات، الآن كاشير الملابس يعمل أوفلاين ويتم إرسال الفواتير فوراً على الواتساب.",
          author: "م. أحمد الشناوي",
          role: "مالك محلات الرائد للأزياء",
          initials: "أش",
          rating: 5,
          metric: "0",
          metricLabel: "ساعة توقف شهرياً",
          avatarColor: "from-indigo-500 to-blue-600",
        },
        {
          quote: "تقارير الـ Z-Report والعد الأعمى حمت أرباحنا. أصبحت مراجعة الخزينة اليومية مسألة دقائق ومضمونة دون أي عجز مالي.",
          author: "أ. محمود الكردي",
          role: "مدير سلسلة أسواق النخبة",
          initials: "مك",
          rating: 5,
          metric: "+38%",
          metricLabel: "زيادة في صافي الأرباح",
          avatarColor: "from-emerald-500 to-teal-600",
        },
        {
          quote: "التكويد الآلي للمقاسات والألوان وفّر علينا أكثر من 4 ساعات يومياً في الإدخال اليدوي. الباركود بيتطبع لوحده في ثواني.",
          author: "أ. سارة عبد الرحمن",
          role: "مديرة ورشة إنتاج ملابس رياضية",
          initials: "سع",
          rating: 5,
          metric: "4h",
          metricLabel: "توفير يومي في العمل",
          avatarColor: "from-rose-500 to-pink-600",
        },
        {
          quote: "ميزة المزامنة الهجينة جعلت إدارة 3 فروع سهلة جداً. كل فرع عنده قاعدة بيانات محلية وبترفع على الكلاود لوحدها.",
          author: "م. طارق منصور",
          role: "صاحب سلسلة مخابز الأصالة",
          initials: "طم",
          rating: 5,
          metric: "3",
          metricLabel: "فروع متزامنة بالكامل",
          avatarColor: "from-amber-500 to-orange-600",
        },
        {
          quote: "دعم العملاء ممتاز، وأي مشكلة بتتحل في نفس اليوم. الواجهة بسيطة وكاشيرياتنا اتعلموا النظام في يومين بس.",
          author: "أ. نادية فاروق",
          role: "مديرة سوبرماركت هايبر فريش",
          initials: "نف",
          rating: 5,
          metric: "2",
          metricLabel: "يوم لتعلم النظام",
          avatarColor: "from-purple-500 to-violet-600",
        },
      ]
    : [
        {
          quote: "Manzoma solved our internet outage problems completely. Our cashier keeps selling offline and receipts go straight to the client's WhatsApp.",
          author: "Ahmed El-Shanawi",
          role: "Owner, Al-Raid Textiles",
          initials: "AE",
          rating: 5,
          metric: "0",
          metricLabel: "Downtime hours/month",
          avatarColor: "from-indigo-500 to-blue-600",
        },
        {
          quote: "Shift audits and Z-reports protected our store profits. Daily cash checks take minutes now — zero register leaks since we switched.",
          author: "Mahmoud El-Kurdi",
          role: "Manager, Al-Nokhba Markets",
          initials: "MK",
          rating: 5,
          metric: "+38%",
          metricLabel: "Net profit increase",
          avatarColor: "from-emerald-500 to-teal-600",
        },
        {
          quote: "The auto matrix coding for sizes and colors saves us 4+ hours daily. Barcodes print themselves in seconds — it's magic.",
          author: "Sara Abd El-Rahman",
          role: "Manager, Sports Fashion Workshop",
          initials: "SA",
          rating: 5,
          metric: "4h",
          metricLabel: "Saved daily",
          avatarColor: "from-rose-500 to-pink-600",
        },
        {
          quote: "Hybrid sync made managing 3 branches trivial. Each branch has its own local DB and syncs to the cloud automatically.",
          author: "Tarek Mansour",
          role: "Owner, Al-Asala Bakeries",
          initials: "TM",
          rating: 5,
          metric: "3",
          metricLabel: "Fully synced branches",
          avatarColor: "from-amber-500 to-orange-600",
        },
      ];

  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(true);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = testimonials.length;

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 4500);
  }, [count]);

  const stopAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = null;
  }, []);

  useEffect(() => {
    if (autoPlaying) startAuto();
    return () => stopAuto();
  }, [autoPlaying, startAuto, stopAuto]);

  const goTo = (idx: number) => {
    setCurrent((idx + count) % count);
    setAutoPlaying(false);
    setTimeout(() => setAutoPlaying(true), 6000);
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  // Drag handlers
  const handleDragStart = (e: React.PointerEvent) => {
    setDragging(true);
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
  };
  const handleDragMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    dragDelta.current = e.clientX - dragStartX.current;
  };
  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = 60;
    if (dragDelta.current < -threshold) next();
    else if (dragDelta.current > threshold) prev();
    dragDelta.current = 0;
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      dir={isArLang ? "rtl" : "ltr"}
    >
      {/* Depth fade edges */}
      <div className="absolute top-0 bottom-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--bg-page, #FAFBFD), transparent)" }} />
      <div className="absolute top-0 bottom-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--bg-page, #FAFBFD), transparent)" }} />

      {/* Track */}
      <div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <div className="flex items-center justify-center gap-6 py-6 px-4">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const idx = (current + offset + count * 5) % count;
              const t = testimonials[idx];
              const isActive = offset === 0;
              const isNear = Math.abs(offset) === 1;
              const isFar = Math.abs(offset) === 2;

              return (
                <motion.div
                  key={`${idx}-${offset}`}
                  className="testimonial-card flex-shrink-0 p-7 space-y-5 relative overflow-hidden"
                  style={{
                    width: isActive ? 400 : isNear ? 340 : 260,
                    minHeight: isActive ? 260 : 220,
                  }}
                  animate={{
                    scale: isActive ? 1 : isNear ? 0.92 : 0.82,
                    opacity: isActive ? 1 : isNear ? 0.65 : 0.35,
                    filter: isActive ? "blur(0px)" : isNear ? "blur(1px)" : "blur(3px)",
                    zIndex: isActive ? 10 : isNear ? 5 : 1,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => !isActive && goTo(idx)}
                >
                  {/* Subtle top-right glow when active */}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
                  )}

                  {/* Quote mark */}
                  <div className="absolute top-5 left-5 rtl:left-auto rtl:right-5 opacity-[0.07]">
                    <Quote className="w-10 h-10 text-indigo-600" strokeWidth={3} />
                  </div>

                  {/* Stars + Metric pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    {isActive && t.metric && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-end rtl:items-start"
                      >
                        <span className="text-lg font-black text-[#1F41AD] leading-none">{t.metric}</span>
                        <span className="text-[9px] font-bold text-slate-400 leading-tight">{t.metricLabel}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Quote text */}
                  <p className={`text-slate-600 dark:text-slate-300 font-bold leading-relaxed ${isActive ? "text-sm" : "text-xs"} line-clamp-4`}>
                    «{t.quote}»
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center font-black text-white text-xs shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">{t.author}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Prev */}
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-500 hover:text-[#1F41AD] hover:border-[#1F41AD] dark:hover:border-indigo-500 transition-all flex items-center justify-center shadow-sm cursor-pointer"
        >
          {isArLang ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Dot pagination */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="cursor-pointer transition-all duration-300"
            >
              <motion.div
                animate={{
                  width: i === current ? 24 : 6,
                  backgroundColor: i === current ? "#1F41AD" : "#CBD5E1",
                }}
                className="h-1.5 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-500 hover:text-[#1F41AD] hover:border-[#1F41AD] dark:hover:border-indigo-500 transition-all flex items-center justify-center shadow-sm cursor-pointer"
        >
          {isArLang ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4 max-w-xs mx-auto h-0.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          key={current}
          className="h-full bg-[#1F41AD] rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: autoPlaying ? 1 : 0 }}
          transition={{ duration: 4.5, ease: "linear" }}
        />
      </div>
    </div>
  );
}
