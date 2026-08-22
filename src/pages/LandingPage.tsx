import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Globe,
  Lock,
  DollarSign,
  TrendingUp,
  CreditCard,
  Send,
  Plus,
  Briefcase,
  Store,
  Shirt,
  Home,
  User,
  Building,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Zap,
  Star,
  Wifi,
  WifiOff,
  ShoppingBag,
  Package,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Play,
  RotateCcw,
  Receipt,
  Printer,
  Calculator,
  MessageSquare
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";
import { useSchema } from "../hooks/useSchema";
import Navbar from "../components/landing/Navbar";
import MarqueeTape from "../components/landing/MarqueeTape";
import TestimonialsSwiper from "../components/landing/TestimonialsSwiper";

// High-performance spring animation easing
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

export default function LandingPage() {
  const store = useAdminStore() || {};
  const config = store.config || {};
  const packages = store.packages || [];
  const language = store.language || "ar";
  const isDark = store.theme === "dark";
  const setTheme = store.setTheme;

  const langKey = language === "en" ? "en" : "ar";
  const t = translations[langKey] || translations["ar"];
  const isAr = langKey === "ar";

  // SEO Meta tags loading
  useSEO({
    title: t.seoTitle || "برنامج كاشير ومخازن للمحلات | يعمل بدون إنترنت | منظومة",
    description: t.seoDescription || "منظومة برنامج كاشير ومخازن للمحلات يساعدك على البيع وإدارة الأصناف والورديات حتى عند ضعف الإنترنت. شاهد الديمو وتعرّف على النظام.",
    canonical: "https://manzoma.online/",
    image: "https://manzoma.online/cdn/Asset%201.png",
  });

  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "منظومة",
      description: t.seoDescription,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Windows, Web",
      url: "https://manzoma.online/",
      image: "https://manzoma.online/cdn/Asset%201.png",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EGP",
        lowPrice: "199",
        highPrice: "699",
        offerCount: "3"
      },
      inLanguage: isAr ? "ar-EG" : "en"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (t.faqList || []).map((faq: any) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a
        }
      }))
    }
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "ar";
    document.documentElement.dir = language === "en" ? "ltr" : "rtl";
  }, [language]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // State values for interactive elements
  const [emailInput, setEmailInput] = useState("");
  const [ctaEmailInput, setCtaEmailInput] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [activeCompareTab, setActiveCompareTab] = useState<"excel" | "desktop" | "cloud">("excel");

  // Calculator Widget State
  const [calcBranches, setCalcBranches] = useState(3);
  const [calcInvoices, setCalcInvoices] = useState(3000);
  const [calcCashiers, setCalcCashiers] = useState(4);

  // Bento Feature 1: Live Offline Queue simulator state
  const [isOnline, setIsOnline] = useState(true);
  const [simQueue, setSimQueue] = useState<Array<{ id: string; time: string; amount: number; synced: boolean }>>([
    { id: "TX-901", time: "16:40", amount: 350.0, synced: true },
    { id: "TX-902", time: "16:42", amount: 120.0, synced: true }
  ]);
  const [simSalesCount, setSimSalesCount] = useState(128);

  const addSimSale = () => {
    const newTx = {
      id: `TX-90${simQueue.length + 3}`,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      amount: Math.floor(Math.random() * 400) + 100,
      synced: isOnline
    };
    setSimQueue((prev) => [newTx, ...prev]);
    setSimSalesCount((prev) => prev + 1);
  };

  // Sync queue simulation when toggling back online
  useEffect(() => {
    if (isOnline) {
      setSimQueue((prev) => prev.map((tx) => ({ ...tx, synced: true })));
    }
  }, [isOnline]);

  // Viewport Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const targets = document.querySelectorAll(".blur-reveal");
    targets.forEach((t) => observer.observe(t));

    return () => {
      targets.forEach((t) => observer.unobserve(t));
    };
  }, [config, packages, language]);

  // Bento Feature 2: WhatsApp Receipt Simulator state
  const [clientPhone, setClientPhone] = useState(isAr ? "01099600048" : "201099600048");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [chatLogs, setChatLogs] = useState<Array<{ sender: "bot" | "user"; text: string; time: string }>>([]);

  const handleSendReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone.trim()) return;
    setSendingReceipt(true);
    setTimeout(() => {
      setSendingReceipt(false);
      setSendSuccess(true);
      const now = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
      setChatLogs((prev) => [
        ...prev,
        {
          sender: "bot",
          text: isAr
            ? `📄 شكراً لتسوقك معنا! إليك فاتورة مشترياتك رقم INV-2026-088 بقيمة 330.00 ج.م. اضغط لعرض الفاتورة التفاعلية: system.manzoma.com/i/89`
            : `📄 Thanks for shopping! Here is your receipt INV-2026-088 for 330.00 EGP. Click to view: system.manzoma.com/i/89`,
          time: now
        }
      ]);
      setTimeout(() => setSendSuccess(false), 3000);
    }, 1200);
  };

  // Bento Feature 3: Clothing Item Matrix generator state
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L", "XL"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["Red", "Blue"]);
  const colorLabelsAr: Record<string, string> = { Red: "أحمر", Blue: "أزرق", Green: "أخضر", Black: "أسود" };

  // Bento Feature 4: Z-Report Audit Drawer Difference state
  const [drawerDeclared, setDrawerDeclared] = useState(3550);
  const [drawerActual, setDrawerActual] = useState(3550);

  // Parallax background configurations
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef });
  
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yBlob3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  const springBlob1 = useSpring(yBlob1, { stiffness: 50, damping: 25 });
  const springBlob2 = useSpring(yBlob2, { stiffness: 50, damping: 25 });
  const springBlob3 = useSpring(yBlob3, { stiffness: 50, damping: 25 });

  // Segment toggle cards structure (Fashion, Home Goods, Retail POS)
  const [activeSegment, setActiveSegment] = useState<"fashion" | "homeware" | "retail">("fashion");
  const segmentsList = [
    {
      id: "fashion" as const,
      label: isAr ? "محلات الملابس والأحذية" : "Fashion & Shoes",
      desc: isAr ? "إدارة المقاسات والألوان وطباعة الباركود" : "Sizes, colors & barcode tags",
      icon: Shirt
    },
    {
      id: "homeware" as const,
      label: isAr ? "محلات المستلزمات المنزلية" : "Home Goods",
      desc: isAr ? "متابعة آلاف الأصناف المتنوعة وضبط المخزون" : "Multi-item inventory & stock checks",
      icon: Home
    },
    {
      id: "retail" as const,
      label: isAr ? "متاجر التجزئة ذات كاشير ومخزون" : "Retail POS & Stock",
      desc: isAr ? "تسجيل المبيعات بدقة وتنظيم الورديات" : "Fast register sales & shift audits",
      icon: Store
    }
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900 dark:bg-[#0A192F] dark:text-slate-50 selection:bg-indigo-600 selection:text-white relative"
      data-page="landing"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25] dark:opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
          color: isDark ? "rgba(99, 102, 241, 0.07)" : "rgba(31, 65, 173, 0.05)"
        }}
        aria-hidden="true"
      />
      {/* ────────────────────────────────────────────────────────
         1. NAV & HERO CONTAINER (One and only one H1)
         ──────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-visible pt-20 pb-16 md:pt-28 md:pb-28 isolate">
        {/* Navbar */}
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} theme="default" />

        {/* Floating parallax backdrop shapes */}
        <motion.div
          style={{ y: springBlob1 }}
          className="absolute top-24 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#00E5FF]/20 via-[#1F41AD]/15 to-purple-500/8 dark:from-[#00E5FF]/28 dark:via-[#1F41AD]/25 dark:to-indigo-950/20 blur-[130px] pointer-events-none -z-10 animate-gradient"
        />
        <motion.div
          style={{ y: springBlob2 }}
          className="absolute top-[500px] right-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-emerald-500/15 via-[#1F41AD]/15 to-cyan-500/10 dark:from-emerald-950/25 dark:via-indigo-950/20 dark:to-[#00E5FF]/20 blur-[150px] pointer-events-none -z-10 animate-gradient"
        />
        <motion.div
          style={{ y: springBlob3 }}
          className="absolute top-[1000px] left-[5%] w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-rose-500/12 via-purple-500/12 to-indigo-500/10 dark:from-rose-950/25 dark:via-purple-950/22 dark:to-indigo-950/20 blur-[130px] pointer-events-none -z-10 animate-gradient"
        />
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/6 via-slate-50/98 to-indigo-500/6 dark:from-[#00E5FF]/10 dark:via-[#06050A] dark:to-indigo-950/25 pointer-events-none -z-20 opacity-95" />

        {/* Hero Content */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-7 text-right flex flex-col items-start"
            style={{ textAlign: isAr ? "right" : "left", alignItems: isAr ? "flex-start" : "flex-start" }}
          >
            {/* Tag Badge / Audience Qualifier */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#1F41AD] dark:text-indigo-300 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F41AD] dark:text-indigo-400 shrink-0" />
              <span>{t.heroBadge}</span>
            </motion.div>

            {/* Exactly One H1 */}
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-5xl lg:text-[3.8rem] font-black leading-[1.15] text-slate-900 dark:text-white tracking-tight"
            >
              {t.heroHeadlinePart1}
              <br />
              <span className="text-shimmer">
                {t.heroHeadlinePart2}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* CTAs: Primary Demo, Secondary WhatsApp, and Signup */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-3 pt-2 w-full"
            >
              <a
                href="#how-it-works"
                className="bg-[#1F41AD] hover:bg-indigo-700 text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{t.heroCTADemo}</span>
              </a>

              <a
                href="https://wa.me/201099600048"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-[#0D0C14] hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>{t.heroCTAContact}</span>
              </a>

              <Link
                to="/signup"
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition-colors"
              >
                {t.heroCTAStart} ←
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-xs font-bold text-slate-500 dark:text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.heroTrust1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.heroTrust2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.heroTrust3}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual Mockups */}
          <div className="lg:col-span-5 relative min-h-[440px] w-full flex items-center justify-center perspective-2000">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

            {/* Mockup Card 1: Shift Audit */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 40 : -40, y: -20, rotateZ: -6 }}
              animate={{ opacity: 0.95, x: 0, y: 0, rotateZ: -4 }}
              transition={{ duration: 1.2, ease }}
              className="absolute top-0 left-0 lg:-left-10 z-10 w-full max-w-[280px]"
            >
              <div className="w-full rounded-3xl p-6 glass-card border border-indigo-100/40 dark:border-indigo-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-slate-800 dark:text-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isAr ? "الوردية نشطة" : "Active Shift"}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? "سجل الوردية" : "Shift Log"}</div>
                  <div className="text-sm font-black text-slate-800 dark:text-white">{isAr ? "وردية 1 | كاشير رئيسي" : "Shift 1 | Main Register"}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">{isAr ? "المستخدم:" : "User:"}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? "كاشير المحل" : "Store Cashier"}</span>
                </div>
              </div>
            </motion.div>

            {/* Mockup Card 2: Main Sales Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.15, ease }}
              className="absolute z-25 w-full max-w-[320px]"
            >
              <div className="w-full rounded-3xl p-6 glass-dark border border-slate-850/80 text-white space-y-5 shadow-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? "إجمالي مبيعات اليوم" : "Today's Revenue"}</span>
                    <span className="text-2xl font-black font-sans tracking-tight">3,050.00 <span className="text-xs text-slate-400">ج.م</span></span>
                  </div>
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                </div>

                <div className="h-12 flex items-end gap-1.5">
                  {[35, 60, 48, 75, 50, 90, 65, 80, 100, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-800 rounded-t-md h-full relative overflow-hidden">
                      <div style={{ height: `${h}%` }} className="absolute bottom-0 inset-x-0 bg-indigo-500" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] pt-1 text-slate-400 font-bold">
                  <span>{isAr ? "حالة المزامنة" : "Sync Status"}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {isAr ? "البيانات محفوظة محلياً" : "Stored locally"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Mockup Card 3: WhatsApp Digital Receipts */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? -40 : 40, y: 20, scale: 0.85, rotateZ: 5 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateZ: 4 }}
              transition={{ duration: 1.4, delay: 0.3, ease }}
              className="absolute bottom-0 right-0 lg:-right-10 z-30 w-full max-w-[260px]"
            >
              <div className="w-full rounded-3xl p-5 bg-white dark:bg-[#0D0C14] border border-slate-150 dark:border-slate-850 shadow-xl text-slate-850 dark:text-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    {isAr ? "فواتير الواتساب" : "WhatsApp Receipt"}
                  </span>
                  <span className="text-[10px] text-slate-400">الآن</span>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? "قميص كاجوال رجالي" : "Casual Shirt"}</span>
                    <span className="text-[#1F41AD] dark:text-indigo-400 font-black">💬 {isAr ? "تم الإرسال" : "Sent"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
         2. PARTNERS & PAYMENT METHODS (Clean Disclaimer)
         ──────────────────────────────────────────────────────── */}
      <section className="py-10 bg-white dark:bg-[#0A192F]/60 border-y border-slate-100 dark:border-slate-800 overflow-hidden blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-extrabold">
            {isAr ? "وسائل دفع يمكن تسجيلها وإدارتها داخل النظام" : "Payment methods managed within the system"}
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-10 opacity-70">
            {[
              "فودافون كاش",
              "فوري",
              "أمان",
              "ميزة",
              "فيزا / ماستركارد",
              "نقدي (كاش)"
            ].map((partner, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300 hover:text-[#1F41AD] transition-colors cursor-default"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         2.5 MARQUEE RIBBONS
         ──────────────────────────────────────────────────────── */}
      <MarqueeTape />

      {/* ────────────────────────────────────────────────────────
         3. “لماذا منظومة؟” — 3 CONCRETE OUTCOMES
         ──────────────────────────────────────────────────────── */}
      <section id="why" className="py-12 md:py-20 max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-12 blur-reveal">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
            {isAr ? "نتائج عملية" : "Key Outcomes"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.whyTitle}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.whySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(t.whyOutcomes || []).map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-[2rem] border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-[#1F41AD] dark:text-indigo-400 flex items-center justify-center font-black text-lg font-mono">
                0{idx + 1}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         4. “هل يناسب نشاطك؟” — TARGET FIT
         ──────────────────────────────────────────────────────── */}
      <section id="target-fit" className="py-12 md:py-20 max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-10 blur-reveal">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
            {isAr ? "الأنشطة المناسبة" : "Targeted Fit"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.fitTitle}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.fitSubtitle}
          </p>
        </div>

        {/* 3 Interactive Segment Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segmentsList.map((seg) => {
            const Icon = seg.icon;
            const isSelected = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => setActiveSegment(seg.id)}
                className={`p-6 rounded-[2rem] border text-right transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "bg-white dark:bg-[#0D0C14] border-[#1F41AD] shadow-lg ring-2 ring-[#1F41AD]/20"
                    : "bg-white/60 dark:bg-white/[0.02] border-slate-150 dark:border-slate-800 hover:bg-white dark:hover:bg-[#0D0C14]"
                }`}
                dir={isAr ? "rtl" : "ltr"}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#1F41AD] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-[#1F41AD] font-black px-2.5 py-1 rounded-full">
                      {isAr ? "نشط" : "Selected"}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {seg.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {seg.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Segment Detail Card */}
        <div className="p-8 md:p-10 border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] rounded-[2.5rem] shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {activeSegment === "fashion" && (isAr ? "محلات الملابس والأحذية" : "Fashion & Shoes Retail")}
                    {activeSegment === "homeware" && (isAr ? "محلات المستلزمات المنزلية" : "Home Goods & Kitchenware")}
                    {activeSegment === "retail" && (isAr ? "متاجر التجزئة ذات كاشير ومخزون" : "Retail Stores with POS & Stock")}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                    {activeSegment === "fashion" && (isAr ? "إدارة مرنة للمقاسات والألوان وطباعة الباركود للموديلات المختلفة، مع بيع سريع وسجل منظم للمرتجعات." : "Easy size and color coding with instant barcode labels printing.")}
                    {activeSegment === "homeware" && (isAr ? "تنظيم آلاف الأصناف بالباركود أو الاسم، ومتابعة حركات الوارد والمنصرف والجرد وتنبيهات نواقص الأصناف." : "Keep track of diverse home inventory and reorder alerts.")}
                    {activeSegment === "retail" && (isAr ? "بيع سريع وموثوق من الكاشير حتى بدون إنترنت، وتسجيل الخصومات باسم الكاشير، وضبط الوردية والخزينة." : "Fast local checkout, cashier-attributed discounts, and shift reconciliation.")}
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {(activeSegment === "fashion"
                    ? [isAr ? "تكويد سريع بالمقاس واللون" : "Fast sizing & color coding", isAr ? "طباعة ملصقات الباركود بضغطة زر" : "One-click barcode printing", isAr ? "مرتجعات منظمة برقم الفاتورة" : "Organized receipt-backed returns"]
                    : activeSegment === "homeware"
                    ? [isAr ? "بحث سريع بالباركود أو الاسم" : "Instant barcode or name search", isAr ? "تنبيهات عند اقتراب نفاد الصنف" : "Stock shortage alerts", isAr ? "جرد ومطابقة المخزون الفعلي" : "Physical stock matching"]
                    : [isAr ? "البيع محلياً بدون توقف عند انقطاع النت" : "Offline cashier sales", isAr ? "تسجيل الخصومات باسم الكاشير" : "Cashier-attributed discounts", isAr ? "تقارير واضحة للوردية والخزينة" : "Clear shift and drawer reports"]
                  ).map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="#how-it-works"
                    className="h-11 px-6 bg-[#1F41AD] hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md transition-all"
                  >
                    {t.heroCTADemo}
                  </a>
                  <a
                    href="https://wa.me/201099600048"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  >
                    {t.heroCTAContact}
                  </a>
                </div>
              </div>

              {/* Visual Mockup Box for active segment */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[380px] rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/70 dark:bg-white/[0.02] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
                    <span className="font-black text-slate-800 dark:text-white">
                      {activeSegment === "fashion" && (isAr ? "كاشير الملابس والأحذية" : "Fashion POS")}
                      {activeSegment === "homeware" && (isAr ? "كاشير المستلزمات المنزلية" : "Home Goods POS")}
                      {activeSegment === "retail" && (isAr ? "كاشير التجزئة" : "Retail POS")}
                    </span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                      {isAr ? "يعمل محلياً" : "Offline Ready"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {activeSegment === "fashion" && (
                      <>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold block">قميص كتان رجالي (L / أزرق)</span>
                            <span className="text-[10px] text-slate-400 font-mono">BARCODE: 6221008921</span>
                          </div>
                          <span className="font-black font-mono">350.00 ج.م</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold block">بنطلون جينز كاجوال (34 / أسود)</span>
                            <span className="text-[10px] text-slate-400 font-mono">BARCODE: 6221008922</span>
                          </div>
                          <span className="font-black font-mono">420.00 ج.م</span>
                        </div>
                      </>
                    )}

                    {activeSegment === "homeware" && (
                      <>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold block">طقم حلل جرانيت (10 قطع)</span>
                            <span className="text-[10px] text-slate-400 font-mono">المخزون: 8 أطقم</span>
                          </div>
                          <span className="font-black font-mono">1,850.00 ج.م</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold block">طقم كاسات زجاجي (6 قطع)</span>
                            <span className="text-[10px] text-slate-400 font-mono">المخزون: 24 طقم</span>
                          </div>
                          <span className="font-black font-mono">220.00 ج.م</span>
                        </div>
                      </>
                    )}

                    {activeSegment === "retail" && (
                      <>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold block">فاتورة كاشير #8902</span>
                            <span className="text-[10px] text-slate-400">الكاشير: أحمد ع.</span>
                          </div>
                          <span className="font-black font-mono">280.00 ج.م</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold block">خصم مالي مسجل (10%)</span>
                            <span className="text-[10px] text-slate-400">بواسطة: كاشير 1</span>
                          </div>
                          <span className="font-black font-mono text-emerald-600">-28.00 ج.م</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      {/* ────────────────────────────────────────────────────────
         5. SHORT 3-STEP DEMO / PROOF SECTION (#how-it-works / #demo)
         ──────────────────────────────────────────────────────── */}
      <section id="demo" className="py-12 md:py-20 max-w-[1400px] mx-auto px-6 sm:px-12 space-y-12 blur-reveal">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
            {isAr ? "ديمو وخطوات العمل" : "Proof & Workflow"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.howItWorksTitle}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <TestimonialsSwiper isAr={isAr} />
      </section>

      {/* ────────────────────────────────────────────────────────
         6. INTERACTIVE CALCULATOR (With Mandatory Disclaimer)
         ──────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-white dark:bg-[#0A192F]/40 border-y border-slate-150 dark:border-slate-800 blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
              {isAr ? "حاسبة تقريبية" : "Savings Estimation"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {isAr ? "حاسبة تنظيم الورديات والوقت" : "Shift & Time Savings Calculator"}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
              {isAr ? "* تقدير تقريبي قابل للتغيير حسب إعدادات نشاطك — وليس ضماناً مالياً." : "* Approximate estimate based on typical retail setups — not a financial guarantee."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Inputs Card */}
            <div className="lg:col-span-6 rounded-[2rem] border border-slate-150 dark:border-slate-800 bg-slate-50/60 dark:bg-white/[0.02] p-8 space-y-6 flex flex-col justify-between">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {isAr ? "بيانات نشاطك التجاري" : "Your Store Setup"}
              </span>

              {/* Slider 1: Branches count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{isAr ? "عدد الفروع / المخازن:" : "Branches / Stores:"}</span>
                  <span className="text-[#1F41AD] dark:text-indigo-400 font-black text-sm">{calcBranches} {isAr ? "فروع" : "Branches"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={calcBranches}
                  onChange={(e) => setCalcBranches(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1F41AD]"
                />
              </div>

              {/* Slider 2: Monthly Invoices */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{isAr ? "الفواتير الشهرية التقريبية:" : "Estimated Monthly Invoices:"}</span>
                  <span className="text-[#1F41AD] dark:text-indigo-400 font-black text-sm">{calcInvoices.toLocaleString()} {isAr ? "فاتورة" : "Invoices"}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={calcInvoices}
                  onChange={(e) => setCalcInvoices(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1F41AD]"
                />
              </div>

              {/* Slider 3: Cashiers count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{isAr ? "طاقم الكاشيرية والمستخدمين:" : "Cashiers count:"}</span>
                  <span className="text-[#1F41AD] dark:text-indigo-400 font-black text-sm">{calcCashiers} {isAr ? "مستخدمين" : "Users"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={calcCashiers}
                  onChange={(e) => setCalcCashiers(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1F41AD]"
                />
              </div>

              <div className="pt-3 text-[10px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-200 dark:border-slate-800 leading-relaxed">
                {isAr ? "تقدير تقريبي قابل للتغيير حسب إعدادات نشاطك — وليس ضماناً مالياً." : "Estimates may vary based on business operations — not a financial guarantee."}
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-6 rounded-[2rem] border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 md:p-10 shadow-sm flex flex-col justify-between space-y-6">
              <span className="text-xs font-black text-[#1F41AD] dark:text-indigo-400 uppercase tracking-wider block">
                {isAr ? "النتائج التقديرية" : "Estimated Outcomes"}
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-150 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">{isAr ? "وقت الجرد والتقارير المسترد" : "Inventory Hours Saved"}</span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {calcBranches * calcCashiers * 5} {isAr ? "ساعة" : "Hrs"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-150 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">{isAr ? "توفير بكر الورق بفواتير الواتساب" : "Paper Costs Saved"}</span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {Math.round(calcInvoices * 0.35)} {isAr ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-indigo-900 dark:text-indigo-300 font-black block">
                    {isAr ? "تنظيم حركات الخزينة والورديات" : "Shift & Cash Drawer Audit"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {isAr ? "سجل واضح للخصومات والمبيعات اليومية" : "Clear daily audit trail for sales & discounts"}
                  </span>
                </div>
                <span className="w-10 h-10 rounded-xl bg-indigo-600/10 text-[#1F41AD] dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5" />
                </span>
              </div>

              <a
                href="#how-it-works"
                className="w-full h-11 bg-[#1F41AD] hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md transition-all"
              >
                {t.heroCTADemo}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         7. BENTO BOX FEATURES SECTION (Factual & Tested)
         ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-12 md:py-24 dark-tech-section w-full blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
              {isAr ? "مزايا النظام" : "Core Features"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {t.featuresTitle}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t.featuresSubtitle}
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Card 1: Offline-First POS (Span 7) */}
            <div className="lg:col-span-7 rounded-[2.5rem] border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 md:p-10 shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                    Offline-First
                  </span>

                  {/* Simulator Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsOnline(!isOnline)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      isOnline
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {isOnline ? (
                      <>
                        <Wifi className="w-3.5 h-3.5 animate-pulse" />
                        <span>{isAr ? "متصل بالإنترنت" : "Online"}</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5" />
                        <span>{isAr ? "غير متصل (يعمل محلياً)" : "Offline (Local mode)"}</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isAr ? "البيع يستمر محلياً عند انقطاع الإنترنت" : "Local POS Operations"}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  {isAr ? "يعمل الكاشير مباشرة على جهازك دون توقف؛ يتم حفظ المبيعات محلياً وتتم المزامنة تلقائياً عند عودة الاتصال." : "Sales continue offline on your local device and sync when the connection is restored."}
                </p>
              </div>

              {/* Simulator */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-150 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? "حالة المعاملات المسجلة" : "Transaction Queue"}</span>
                    <span className="text-sm font-black font-mono dark:text-white">
                      {simSalesCount} {isAr ? "عملية بيع" : "Transactions"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addSimSale}
                    className="bg-slate-900 dark:bg-indigo-600 text-white text-[11px] font-black px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    ➕ {isAr ? "تجربة بيع صنف" : "Simulate sale"}
                  </button>
                </div>

                <div className="space-y-2 max-h-[110px] overflow-y-auto">
                  {simQueue.map((tx) => (
                    <div key={tx.id} className="p-2.5 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${tx.synced ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{tx.id} ({tx.time})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-mono text-slate-800 dark:text-white">{tx.amount.toFixed(2)} {isAr ? "ج.م" : "EGP"}</span>
                        <span className={`text-[10px] font-black ${tx.synced ? "text-emerald-600" : "text-rose-500"}`}>
                          {tx.synced ? (isAr ? "مُزامن" : "Synced") : (isAr ? "محلي (جاهز للرفع)" : "Local")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: WhatsApp Digital Receipts (Span 5) */}
            <div className="lg:col-span-5 rounded-[2.5rem] border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                  WhatsApp Receipts
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isAr ? "فواتير الواتساب الرقمية" : "Digital WhatsApp Invoices"}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr ? "إرسال تفاصيل الفاتورة مباشرة إلى واتساب العميل عند إتمام البيع لتقليل الورق وتسهيل الرجوع إليها." : "Send instant receipts directly to your customer's WhatsApp."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-white/[0.02] p-4 space-y-3">
                <form onSubmit={handleSendReceipt} className="space-y-2 flex gap-2">
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder={isAr ? "رقم الهاتف..." : "Phone number..."}
                    className="flex-grow bg-white dark:bg-[#0D0C14] border border-slate-150 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs outline-none dark:text-white"
                    style={{ textAlign: "left" }}
                  />
                  <button
                    type="submit"
                    disabled={sendingReceipt}
                    className="bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-black hover:bg-emerald-600 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {sendingReceipt ? (isAr ? "إرسال..." : "Sending...") : (isAr ? "إرسال ⚡" : "Send ⚡")}
                  </button>
                </form>

                <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                  {chatLogs.map((log, i) => (
                    <div key={i} className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 p-2.5 rounded-xl text-[11px] text-slate-800 dark:text-emerald-300">
                      <p>{log.text}</p>
                      <span className="text-[9px] text-slate-400 block mt-1 font-mono text-left">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Sizes & Colors Matrix (Span 5) */}
            <div className="lg:col-span-5 rounded-[2.5rem] border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                  Sizes & Colors
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isAr ? "تكويد المقاسات والألوان والباركود" : "Sizes, Colors & Barcodes"}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr ? "توليد المقاسات والألوان للأصناف وطباعة ملصقات الباركود بسهولة للمحلات." : "Generate size and color variations with instant barcode labels."}
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-150 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? "اختيار المقاسات:" : "Sizes:"}</span>
                  <div className="flex flex-wrap gap-1">
                    {["S", "M", "L", "XL"].map((sz) => {
                      const isSelected = selectedSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSizes(prev => prev.includes(sz) ? prev.filter(x => x !== sz) : [...prev, sz])}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black border transition-all cursor-pointer ${
                            isSelected ? "bg-[#1F41AD] border-[#1F41AD] text-white" : "bg-white dark:bg-[#0D0C14] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? "اختيار الألوان:" : "Colors:"}</span>
                  <div className="flex flex-wrap gap-1">
                    {["Red", "Blue", "Black"].map((col) => {
                      const isSelected = selectedColors.includes(col);
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSelectedColors(prev => prev.includes(col) ? prev.filter(x => x !== col) : [...prev, col])}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black border transition-all cursor-pointer ${
                            isSelected ? "bg-slate-900 border-slate-900 text-white" : "bg-white dark:bg-[#0D0C14] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {isAr ? colorLabelsAr[col] || col : col}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2.5 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-500 dark:text-slate-400">{isAr ? "الباركود الجاهز:" : "Barcodes ready:"}</span>
                  <span className="text-[#1F41AD] font-black font-sans">
                    {selectedSizes.length * selectedColors.length} {isAr ? "ملصق باركود" : "Barcodes"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Shift Register Audit (Span 7) */}
            <div className="lg:col-span-7 rounded-[2.5rem] border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 md:p-10 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                  Shift Reconciliation
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isAr ? "ورديات الكاشير ومطابقة الخزينة" : "Cashier Shifts & Cash Reconciliation"}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  {isAr ? "تسجيل حركة النقدية ومقارنة الرصيد الفعلي بالرصيد الدفتري لتوثيق إغلاق الوردية." : "Record cashier shifts and reconcile physical cash with system ledger."}
                </p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>{isAr ? "رصيد الخزينة بالسيستم:" : "System Cash Expected:"}</span>
                    <span className="font-mono dark:text-white">{drawerDeclared.toFixed(2)} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-300">
                    <span>{isAr ? "المبلغ الفعلي بالخزنة (اسحب للتجربة):" : "Actual Cash in Drawer:"}</span>
                    <span className="font-mono text-sm text-[#1F41AD] font-black">{drawerActual.toFixed(2)} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
                  <input
                    type="range"
                    min="3200"
                    max="3600"
                    value={drawerActual}
                    onChange={(e) => setDrawerActual(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1F41AD]"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-black text-slate-700 dark:text-slate-300">{isAr ? "نتيجة المراجعة:" : "Audit Result:"}</span>
                  {drawerDeclared === drawerActual ? (
                    <span className="text-emerald-600 font-black bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isAr ? "الرصيد الفعلي مطابق للدفتري" : "Actual matches system"}
                    </span>
                  ) : drawerActual < drawerDeclared ? (
                    <span className="text-rose-500 font-black bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-md flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {isAr ? `فرق بالنقصان: ${drawerDeclared - drawerActual} ج.م` : `Shortage: ${drawerDeclared - drawerActual} EGP`}
                    </span>
                  ) : (
                    <span className="text-blue-600 font-black bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-md flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      {isAr ? `فرق بالزيادة: ${drawerActual - drawerDeclared} ج.م` : `Surplus: ${drawerActual - drawerDeclared} EGP`}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         8. DATABASE NETWORK FLOW
         ──────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-slate-50 dark:bg-[#0A192F]/40 border-y border-slate-150 dark:border-slate-800 blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
              {isAr ? "بنية النظام" : "System Architecture"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {isAr ? "مزامنة البيانات بين الأجهزة والسحابة" : "Local Database & Cloud Sync"}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "يعمل كل كاشير محلياً على قاعدة بيانات محلية، وتتم المزامنة مع السحابة عند توفر الإنترنت." : "Each register runs on a local database and syncs when online."}
            </p>
          </div>

          <div className="max-w-3xl mx-auto p-8 border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] rounded-[2.5rem] shadow-sm flex flex-col items-center space-y-6">
            <div className="bg-slate-900 text-white p-5 rounded-2xl text-center space-y-1 w-64 shadow-md">
              <span className="text-[10px] text-indigo-400 font-bold block">{isAr ? "الخادم المركزي" : "Central Cloud Server"}</span>
              <div className="text-sm font-black">PostgreSQL Main Server</div>
              <span className="text-[10px] text-emerald-400 font-bold block">{isAr ? "مزامنة البيانات عند الاتصال" : "Cloud sync ready"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-150 dark:border-slate-800 p-4 rounded-xl text-center space-y-1">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">{isAr ? "كاشير المحل (محلي)" : "Local Cashier POS"}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isAr ? "قاعدة بيانات محلية سريعة" : "Local SQLite DB"}</span>
              </div>
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-150 dark:border-slate-800 p-4 rounded-xl text-center space-y-1">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">{isAr ? "إدارة المخزن والورديات" : "Stock & Shifts"}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isAr ? "تحديث تلقائي عند الاتصال" : "Automatic update on reconnect"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         9. STRATEGIC COMPARISON MATRIX
         ──────────────────────────────────────────────────────── */}
      <section id="compare" className="py-12 md:py-20 max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-10 blur-reveal">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
            {isAr ? "مقارنة دقيقة" : "Comparison"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{t.compareTitle}</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.compareSubtitle}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {(["excel", "desktop", "cloud"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCompareTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-black border transition-all cursor-pointer ${
                activeCompareTab === tab
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-white dark:bg-[#0D0C14] border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              {t.compareTabs?.[tab] || tab}
            </button>
          ))}
        </div>

        {/* Comparison Table (Cleaned up from duplicate markup) */}
        <div className="overflow-x-auto rounded-3xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0D0C14] max-w-4xl mx-auto shadow-sm">
          <table className="w-full text-right border-collapse min-w-[640px]" dir={isAr ? "rtl" : "ltr"}>
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.02]">
                <th className={`p-4 text-xs font-black text-slate-400 uppercase ${isAr ? "text-right" : "text-left"}`}>
                  {t.compareHeaderFeature}
                </th>
                <th className={`p-4 text-xs font-black text-[#1F41AD] bg-indigo-50/40 dark:bg-indigo-950/20 uppercase ${isAr ? "text-right" : "text-left"}`}>
                  {t.compareHeaderManzoma}
                </th>
                <th className={`p-4 text-xs font-black text-slate-400 uppercase ${isAr ? "text-right" : "text-left"}`}>
                  {t.compareTabs?.[activeCompareTab] || activeCompareTab}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs sm:text-sm">
              {((activeCompareTab === "excel"
                ? t.compareRowsExcel
                : activeCompareTab === "desktop"
                ? t.compareRowsDesktop
                : t.compareRowsCloud
              ) || []).map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-bold text-slate-800 dark:text-white max-w-[200px]">{row.feature}</td>
                  <td className="p-4 font-bold text-[#1F41AD] bg-indigo-50/30 dark:bg-indigo-950/10">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-emerald-500 text-base">{row.manzomaStatus}</span>
                      <span>{row.manzoma}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-rose-400 text-base">{row.otherStatus}</span>
                      <span>{row.other}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         10. PRICING SECTION (Preserving Real Prices)
         ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-12 md:py-24 dark-tech-section w-full blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
              {isAr ? "الأسعار والباقات" : "Pricing Plans"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{t.pricingTitle}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t.pricingSubtitle}
            </p>

            {/* Monthly / Yearly Switch */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D0C14] mt-4 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  billingCycle === "monthly" ? "bg-[#1F41AD] text-white" : "text-slate-500"
                }`}
              >
                {t.monthly}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly" ? "bg-[#1F41AD] text-white" : "text-slate-500"
                }`}
              >
                <span>{t.yearly}</span>
                <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">{t.savePercent}</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {(packages && packages.length > 0 ? packages : [
              {
                id: "p1",
                name: "الباقة الأساسية",
                price: 199,
                yearlyPrice: 159,
                desc: "مناسبة للمحلات الفردية ونقاط البيع المستقلة.",
                features: ["نقطة بيع كاشير واحدة", "البيع محلياً بدون إنترنت ومزامنة البيانات", "إدارة المخزون والأصناف والباركود", "إدارة الورديات وتقارير المبيعات", "دعم فني وتحديثات مستمرة"]
              },
              {
                id: "p2",
                name: "الباقة المتقدمة",
                price: 399,
                yearlyPrice: 319,
                isPopular: true,
                desc: "للأنشطة التي تحتاج إدارة أصناف المقاسات والألوان وفواتير الواتساب.",
                features: ["حتى 3 نقاط بيع وكاشير", "تكويد المقاسات والألوان والباركود", "فواتير واتساب للعملاء", "تقارير الورديات والخصومات المفصلة", "تنبيهات نقص المخزون", "دعم فني مخصص"]
              },
              {
                id: "p3",
                name: "باقة الفروع المتعددة",
                price: 699,
                yearlyPrice: 559,
                desc: "للمتاجر ذات الفروع والمخازن المتعددة مع تقارير مركزية.",
                features: ["نقاط بيع ومخازن متعددة", "إدارة حركات التحويل بين المخازن", "تقارير مجمعة ومفصلة لكل فرع", "أذونات وصلاحيات مخصصة للمستخدمين", "دعم فني بأولوية"]
              }
            ]).map((pkg: any) => {
              const isPopular = pkg.isPopular || pkg.id === "p2";
              const displayPrice = billingCycle === "yearly" ? (pkg.yearlyPrice || Math.round(pkg.price * 0.8)) : pkg.price;
              const packageTrans = t.pricingPackages?.[pkg.id as keyof typeof t.pricingPackages];

              return (
                <div
                  key={pkg.id}
                  className={`rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                    isPopular
                      ? "bg-slate-900 text-white border-indigo-500/30 shadow-xl ring-2 ring-indigo-500/20"
                      : "bg-white dark:bg-[#0D0C14] border-slate-150 dark:border-slate-800 shadow-sm"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1F41AD] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                      {t.popularBadge}
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-xl font-black ${isPopular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                        {packageTrans?.name || pkg.name}
                      </h3>
                      <p className={`text-xs mt-1.5 font-medium ${isPopular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                        {packageTrans?.desc || pkg.desc}
                      </p>
                    </div>

                    <div className={`flex items-baseline gap-1.5 pb-6 border-b ${isPopular ? "border-slate-800" : "border-slate-100 dark:border-slate-800"}`}>
                      <span className="text-4xl font-black font-mono text-[#1F41AD] dark:text-indigo-400">
                        {displayPrice}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {billingCycle === "yearly" ? (isAr ? "ج.م / شهرياً (دفع سنوي)" : "EGP / Mo (billed annually)") : (isAr ? "ج.م / شهرياً" : "EGP / Mo")}
                      </span>
                    </div>

                    <ul className="space-y-3.5">
                      {(packageTrans?.features || pkg.features || []).map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs font-bold">
                          <Check className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span className={isPopular ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/signup"
                    className={`w-full h-11 rounded-xl font-black text-xs flex items-center justify-center transition-all duration-200 mt-8 shadow-sm cursor-pointer ${
                      isPopular
                        ? "bg-white text-slate-900 hover:bg-slate-100"
                        : "bg-[#1F41AD] text-white hover:bg-indigo-700"
                    }`}
                  >
                    {t.trialButton}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         11. FACTUAL FAQS (Accordion)
         ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-12 md:py-20 max-w-[1400px] mx-auto px-6 sm:px-12 space-y-10 blur-reveal">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.faqTitle}
          </h2>
        </div>

        <div className="space-y-3.5 max-w-3xl mx-auto">
          {(t.faqList || []).map((faq: any, i: number) => {
            const isOpen = openFAQ === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-[#0D0C14]"
              >
                <button
                  type="button"
                  id={`faq-question-${i}`}
                  onClick={() => setOpenFAQ(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className={`w-full flex items-center justify-between p-5 ${isAr ? "text-right" : "text-left"} cursor-pointer outline-none`}
                >
                  <span className="font-black text-sm text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 text-slate-400 ${
                      isOpen ? "rotate-180 text-[#1F41AD]" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease }}
                    >
                      <p className="px-5 pb-5 text-xs sm:text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         12. FINAL CTA (Demo & Contact First, Signup Second)
         ──────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12 relative overflow-visible">
        <section className="relative w-full max-w-[1400px] mx-auto rounded-[2.5rem] bg-gradient-to-b from-[#1F41AD] to-indigo-900 text-white overflow-hidden shadow-xl flex flex-col items-center py-12 md:py-16 text-center px-6 sm:px-12 border border-white/10 blur-reveal">
          <div className="w-full max-w-2xl mx-auto space-y-6 flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
              {t.finalCtaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed font-medium">
              {t.finalCtaSubtitle}
            </p>

            {/* CTAs: Demo & WhatsApp Contact First, Signup Second */}
            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <a
                href="#how-it-works"
                className="bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-black px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#1F41AD]" />
                <span>{t.finalCtaDemo || "شاهد ديمو في 60 ثانية"}</span>
              </a>

              <a
                href="https://wa.me/201099600048"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-xl transition-all active:scale-95 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>{t.finalCtaContact || "تحدث مع فريق منظومة"}</span>
              </a>
            </div>

            <div className="pt-2">
              <Link
                to="/signup"
                className="text-xs font-bold text-indigo-200 hover:text-white underline underline-offset-4 transition-colors"
              >
                {t.finalCtaSignup || "أو أنشئ حسابك التجريبي (14 يوماً مجاناً)"}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ────────────────────────────────────────────────────────
         13. FOOTER
         ──────────────────────────────────────────────────────── */}
      <footer className="py-16 px-6 sm:px-12 lg:px-16 max-w-[1400px] mx-auto border-t border-slate-200 dark:border-slate-800 relative bg-slate-50 dark:bg-[#0A192F]/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <img src={config.logoUrl || "/cdn/Asset 1.png"} alt="منظومة" className="h-8 w-auto max-w-28 object-contain" />
              <span className="font-black text-base text-slate-800 dark:text-white">
                {isAr ? "منظومة" : "Manzoma"}
              </span>
            </div>
            <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400 max-w-[24ch]">
              {t.footerDesc}
            </p>
          </div>

          {/* Links column 1 */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.footerProduct}</h3>
            <ul className="space-y-2 text-xs font-bold text-slate-650 dark:text-slate-400">
              <li><a href="#features" className="hover:text-[#1F41AD]">{t.footerProdItem1}</a></li>
              <li><a href="#features" className="hover:text-[#1F41AD]">{t.footerProdItem2}</a></li>
              <li><a href="#features" className="hover:text-[#1F41AD]">{t.footerProdItem3}</a></li>
              <li><a href="#features" className="hover:text-[#1F41AD]">{t.footerProdItem4}</a></li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.footerCompany}</h3>
            <ul className="space-y-2 text-xs font-bold text-slate-650 dark:text-slate-400">
              <li><Link to="/page/about" className="hover:text-[#1F41AD]">{t.footerCompAbout}</Link></li>
              <li><Link to="/page/contact" className="hover:text-[#1F41AD]">{t.footerCompContact}</Link></li>
              <li><Link to="/academy" className="hover:text-[#1F41AD]">{t.academy}</Link></li>
            </ul>
          </div>

          {/* Links column 3 */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.footerSupport}</h3>
            <ul className="space-y-2 text-xs font-bold text-slate-650 dark:text-slate-400">
              <li><Link to="/page/terms" className="hover:text-[#1F41AD]">{t.footerTerms}</Link></li>
              <li><Link to="/page/privacy" className="hover:text-[#1F41AD]">{t.footerPrivacy}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400 mt-12 relative z-10">
          <span>© {new Date().getFullYear()} {isAr ? "منظومة" : "Manzoma"}. {t.footerCopy}</span>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" className="hover:text-[#1F41AD]">{isAr ? "فيسبوك" : "Facebook"}</a>
            <a href="https://twitter.com" className="hover:text-[#1F41AD]">{isAr ? "تويتر" : "Twitter"}</a>
            <a href="https://instagram.com" className="hover:text-[#1F41AD]">{isAr ? "انستغرام" : "Instagram"}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
