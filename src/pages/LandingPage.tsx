import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import * as LucideIcons from "lucide-react";
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
  User,
  Building,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Zap,
  Star,
  Wifi,
  WifiOff,
  MessageSquare,
  Smartphone,
  Sparkles,
  Layers,
  Activity,
  FileText,
  Calculator,
  AlertTriangle,
  LineChart,
  Percent,
  Settings,
  HelpCircle,
  X
} from "lucide-react";

import Navbar from "../components/landing/Navbar";
import TestimonialsSwiper from "../components/landing/TestimonialsSwiper";
import MarqueeTape from "../components/landing/MarqueeTape";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";
import { useSchema } from "../hooks/useSchema";

// Helper to resolve Lucide Icon components dynamically based on iconName from store CMS
const getIconComponent = (name: string, className = "w-5 h-5") => {
  if (!name) return <HelpCircle className={className} />;
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : <HelpCircle className={className} />;
};

/* ── Framer Motion Animation Presets ─────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // Keep CMS data typed so every dashboard field remains connected to the page.
  const { config, packages, language, theme, setTheme } = useAdminStore();
  const isDark = theme === "dark";

  const langKey = language === "en" ? "en" : "ar";
  const t = translations[langKey] || translations["ar"];
  const isAr = langKey === "ar";

  // SEO Meta tags loading
  useSEO({
    title: config?.hero?.titleLine1 ? `${config.hero.titleLine1} ${config.hero.titleLine2} | ${config?.siteName || "منظومة"}` : t.seoTitle,
    description: config?.hero?.subtitle || t.seoDescription,
    keywords: t.seoKeywords,
    canonical: "https://manzoma.online/",
    image: "https://manzoma.online/cdn/Asset%201.png",
  });

  useSchema({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.siteName || "Manzoma",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows",
    url: "https://manzoma.online/",
    image: "https://manzoma.online/cdn/Asset%201.png",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EGP" },
    inLanguage: isAr ? "ar-EG" : "en",
  });

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

  // Segment toggle cards structure (Image 2 style toggle)
  const [activeSegment, setActiveSegment] = useState<"pos" | "matrix" | "wholesale">("pos");
  const segmentsList = [
    { id: "pos", label: isAr ? "نقاط البيع والتجزئة" : "Retail & POS", desc: isAr ? "إدارة مبيعات المحلات والفروع" : "Retail stores & branches sales", bg: "from-blue-500/10 to-indigo-500/10" },
    { id: "matrix", label: isAr ? "الورش والمصانع الصغيرة" : "Workshops & Manufacturing", desc: isAr ? "تتبع تكلفة التصنيع والمواد الخام" : "Product costing & materials tracking", bg: "from-emerald-500/10 to-teal-500/10" },
    { id: "wholesale", label: isAr ? "الشركات والموزعون" : "Wholesale & Distributors", desc: isAr ? "جدولة الديون وعمولات المندوبين" : "Debt tracking & sales commissions", bg: "from-rose-500/10 to-amber-500/10" }
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
         1. NAV & HERO CONTAINER (Light, Cheerful, Majestic)
         ──────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-visible pt-28 pb-32 isolate">
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
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8 text-right flex flex-col items-start"
            style={{ textAlign: isAr ? "right" : "left", alignItems: isAr ? "flex-start" : "flex-start" }}
          >
            {/* Tag Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-850 text-[#1F41AD] dark:text-indigo-400 glow-border shadow-[0_0_15px_rgba(0,229,255,0.12)]"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{config?.hero?.badgeText || t.heroBadge}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[4.2rem] font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight"
            >
              {config?.hero?.titleLine1 || t.heroHeadlinePart1}
              <br />
              <span className="text-shimmer">
                {config?.hero?.titleLine2 || t.heroHeadlinePart2}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl"
            >
              {config?.hero?.subtitle || t.heroSubtitle}
            </motion.p>

            {/* Lead email form */}
            <motion.div
              variants={fadeUp}
              className="w-full max-w-md p-1.5 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-indigo-900/5 flex items-center gap-2"
            >
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={isAr ? "أدخل البريد الإلكتروني للبدء..." : "Enter email to get started..."}
                className={`flex-grow bg-transparent px-4 py-2.5 text-sm outline-none text-slate-800 placeholder-slate-400 border-none ${
                  isAr ? "text-right" : "text-left"
                }`}
              />
              <Link
                to={`/signup?email=${encodeURIComponent(emailInput)}`}
                className="bg-[#1F41AD] hover:bg-indigo-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 whitespace-nowrap"
              >
                {config?.hero?.ctaText || t.startFree}
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-xs font-bold text-slate-500"
            >
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{t.heroTrust1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{t.heroTrust2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{t.heroTrust3}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero 3D floating visual mockups */}
          <div className="lg:col-span-5 relative min-h-[460px] w-full flex items-center justify-center perspective-2000">
            
            {/* Backdrop light glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
            
            {/* Noise texture overlay */}
            <div className="noise-overlay" />

            {/* Depth orb background (far layer) */}
            <div className="depth-orb-far w-72 h-72 bg-blue-500/10 top-0 left-0 animate-float-far" />
            <div className="depth-orb-near w-48 h-48 bg-emerald-500/10 bottom-4 right-4 animate-float-near" />

            {/* Mockup Card 1: Shift Audit / Cash register (Far / Background) */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 40 : -40, y: -20, rotateZ: -6 }}
              animate={{ opacity: 0.95, x: 0, y: 0, rotateZ: -4 }}
              transition={{ duration: 1.2, ease }}
              className="absolute top-0 left-0 lg:-left-12 z-10 w-full max-w-[280px] cursor-pointer"
            >
              <div 
                className="w-full rounded-3xl p-6 glass-card border border-indigo-100/40 dark:border-indigo-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_0_20px_rgba(99,102,241,0.05)] text-slate-800 dark:text-slate-200 space-y-4 animate-float-far hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.18)] hover:-translate-y-2 transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex justify-between items-center">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isAr ? "وردية مؤمنة" : "Register Safe"}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? "الوردية الحالية" : "Current Shift"}</div>
                  <div className="text-sm font-black text-slate-800 dark:text-white">{isAr ? "وردية 1 | كاشير رئيسي" : "Shift 1 | Main Register"}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">{isAr ? "مستخدم:" : "User:"}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-330">{isAr ? "كريم خليل" : "Kareem K."}</span>
                </div>
              </div>
            </motion.div>

            {/* Mockup Card 2: Main Sales metrics (Central card - Foreground with tilt) */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.85, rotateX: 10, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 12, rotateY: -12 }}
              transition={{ duration: 1.4, delay: 0.15, ease }}
              className="absolute z-25 w-full max-w-[330px] cursor-pointer"
            >
              <div 
                className="w-full rounded-3xl p-6 glass-dark border border-slate-850/80 sci-fi-glow text-white space-y-6 animate-float-mid hover:shadow-[0_40px_80px_-10px_rgba(0,229,255,0.35)] hover:-translate-y-3 transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* HUD pulsing points */}
                <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse z-20" />
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse z-20" />
                {/* Scan line effect overlay */}
                <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 top-0 animate-scan pointer-events-none" />

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? "إجمالي مبيعات اليوم" : "Today's Revenue"}</span>
                    <span className="text-2xl font-black font-sans tracking-tight">3,050.00 <span className="text-xs text-slate-400">ج.م</span></span>
                  </div>
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                </div>
                
                {/* Animated mini chart columns */}
                <div className="h-14 flex items-end gap-1.5">
                  {[35, 60, 48, 75, 50, 90, 65, 80, 100, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-800 rounded-t-md h-full relative overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.4 + i * 0.05 }}
                        className="absolute bottom-0 inset-x-0 bg-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] pt-1 text-slate-400 font-bold">
                  <span>{isAr ? "حالة مزامنة الفروع" : "Branch Sync Queue"}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {isAr ? "تمت المزامنة 100%" : "Synced 100%"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Mockup Card 3: WhatsApp Sent Logs (Near / Closest to Camera) */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? -40 : 40, y: 20, scale: 0.85, rotateZ: 5 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateZ: 4 }}
              transition={{ duration: 1.4, delay: 0.3, ease }}
              className="absolute bottom-0 right-0 lg:-right-12 z-30 w-full max-w-[270px] cursor-pointer"
            >
              <div 
                className="w-full rounded-3xl p-5 bg-white dark:bg-[#0D0C14] border border-slate-150 dark:border-slate-850 shadow-[0_25px_50px_rgba(0,0,0,0.08),0_0_20px_rgba(0,229,255,0.03)] text-slate-850 dark:text-slate-200 space-y-3.5 animate-float-near hover:shadow-[0_35px_70px_-15px_rgba(0,229,255,0.15)] hover:-translate-y-2 transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    {isAr ? "تقارير الواتساب" : "WhatsApp Logs"}
                  </span>
                  <span className="text-[10px] text-slate-400">2 min ago</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-350">{isAr ? "قميص كاجوال رجالي" : "Men shirt"}</span>
                    <span className="text-[#1F41AD] dark:text-indigo-400 font-black">💬 {isAr ? "تم الإرسال" : "Sent"}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-350">{isAr ? "بنطلون جينز" : "Jeans pants"}</span>
                    <span className="text-[#1F41AD] dark:text-indigo-400 font-black">💬 {isAr ? "تم الإرسال" : "Sent"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
         2. PARTNERS LOGOS BAR (Modern clean brand outline grid)
         ──────────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-slate-100 overflow-hidden blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 text-center space-y-6">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold">
            {isAr ? "طرق الدفع المدعومة وشركاء النجاح في السوق المصري" : "Supported payments & merchant networks"}
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-12 opacity-60">
            {config?.partners && config.partners.length > 0 ? (
              config.partners.map((partner: string, idx: number) => (
                <span 
                  key={idx} 
                  className="text-sm font-black text-slate-500 hover:text-[#1F41AD] transition-colors cursor-default"
                >
                  {partner}
                </span>
              ))
            ) : (
              [
                "فودافون كاش",
                "فوري",
                "أمان",
                "ميزة",
                "بنك مصر",
                "البنك الأهلي المصري",
                "فيزا / ماستركارد"
              ].map((partner, idx) => (
                <span 
                  key={idx} 
                  className="text-sm font-black text-slate-500 hover:text-[#1F41AD] transition-colors cursor-default"
                >
                  {partner}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         2.5 DIAGONAL MARQUEE RIBBONS (Tilted ribbon feature)
         ──────────────────────────────────────────────────────── */}
      <MarqueeTape />

      {/* ────────────────────────────────────────────────────────
         3. SEGMENTS INTERACTIVE WIDGET (Image 2 style layout picker)
         ──────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-12 blur-reveal">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
            {isAr ? "تغطية كاملة لنشاطك" : "Targeted Industry Fit"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
            {t.showcaseTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-bold">
            {t.showcaseSubtitle}
          </p>
        </div>

        {/* 3 Toggl        {/* Dynamic showcase based on segment */}
        <div className="relative w-full overflow-hidden p-8 md:p-12 border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0C14] rounded-[2.5rem] shadow-xl shadow-indigo-950/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              <div className="lg:col-span-6 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-[#1F41AD] flex items-center justify-center shadow-sm">
                  {activeSegment === "pos" ? <Briefcase className="w-6 h-6" /> : activeSegment === "matrix" ? <Layers className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {activeSegment === "pos" && (isAr ? "إدارة مبيعات التجزئة ونقاط الكاشير" : "Retail & POS Sales")}
                    {activeSegment === "matrix" && (isAr ? "حساب تكلفة الإنتاج وتكاليف التصنيع تلقائياً" : "Manufacturing & product costing")}
                    {activeSegment === "wholesale" && (isAr ? "متابعة ديون العملاء وعمولات البائعين" : "Customer debt tracking & sales commissions")}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {activeSegment === "pos" && t.showcaseFeatures?.pos?.desc}
                    {activeSegment === "matrix" && t.showcaseFeatures?.matrix?.desc}
                    {activeSegment === "wholesale" && t.showcaseFeatures?.shift?.desc}
                  </p>
                </div>

                <ul className="space-y-3 pt-2">
                  {(activeSegment === "pos"
                    ? [isAr ? "توليد تلقائي للباركود والملصقات" : "Instant barcode tags generation", isAr ? "دعم كامل للموازين الإلكترونية" : "Electronic weights integration", isAr ? "مراقبة الورديات عن بعد لحظة بلحظة" : "Live remote shifts monitoring"]
                    : activeSegment === "matrix"
                    ? [isAr ? "احتساب آلي لتكلفة المنتج بناءً على الخامات" : "Automated product pricing based on materials", isAr ? "تنبيهات نقص مخزون الخامات الأساسية" : "Raw material shortage alerts", isAr ? "تتبع جرد مراحل التصنيع المختلفة" : "Work-in-progress inventory tracker"]
                    : [isAr ? "متابعة حسابات الديون والعملاء الموردين" : "Vendor debt and account tracking", isAr ? "احتساب تلقائي لنسب وعمولات البائعين" : "Automated seller commission tracker", isAr ? "جدولة دفعات الموردين والأقساط" : "Installments scheduling systems"]
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 pt-4">
                  <Link to="/signup" className="h-11 px-6 bg-[#1F41AD] text-white font-black text-xs rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                    {t.startFree}
                  </Link>
                  <Link to="/page/about" className="h-11 px-5 border border-slate-100 dark:border-slate-800 text-slate-650 dark:text-slate-350 font-black text-xs rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                    {isAr ? "معرفة المزيد" : "Learn More"}
                  </Link>
                </div>
              </div>

              {/* Segment visual mockup placeholder */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-[420px] rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.02] p-6 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="font-mono text-[9px] mr-2">system.manzoma.com/dashboard</span>
                  </div>

                  {activeSegment === "pos" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-350">{isAr ? "كاشير السوبرماركت" : "Supermarket Cashier"}</span>
                        <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-[#1F41AD] px-2 py-0.5 rounded-md font-bold">POS-01</span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                          <span className="font-bold">{isAr ? "حلاوة طحينية 1ك" : "Halawa 1KG"}</span>
                          <span className="font-mono font-bold">75.00 ج.م</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                          <span className="font-bold">{isAr ? "علبة لبن طبيعي كامل الدسم" : "Whole Milk 1L"}</span>
                          <span className="font-mono font-bold">38.00 ج.م</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSegment === "matrix" && (
                    <div className="space-y-4">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-350 block">{isAr ? "قائمة خامات تصنيع (قميص كاجوال)" : "Shirt Manufacturing BOM"}</span>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span>🧵 {isAr ? "خيط تطريز (بكرة)" : "Embroidery thread"}</span>
                          <span className="text-slate-500 font-bold">0.15 {isAr ? "وحدة" : "Unit"}</span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span>🧥 {isAr ? "قماش قطن هندي (متر)" : "Indian Cotton fabric"}</span>
                          <span className="text-slate-500 font-bold">1.25 {isAr ? "متر" : "Meter"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSegment === "wholesale" && (
                    <div className="space-y-4">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-350 block">{isAr ? "مستحقات المناديب والديون" : "Reps Commissions Ledger"}</span>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span className="font-bold">{isAr ? "المندوب: أحمد الشناوي" : "Rep: Ahmed S."}</span>
                          <span className="text-emerald-600 font-black">12.5% ({isAr ? "450 ج.م" : "450 EGP"})</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span className="font-bold">{isAr ? "العميل: شركة الهلال للتجارة" : "Client: Al-Hilal Corp"}</span>
                          <span className="text-rose-500 font-black">{isAr ? "آجل: 12,300 ج.م" : "Credit: 12,300 EGP"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      {/* ────────────────────────────────────────────────────────
         4. BENTO BOX FEATURES SECTION (Interactive & Stunning)
         ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 dark-tech-section w-full blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
            {isAr ? "مزايا خارقة" : "Powerful Capabilities"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
            {t.featuresTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold">
            {t.featuresSubtitle}
          </p>
        </div>

        {/* Bento Grid layout */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          
          {/* Card 1: Offline-First (Span 7) */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="lg:col-span-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 md:p-10 shadow-lg flex flex-col justify-between space-y-8 relative overflow-hidden bento-card"
          >
            <div className="bento-spotlight" />
            {/* Top row */}
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                  Offline-First
                </span>
                
                {/* Simulator Toggle */}
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isOnline 
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-100 dark:border-emerald-800" 
                      : "bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-100 dark:border-rose-800"
                  }`}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 animate-pulse" />
                      <span>{isAr ? "متصل بالإنترنت" : "Online mode"}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5" />
                      <span>{isAr ? "غير متصل (أوفلاين)" : "Offline mode"}</span>
                    </>
                  )}
                </button>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {config?.features?.[0]?.title || "لا توقف أبداً (Offline-First)"}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                {config?.features?.[0]?.description || "يعمل النظام بسرعة فائقة حتى بدون إنترنت، ويزامن مبيعاتك تلقائياً عند عودة الاتصال."}
              </p>
            </div>

            {/* Offline processing simulator */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 space-y-4 z-10">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block">{isAr ? "المبيعات المعلقة للمزامنة" : "Queue to Sync"}</span>
                  <span className="text-base font-black font-mono dark:text-white">
                    {simSalesCount} {isAr ? "عملية بيع" : "Sales Transactions"}
                  </span>
                </div>
                <button
                  onClick={addSimSale}
                  className="bg-slate-900 dark:bg-indigo-600 text-white text-[11px] font-black px-4 py-2.5 rounded-xl shadow-md hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer"
                >
                  ➕ {isAr ? "بيع صنف جديد" : "Sell new product"}
                </button>
              </div>

              {/* Transactions list */}
              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {simQueue.map((tx) => (
                  <div key={tx.id} className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${tx.synced ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
                      <span className="font-bold text-slate-700 dark:text-slate-350">{tx.id} ({tx.time})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono text-slate-800 dark:text-white">{tx.amount.toFixed(2)} {isAr ? "ج.م" : "EGP"}</span>
                      <span className={`text-[10px] font-black ${tx.synced ? "text-emerald-600" : "text-rose-500"}`}>
                        {tx.synced ? (isAr ? "تم الرفع" : "Uploaded") : (isAr ? "في الانتظار" : "Queued")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: WhatsApp Invoices (Span 5) */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="lg:col-span-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 shadow-lg flex flex-col justify-between space-y-8 relative overflow-hidden bento-card"
          >
            <div className="bento-spotlight" />
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                WhatsApp Bills
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {config?.features?.[1]?.title || "فواتير واتساب"}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {config?.features?.[1]?.description || "أرسل الفاتورة الرقمية لعملائك عبر الواتساب بضغطة زر لدعم هويتك التجارية وتقليل استهلاك الورق."}
              </p>
            </div>

            {/* Mobile / Whatsapp UI mockup */}
            <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-white/[0.02] p-4 space-y-4 relative z-10">
              <form onSubmit={handleSendReceipt} className="space-y-2 flex gap-2">
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder={isAr ? "رقم الهاتف..." : "Phone number..."}
                  className="flex-grow bg-white dark:bg-[#0D0C14] border border-slate-150 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs outline-none dark:text-white"
                  style={{ textAlign: "left" }}
                />
                <button
                  type="submit"
                  disabled={sendingReceipt}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:bg-emerald-600 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {sendingReceipt ? (isAr ? "جاري الإرسال..." : "Sending...") : (isAr ? "إرسال ⚡" : "Send ⚡")}
                </button>
              </form>

              {/* Chat bubble render */}
              {chatLogs.length > 0 ? (
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  {chatLogs.map((log, i) => (
                    <div key={i} className="bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30 p-3 rounded-2xl text-[11px] leading-relaxed text-slate-800 dark:text-emerald-300 relative">
                      <p>{log.text}</p>
                      <span className="text-[9px] text-slate-400 dark:text-slate-550 block mt-1 font-mono text-left">{log.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase">
                  {isAr ? "سيتم إظهار الفاتورة هنا" : "Receipt simulation preview"}
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 3: Clothes variations (Span 5) */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="lg:col-span-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 shadow-lg flex flex-col justify-between space-y-8 relative overflow-hidden bento-card"
          >
            <div className="bento-spotlight" />
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                Sizes & Colors
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {config?.features?.[5]?.title || "التكويد الذكي للملابس"}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {isAr ? "توليد المقاسات والألوان المختلفة للمنتج وطباعة باركود لكل منها بضغطة واحدة." : "Generate size and color variations easily with instant barcode tags for easy retail management."}
              </p>
            </div>

            {/* Matrix item generator mockup */}
            <div className="p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 text-xs z-10">
              <div className="flex flex-col gap-2">
                <span className="font-black text-slate-700 dark:text-slate-350">{isAr ? "توليد مقاسات وألوان صنف" : "Generate Product Variations"}</span>
                
                {/* Size chips */}
                <div className="flex flex-wrap gap-1">
                  {["S", "M", "L", "XL"].map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSizes(prev => prev.includes(sz) ? prev.filter(x => x !== sz) : [...prev, sz])}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black border transition-all cursor-pointer ${
                          isSelected ? "bg-[#1F41AD] border-[#1F41AD] text-white" : "bg-white dark:bg-[#0D0C14] border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Color chips */}
                <div className="flex flex-wrap gap-1">
                  {["Red", "Blue", "Black"].map((col) => {
                    const isSelected = selectedColors.includes(col);
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColors(prev => prev.includes(col) ? prev.filter(x => x !== col) : [...prev, col])}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black border transition-all cursor-pointer ${
                          isSelected ? "bg-slate-900 border-slate-900 text-white" : "bg-white dark:bg-[#0D0C14] border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300"
                        }`}
                      >
                        {isAr ? colorLabelsAr[col] || col : col}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Barcode generated count */}
              <div className="p-3 bg-white dark:bg-[#0D0C14] rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? "أكواد الباركود الجاهزة للطباعة:" : "Generated Barcode tags:"}</span>
                <span className="text-[#1F41AD] font-black font-sans text-xs">
                  {selectedSizes.length * selectedColors.length} {isAr ? "باركود" : "Barcodes"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Z-Report Audit Shift drawer (Span 7) */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="lg:col-span-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 md:p-10 shadow-lg flex flex-col justify-between space-y-8 relative overflow-hidden bento-card"
          >
            <div className="bento-spotlight" />
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                Shifts & Register Audits
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isAr ? "ورديات الكاشير وحماية الخزينة" : "Cashier Shifts & Register Safety"}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                {isAr ? "تقفيل ورديات دقيق بنظام العد الأعمى لضمان مطابقة المبالغ في الخزينة ومنع أي عجز أو تلاعب." : "Secure cashier shifts with blind cash counts to match drawer totals and prevent missing cash."}
              </p>
            </div>

            {/* Z-Report simulator */}
            <div className="p-5 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 text-xs z-10">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-350">
                  <span>{isAr ? "رصيد الخزينة بالسيستم:" : "Expected cash in register:"}</span>
                  <span className="font-mono dark:text-white">{drawerDeclared.toFixed(2)} {isAr ? "ج.م" : "EGP"}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-350">
                  <span>{isAr ? "المبلغ المادي بالخزنة (اسحب للتعديل):" : "Physical cash drawer sum (drag):"}</span>
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

              {/* Status output */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-black text-slate-700 dark:text-slate-350">{isAr ? "النتيجة المالية للوردية:" : "Audit Result:"}</span>
                {drawerDeclared === drawerActual ? (
                  <span className="text-emerald-600 font-black bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isAr ? "الخزنة مطابقة 100%" : "Perfect drawer match"}
                  </span>
                ) : drawerActual < drawerDeclared ? (
                  <span className="text-rose-500 font-black bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-md flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {isAr ? `عجز خزينة بقيمة: ${drawerDeclared - drawerActual} ج.م` : `Deficit: ${drawerDeclared - drawerActual} EGP`}
                  </span>
                ) : (
                  <span className="text-blue-600 font-black bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-md flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    {isAr ? `زيادة بالخزينة بقيمة: ${drawerActual - drawerDeclared} ج.م` : `Surplus: ${drawerActual - drawerDeclared} EGP`}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

        </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         5. INTERACTIVE SAVINGS CALCULATOR (Image 1 credit calculator style)
         ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#0A192F]/40 border-y border-slate-100 dark:border-slate-900 blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
              {isAr ? "حاسبة الجدوى والكفاءة" : "Return on Investment"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              {isAr ? "احسب حجم التوفير والأرباح الإضافية" : "See How Much You Could Save"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold">
              {isAr ? "أدخل تفاصيل نشاطك الحالي لترى تقدير الفائدة الاقتصادية والوقت المسترد شهرياً" : "Input details of your store to calculate monthly profit protection & saved hours."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
            {/* Inputs Card */}
            <div className="lg:col-span-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.02] p-8 space-y-6 flex flex-col justify-between">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {isAr ? "بيانات الفروع الحالية" : "Current Business Setup"}
              </span>

              {/* Slider 1: Branches count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span>{isAr ? "عدد الفروع والمخازن:" : "Number of Branches:"}</span>
                  <span className="text-[#1F41AD] font-black text-sm">{calcBranches} {isAr ? "فروع" : "Branches"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={calcBranches}
                  onChange={(e) => setCalcBranches(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1F41AD]"
                />
              </div>

              {/* Slider 2: Monthly Invoices */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span>{isAr ? "الفواتير الشهرية للفروع:" : "Monthly Sales Invoices:"}</span>
                  <span className="text-[#1F41AD] font-black text-sm">{calcInvoices.toLocaleString()} {isAr ? "فاتورة" : "Bills"}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={calcInvoices}
                  onChange={(e) => setCalcInvoices(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1F41AD]"
                />
              </div>

              {/* Slider 3: Cashiers count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span>{isAr ? "طاقم الموظفين / الكاشيرية:" : "Register Staff count:"}</span>
                  <span className="text-[#1F41AD] font-black text-sm">{calcCashiers} {isAr ? "موظفين" : "Staff"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={calcCashiers}
                  onChange={(e) => setCalcCashiers(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1F41AD]"
                />
              </div>

              <div className="pt-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-200 dark:border-slate-800 leading-relaxed">
                * {isAr ? "التقديرات الحسابية مبنية على متوسط دراسات مبيعات التجزئة ومنع الهدر في السوق المصري لعام 2026." : "Calculations are based on average retail operations and drawer leakage audits."}
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0C14] p-8 md:p-10 shadow-xl shadow-indigo-950/5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1F41AD]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6">
                <span className="text-xs font-black text-[#1F41AD] uppercase tracking-wider block">
                  {isAr ? "تقدير التوفير الشهري" : "Monthly Savings Estimation"}
                </span>

                <div className="grid grid-cols-2 gap-4">
                  {/* Metric 1: Hours Saved */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold block">{isAr ? "وقت الجرد والتقارير المسترد" : "Monthly Inventory Hours Saved"}</span>
                    <span className="text-2xl font-black font-sans text-slate-900 dark:text-white">
                      {calcBranches * calcCashiers * 6} {isAr ? "ساعة" : "Hrs"}
                    </span>
                  </div>

                  {/* Metric 2: Printing savings */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold block">{isAr ? "توفير بكر الورق الحراري" : "Paper Printing Costs Saved"}</span>
                    <span className="text-2xl font-black font-sans text-slate-900 dark:text-white">
                      {Math.round(calcInvoices * 0.40)} {isAr ? "ج.م" : "EGP"}
                    </span>
                  </div>
                </div>

                {/* Main Protection Total */}
                <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-indigo-900 dark:text-indigo-400 font-black block">{isAr ? "منع العجز والسرقة والورديات" : "Protected Revenue (Deficit control)"}</span>
                    <span className="text-3xl font-black font-sans text-[#1F41AD] dark:text-indigo-300">
                      {Math.round(calcInvoices * 1.5).toLocaleString()} - {Math.round(calcInvoices * 2.5).toLocaleString()} <span className="text-xs">{isAr ? "ج.م" : "EGP"}</span>
                    </span>
                  </div>
                  <span className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-[#1F41AD] flex items-center justify-center">
                    <Calculator className="w-6 h-6" />
                  </span>
                </div>
              </div>

              <Link
                to="/signup"
                className="w-full h-12 bg-[#1F41AD] hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 active:scale-95 transition-all mt-8"
              >
                {t.trialButton}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         6. HYBRID SYNC NETWORK FLOW (PostgreSQL Cloud to local nodes)
         ──────────────────────────────────────────────────────── */}
      <section className="py-24 dark-tech-section w-full blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
            {isAr ? "أمن وحفظ قواعد البيانات" : "Database Security & Sync"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
            {isAr ? "شبكة المزامنة الهجينة للفروع" : "Hybrid Cloud Synchronization Network"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold">
            {isAr ? "الترابط السحابي بين كاشيرات الفروع المحلية والـ Cloud لضمان أمان عملك وسرعة البيع" : "Dotted network path showcasing local database instances uploading sales to PostgreSQL central server."}
          </p>
        </div>

        {/* Network diagram widget */}
        <div className="relative max-w-4xl mx-auto p-8 border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D0C14] rounded-[2.5rem] shadow-xl shadow-indigo-950/5 flex flex-col items-center">
          
          {/* Cloud server node */}
          <div className="relative z-10 bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 dark:border-slate-800 p-6 rounded-3xl shadow-xl w-68 text-center space-y-4">
            <span className="text-[10px] text-indigo-400 font-black block uppercase">{isAr ? "السحابة المركزية" : "Central Database Cloud"}</span>
            <div className="text-base font-black">PostgreSQL Main Server</div>
            <div className="flex gap-2 justify-center">
              <span className="flex-grow bg-indigo-500/10 text-indigo-300 py-1.5 rounded-lg text-[9px] font-black">
                {isAr ? "تزامن لحظي" : "Realtime sync"}
              </span>
              <span className="flex-grow bg-[#10B981] text-slate-900 py-1.5 rounded-lg text-[9px] font-black flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                {isAr ? "نشط" : "Online"}
              </span>
            </div>
          </div>

          {/* SVG Connector path */}
          <div className="w-full max-w-2xl h-24 my-2 relative">
            <svg className="w-full h-full text-indigo-200 stroke-current" fill="none" viewBox="0 0 600 96">
              {/* Path 1: Central to Left cashier */}
              <path d="M 300 0 C 300 48, 100 48, 100 96" strokeWidth="2" strokeDasharray="6,6" className="animate-[dash_2s_linear_infinite]" />
              {/* Path 2: Central to Mid cashier */}
              <path d="M 300 0 C 300 48, 300 48, 300 96" strokeWidth="2" strokeDasharray="6,6" />
              {/* Path 3: Central to Right inventory */}
              <path d="M 300 0 C 300 48, 500 48, 500 96" strokeWidth="2" strokeDasharray="6,6" />
            </svg>
            
            {/* Animating signals */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full blur-sm animate-ping" />
          </div>

          {/* Sub local database nodes */}
          <div className="grid grid-cols-3 gap-6 w-full pt-2">
            
            {/* Node 1: Left */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center w-full max-w-[160px] space-y-1.5">
                <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-[#1F41AD] flex items-center justify-center mx-auto text-xs font-black">C1</span>
                <div className="text-[11px] font-black text-slate-800 dark:text-slate-200">{isAr ? "كاشير فرع 1 (SQLite)" : "POS 1 (Local SQLite)"}</div>
                <span className="inline-block text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black">
                  {isAr ? "تم الرفع" : "Synced"}
                </span>
              </div>
            </div>

            {/* Node 2: Mid */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center w-full max-w-[160px] space-y-1.5">
                <span className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950 text-[#1F41AD] flex items-center justify-center mx-auto text-xs font-black">C2</span>
                <div className="text-[11px] font-black text-slate-800 dark:text-slate-200">{isAr ? "كاشير فرع 2 (SQLite)" : "POS 2 (Local SQLite)"}</div>
                <span className="inline-block text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black">
                  {isAr ? "تم الرفع" : "Synced"}
                </span>
              </div>
            </div>

            {/* Node 3: Right */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center w-full max-w-[160px] space-y-1.5">
                <span className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto text-xs font-black">IV</span>
                <div className="text-[11px] font-black text-slate-800 dark:text-slate-200">{isAr ? "المخزن الرئيسي (SQLite)" : "Main Stock (SQLite)"}</div>
                <span className="inline-block text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black">
                  {isAr ? "تم الرفع" : "Synced"}
                </span>
              </div>
            </div>

          </div>
        </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         7. STRATEGIC COMPARISON MATRIX (GFP Table)
         ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#0A192F]/40 max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-12 blur-reveal">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
            {isAr ? "مقارنة الجودة" : "Market Comparison"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">{t.compareTitle}</h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {t.compareSubtitle}
          </p>
        </div>

          {/* Sub local database nodes */}
          <div className="grid grid-cols-3 gap-6 w-full pt-2">
            
            {/* Node 1: Left */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-sm text-center w-full max-w-[160px] space-y-1.5">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1F41AD] flex items-center justify-center mx-auto text-xs font-black">C1</span>
                <div className="text-[11px] font-black text-slate-800">{isAr ? "كاشير فرع 1 (SQLite)" : "POS 1 (Local SQLite)"}</div>
                <span className="inline-block text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black">
                  {isAr ? "تم الرفع" : "Synced"}
                </span>
              </div>
            </div>

            {/* Node 2: Mid */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-sm text-center w-full max-w-[160px] space-y-1.5">
                <span className="w-8 h-8 rounded-full bg-purple-50 text-[#1F41AD] flex items-center justify-center mx-auto text-xs font-black">C2</span>
                <div className="text-[11px] font-black text-slate-800">{isAr ? "كاشير فرع 2 (SQLite)" : "POS 2 (Local SQLite)"}</div>
                <span className="inline-block text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black">
                  {isAr ? "تم الرفع" : "Synced"}
                </span>
              </div>
            </div>

            {/* Node 3: Right */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-sm text-center w-full max-w-[160px] space-y-1.5">
                <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xs font-black">IV</span>
                <div className="text-[11px] font-black text-slate-800">{isAr ? "المخزن الرئيسي (SQLite)" : "Main Stock (SQLite)"}</div>
                <span className="inline-block text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black">
                  {isAr ? "تم الرفع" : "Synced"}
                </span>
              </div>
            </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         7. STRATEGIC COMPARISON MATRIX (GFP Table)
         ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-12 blur-reveal">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
            {isAr ? "مقارنة الجودة" : "Market Comparison"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900">{t.compareTitle}</h2>
          <p className="text-sm font-bold text-slate-500">
            {t.compareSubtitle}
          </p>
        </div>

        {/* Tab options comparison */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {(["excel", "desktop", "cloud"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCompareTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-black border transition-all cursor-pointer ${
                activeCompareTab === tab
                  ? "bg-slate-900 border-slate-900 text-white shadow-md"
                  : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
              }`}
            >
              {t.compareTabs?.[tab] || tab}
            </button>
          ))}
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/2 bg-white dark:bg-[#0D0C14] max-w-4xl mx-auto">
          <table className="w-full text-right border-collapse min-w-[720px]" dir={isAr ? "rtl" : "ltr"}>
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.02]">
                <th className={`p-5 text-xs font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>
                  {t.compareHeaderFeature}
                </th>
                <th className={`p-5 text-xs font-black text-[#1F41AD] bg-indigo-50/30 dark:bg-indigo-500/[0.04] uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>
                  {t.compareHeaderManzoma}
                </th>
                <th className={`p-5 text-xs font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>
                  {t.compareTabs?.[activeCompareTab] || activeCompareTab}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              <AnimatePresence mode="wait">
                {((activeCompareTab === "excel" 
                  ? t.compareRowsExcel 
                  : activeCompareTab === "desktop" 
                  ? t.compareRowsDesktop 
                  : t.compareRowsCloud
                ) || []).map((row: any, idx: number) => (
                  <motion.tr
                    key={`${activeCompareTab}-${idx}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-5 font-bold text-slate-800 dark:text-white max-w-[200px]">{row.feature}</td>
                    <td className="p-5 font-bold text-[#1F41AD] bg-indigo-50/30 dark:bg-indigo-500/[0.02]">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 text-emerald-500 text-base">{row.manzomaStatus}</span>
                        <span>{row.manzoma}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 text-rose-400 text-base">{row.otherStatus}</span>
                        <span>{row.other}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         8. DYNAMIC PRICING SECTION (Populated from config/packages)
         ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 dark-tech-section w-full blur-reveal">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
            {isAr ? "الأسعار والاشتراكات" : "Pricing Plans"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900">{t.pricingTitle}</h2>
          <p className="text-sm sm:text-base text-slate-500 font-bold">
            {t.pricingSubtitle}
          </p>

          {/* Switch toggle billing cycle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-slate-100 bg-slate-50 mt-6 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#1F41AD] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-[#1F41AD] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{t.yearly}</span>
              <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                {t.savePercent || "20% OFF"}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {(packages || []).filter((pkg) => pkg && pkg.visible !== false).map((plan) => {
            const isPopular = plan.isPopular;
            const monthlyPrice = parseInt((plan.price || "0").replace(/,/g, ""), 10);
            const calculatedYearly = plan.yearlyPrice ? parseInt((plan.yearlyPrice || "0").replace(/,/g, ""), 10) : Math.round(monthlyPrice * 0.8);
            const displayPrice = billingCycle === "yearly" ? calculatedYearly : monthlyPrice;
            const packageTrans = (t.pricingPackages?.[plan.id as keyof typeof t.pricingPackages] || plan) as any;

            return (
              <div
                key={plan.id}
                className={`relative rounded-[2rem] p-8 flex flex-col justify-between border transition-all duration-300 ${
                  isPopular
                    ? "bg-slate-900 border-indigo-500/40 text-white shadow-2xl scale-[1.02] z-10"
                    : "bg-white border-slate-100 shadow-sm hover:shadow-md"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 right-6 px-4 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full shadow-lg">
                    {t.popularBadge || "Best Option"}
                  </div>
                )}

                <div>
                  {/* Header info */}
                  <div className="space-y-2 mb-6">
                    <h3 className={`text-lg font-black ${isPopular ? "text-white" : "text-slate-900"}`}>{packageTrans.name}</h3>
                    <p className={`text-xs leading-relaxed font-bold ${isPopular ? "text-slate-400" : "text-slate-500"}`}>
                      {packageTrans.desc || packageTrans.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className={`flex items-baseline gap-1.5 mb-8 border-b pb-6 ${isPopular ? "border-slate-800" : "border-slate-100"}`}>
                    <span className="text-4xl font-black font-sans tracking-tight text-[#1F41AD]">
                      {displayPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {billingCycle === "yearly" ? (isAr ? "ج.م / شهرياً (دفع سنوي)" : "EGP / Mo (billed annually)") : (isAr ? "ج.م / شهرياً" : "EGP / Mo")}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {(packageTrans?.features || []).map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-xs font-bold">
                        <Check className="w-4.5 h-4.5 shrink-0 text-emerald-500" />
                        <span className={isPopular ? "text-slate-200" : "text-slate-700"}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/signup"
                  className={`w-full h-12 rounded-xl font-black text-xs flex items-center justify-center transition-all duration-300 hover:scale-[1.02] shadow cursor-pointer ${
                    isPopular
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-[#1F41AD] text-white hover:bg-indigo-700 shadow-indigo-600/10"
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
         9. TESTIMONIALS SLIDER & FAQS (Accordion)
         ──────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-[1400px] mx-auto px-6 sm:px-12 space-y-24 blur-reveal">
        
        {/* Testimonials Swiper integration */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-black uppercase text-[#1F41AD] bg-indigo-50 px-3 py-1 rounded-full">
              {isAr ? "آراء العملاء" : "Client Success Stories"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-center text-slate-900 dark:text-white">
              {isAr ? "ماذا يقول شركاء النجاح عن منظومة؟" : "What Our Merchants Say"}
            </h2>
          </div>

          <TestimonialsSwiper isAr={isAr} />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-12">
          <h2 className="text-3xl sm:text-4xl font-black text-center text-slate-900 dark:text-white">{t.faqTitle}</h2>

          <div className="space-y-4 max-w-4xl mx-auto">
            {(t.faqList || []).map((faq: any, i: number) => {
              const isOpen = openFAQ === i;
              return (
                <div
                  key={i}
                  className="rounded-[1.8rem] border border-slate-150 dark:border-slate-800 overflow-hidden transition-colors duration-300 shadow-sm bg-white dark:bg-[#0D0C14]"
                >
                  <button
                    id={`faq-question-${i}`}
                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className={`w-full flex items-center justify-between p-6 ${isAr ? "text-right" : "text-left"} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-t-[1.8rem]`}
                  >
                    <span className="font-black text-sm sm:text-base text-slate-800 dark:text-white">{faq.q}</span>
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
                        transition={{ duration: 0.3, ease }}
                      >
                        <p className="px-6 pb-6 text-xs sm:text-sm leading-relaxed font-bold pt-2 border-t border-slate-50 dark:border-white/5 text-slate-500 dark:text-slate-400">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* ────────────────────────────────────────────────────────
         10. FINAL SLANTED CTA (Indigo slice block)
         ──────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 relative overflow-visible">
        <section className="relative w-full max-w-[1400px] mx-auto rounded-[2.5rem] bg-gradient-to-b from-[#1F41AD] to-indigo-900 text-white overflow-hidden shadow-2xl flex flex-col items-center py-20 text-center px-6 sm:px-12 border border-white/10 -skew-y-1 blur-reveal">
          {/* Unskew back container content */}
          <div className="skew-y-1 w-full max-w-3xl mx-auto px-6 space-y-8 flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl font-black leading-tight text-white">
              {t.finalCtaTitle || "حوّل فوضى المبيعات إلى سيطرة مطلقة"}
            </h2>
            <p className="text-sm sm:text-base text-slate-100 max-w-md mx-auto leading-relaxed font-bold">
              {t.finalCtaSubtitle || "انضم لآلاف المتاجر الذكية اليوم وأمن خزائنك وفروعك."}
            </p>
            
            <div className="w-full max-w-md p-1.5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl flex items-center gap-2 mt-4">
              <input
                type="email"
                value={ctaEmailInput}
                onChange={(e) => setCtaEmailInput(e.target.value)}
                placeholder={isAr ? "أدخل البريد الإلكتروني..." : "Enter your email..."}
                className={`flex-grow bg-transparent px-4 py-2 text-sm outline-none text-white placeholder-indigo-200 border-none ${
                  isAr ? "text-right" : "text-left"
                }`}
              />
              <Link
                to={`/signup?email=${encodeURIComponent(ctaEmailInput)}`}
                className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                {isAr ? "ابدأ الآن ⚡" : "Get Started ⚡"}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ────────────────────────────────────────────────────────
         11. WATERMARKED FOOTER (Awwwards-level branding)
         ──────────────────────────────────────────────────────── */}
      <footer className="py-20 px-6 sm:px-12 lg:px-16 max-w-[1400px] mx-auto border-t border-slate-250 dark:border-slate-800 relative overflow-hidden bg-slate-50 dark:bg-[#0A192F]/80">
        
        {/* Massive Watermark brand background */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-black text-[7.5rem] md:text-[14rem] text-slate-200/40 dark:text-slate-900/10 select-none pointer-events-none uppercase tracking-widest font-mono z-0 leading-none">
          {isAr ? "منظومة" : "MANZOMA"}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img src={config.logoUrl || "/cdn/Asset 1.png"} alt={config.siteName || "Manzoma"} className="h-9 w-auto max-w-32 object-contain" />
              <span className="font-black text-base text-slate-800 dark:text-white">
                {isAr ? "منظومة" : "Manzoma"}
              </span>
            </div>
            <p className="text-xs leading-relaxed font-bold text-slate-400 dark:text-slate-500 max-w-[20ch]">
              {t.footerDesc}
            </p>
          </div>

          {/* Links column 1 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.footerProduct}</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <li><Link to="/#features" className="hover:text-[#1F41AD]">{t.footerProdItem1}</Link></li>
              <li><Link to="/#features" className="hover:text-[#1F41AD]">{t.footerProdItem2}</Link></li>
              <li><Link to="/#features" className="hover:text-[#1F41AD]">{t.footerProdItem3}</Link></li>
              <li><Link to="/#features" className="hover:text-[#1F41AD]">{t.footerProdItem4}</Link></li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.footerCompany}</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <li><Link to="/page/about" className="hover:text-[#1F41AD]">{t.footerCompAbout}</Link></li>
              <li><Link to="/page/contact" className="hover:text-[#1F41AD]">{t.footerCompContact}</Link></li>
              <li><Link to="/academy" className="hover:text-[#1F41AD]">{t.academy}</Link></li>
            </ul>
          </div>

          {/* Links column 3 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.footerSupport}</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <li><Link to="/page/terms" className="hover:text-[#1F41AD]">{t.footerTerms}</Link></li>
              <li><Link to="/page/privacy" className="hover:text-[#1F41AD]">{t.footerPrivacy}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom row copyright & socials */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400 mt-16 relative z-10">
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
