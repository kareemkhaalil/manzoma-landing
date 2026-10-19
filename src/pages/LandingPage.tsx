import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  TrendingUp,
  CreditCard,
  Building,
  ShieldCheck,
  Check,
  Zap,
  Wifi,
  WifiOff,
  ShoppingBag,
  Package,
  Layers,
  FileSpreadsheet,
  Receipt,
  Printer,
  Calculator,
  MessageSquare,
  Download,
  Barcode,
  Sliders,
  DollarSign,
  Tag,
  CheckSquare,
  Sparkles,
  Smartphone,
  ExternalLink,
  Store,
  Shirt,
  Home as HomeIcon,
  HelpCircle,
  ArrowUpRight
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";
import { useSchema } from "../hooks/useSchema";
import Navbar from "../components/landing/Navbar";
import MarqueeTape from "../components/landing/MarqueeTape";
import TestimonialsSwiper from "../components/landing/TestimonialsSwiper";

const ease = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  const store = useAdminStore();
  const config = store.config;
  const packages = store.packages;
  const language = store.language;
  const isDark = store.theme === "dark";

  const langKey = language === "en" ? "en" : "ar";
  const t = translations[langKey] || translations["ar"];
  const isAr = langKey === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useSEO({
    title: isAr
      ? "نظام متكامل لإدارة نقاط البيع والمخازن والحسابات | منظومة ERP"
      : "Complete POS, Inventory & Cloud Retail Management | Manzoma ERP",
    description: isAr
      ? "منظومة نظام متكامل لإدارة نقاط البيع والمخزون والفروع. كاشير سريع ومستقر يعمل 100% بدون إنترنت، مصفوفة المقاسات والألوان، فواتير واتساب، وتقارير أرباح موحدة على هاتفك."
      : "Enterprise POS and retail inventory platform. 100% offline-first cashier, variant matrix, digital WhatsApp receipts, and centralized multi-branch analytics.",
    canonical: "https://manzoma.online/",
    image: "https://manzoma.online/cdn/Asset%201.png",
  });

  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "منظومة ERP",
      description: isAr
        ? "نظام إدارة نقاط البيع والمخازن والفروع لمحلات التجزئة والملابس."
        : "Complete POS, inventory, and retail management platform.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Windows, Web, Cloud",
      url: "https://manzoma.online/",
      image: "https://manzoma.online/cdn/Asset%201.png",
    }
  ]);

  // Pricing & Calculator State
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [calcBranches, setCalcBranches] = useState(2);
  const [calcInvoices, setCalcInvoices] = useState(2500);
  const [activeSegment, setActiveSegment] = useState<"fashion" | "homeware" | "retail">("fashion");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <main className="w-full flex-grow space-y-24 sm:space-y-32 pt-24 sm:pt-32 pb-20">
        
        {/* ========================================================
            1. HERO SECTION (Shopify / Linear caliber)
            ======================================================== */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto text-center space-y-8 sm:space-y-10">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? "نظام متكامل لإدارة نقاط البيع، المخازن، والحسابات السحابية" : "Unified POS, Inventory & Cloud Analytics"}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] text-slate-950 dark:text-white max-w-5xl mx-auto">
            {isAr ? "إدارة مبيعات ومخازن —" : "Retail & Inventory Management —"}{" "}
            <br className="hidden sm:inline" />
            <span className="text-indigo-600 dark:text-indigo-400">
              {isAr ? "صُممت لتنمو مع تجارتك وتعمل بدون توقف." : "Engineered to scale with zero downtime."}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {isAr
              ? "حل شامل صُمم لتجار التجزئة ومحلات الملابس والأجهزة. كاشير سريع ومستقر يعمل محلياً 100% بدون إنترنت، مصفوفة متطورة للمقاسات والألوان والباركود، وتقارير أرباح موحدة تصلك على هاتفك لحظة بلحظة."
              : "Complete solution for modern retailers. High-speed cashier that runs 100% offline, smart variant matrix, digital WhatsApp receipts, and live multi-branch reporting."}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-xl text-sm font-black inline-flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>{isAr ? "ابدأ نسختك التجريبية مجاناً" : "Start 14-Day Free Trial"}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>

            <Link
              to="/download"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isAr ? "تحميل برنامج الويندوز (Desktop App)" : "Download Windows App"}</span>
            </Link>
          </div>

          {/* Trust Value Points */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isAr ? "يعمل 100% بدون إنترنت" : "100% Offline Resilience"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isAr ? "متوافق مع كافة طابعات الفواتير والباركود" : "Thermal & Barcode Hardware Ready"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isAr ? "مزامنة سحابية لحظية بين الفروع" : "Centralized Multi-Branch Sync"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isAr ? "دعم فني وتدريب مجاني" : "Free Onboarding & Support"}</span>
            </div>
          </div>

          {/* ================= HERO PRODUCT SHOWCASE FRAME ================= */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-right">
              
              {/* App Window Top Bar */}
              <div className="h-10 px-4 rounded-t-xl bg-slate-100/80 dark:bg-white/5 flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="font-mono text-xs text-slate-600 dark:text-slate-400 font-bold">
                  manzoma-pos-v1.5.0 • {isAr ? "فرع المهندسين — الكاشير متصل محلياً" : "Downtown Terminal — Local Engine Active"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">100% OK</span>
                </div>
              </div>

              {/* Showcase Body Preview */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 dark:bg-[#070D1E]/40 rounded-b-xl">
                
                {/* Left/Main: POS Cashier Screen */}
                <div className="md:col-span-8 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {isAr ? "شاشة الكاشير السريع (POS)" : "High-Velocity Register"}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      {isAr ? "زمن الاستجابة: 0.04 ثانية" : "0.04s Latency"}
                    </span>
                  </div>

                  {/* Active Cart Line Items */}
                  <div className="space-y-2 text-xs">
                    {[
                      { code: "SKU-8901", name: isAr ? "قميص كتان كاجوال (L / كحلي)" : "Casual Linen Shirt (L / Navy)", qty: 2, price: 380, total: 760 },
                      { code: "SKU-8902", name: isAr ? "بنطلون جينز سليم فيت (34 / رمادي)" : "Slim-fit Jeans (34 / Grey)", qty: 1, price: 520, total: 520 },
                      { code: "SKU-8903", name: isAr ? "تيشيرت بولو قطن (XL / أبيض)" : "Cotton Polo Tee (XL / White)", qty: 1, price: 290, total: 290 },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-between border border-slate-150 dark:border-white/5">
                        <div className="space-y-0.5">
                          <span className="font-black text-slate-800 dark:text-slate-200 block">{item.name}</span>
                          <span className="text-xs font-mono text-slate-500">{item.code} • {item.qty} × {item.price} ج.م</span>
                        </div>
                        <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                          {item.total.toLocaleString()} ج.م
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals Summary */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">{isAr ? "الصافي المطلوب (3 أصناف)" : "Payable Total"}</span>
                      <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">1,570.00 ج.م</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300">
                        F6 {isAr ? "تعليق السلة" : "Hold"}
                      </span>
                      <span className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm">
                        F12 {isAr ? "طباعة الفاتورة" : "Print (F12)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right/Side: Live Shift & Multi-Branch Health */}
                <div className="md:col-span-4 space-y-4">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{isAr ? "مبيعات اليوم بالفروع" : "Today's Consolidated Sales"}</span>
                    <span className="text-2xl font-black font-mono text-slate-950 dark:text-white block">48,250.00 ج.م</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{isAr ? "+18.4% مقارنة بالأمس" : "+18.4% vs yesterday"}</span>
                    </span>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 space-y-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{isAr ? "حالة الفروع المتصلة" : "Connected Branches"}</span>
                    <div className="space-y-1.5 text-xs font-bold">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">{isAr ? "فرع المهندسين" : "Branch 1"}</span>
                        <span className="text-emerald-600 text-xs font-mono">{isAr ? "نشط ومزامن" : "Active"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">{isAr ? "فرع التجمع الخامس" : "Branch 2"}</span>
                        <span className="text-emerald-600 text-xs font-mono">{isAr ? "نشط ومزامن" : "Active"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">{isAr ? "فرع الإسكندرية" : "Branch 3"}</span>
                        <span className="text-indigo-600 text-xs font-mono">{isAr ? "أوفلاين (بيع محلي)" : "Local Offline"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 block">{isAr ? "فواتير الواتساب المرسلة" : "WhatsApp Invoices"}</span>
                      <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">{isAr ? "142 فاتورة إلكترونية اليوم" : "142 digital receipts"}</span>
                    </div>
                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. MARQUEE TAPE
            ======================================================== */}
        <MarqueeTape />

        {/* ========================================================
            3. THE 4 CORE CAPABILITIES (Shopify-Grade Feature Pillars)
            ======================================================== */}
        <section id="features" className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
              {isAr ? "المميزات والحلول الأساسية" : "Core Capabilities"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
              {isAr ? "كل ما يلزمك لتشغيل متجرك بأعلى كفاءة" : "Everything Needed to Run Modern Retail"}
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
              {isAr
                ? "منظومة موحدة تربط الكاشير والمخازن والحسابات والعملاء في شاشة واحدة دون برامج مساعدة أو تعقيدات تقنية."
                : "A unified platform connecting POS, warehouses, ledger, and customer marketing."}
            </p>
          </div>

          <div className="space-y-16">
            
            {/* PILLAR 1: Offline-First POS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <WifiOff className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                  {isAr ? "نقطة بيع سريعة لا تتعطل أبداً — تعمل أوفلاين 100%" : "Zero-Downtime Offline POS"}
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? "استقرار فوري لنقاط البيع. يتم تسجيل المبيعات وطباعة الإيصالات في أجزاء من الثانية دون الاعتماد على سرعة الإنترنت. حتى لو انقطع الاتصال لأيام، تستمر عمليات البيع والورديات دون أي تعطيل، وترتفع البيانات للسحابة فور عودة الاتصال تلقائياً."
                    : "Uninterrupted cashier checkouts with sub-50ms latency. Transactions are stored safely in an embedded local database and automatically synced to the cloud upon reconnection."}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "دعم تعليق وحفظ سلات متعددة للزبائن (Multi-Cart F6)" : "Multi-cart hold during rush hours"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "معالجة المبيعات والاستبدال والمرتجع في نفس الفاتورة" : "Unified exchange and return transactions"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "طباعة فورية لقوالب 58mm و 80mm بدون قص هوامش" : "Optimized thermal printing for 58mm and 80mm"}</span>
                  </li>
                </ul>
              </div>

              {/* Visual Card */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isAr ? "فاتورة كاشير حرارية #REC-001643" : "Thermal Receipt #REC-001643"}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    {isAr ? "طبع بنجاح" : "Printed"}
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>{isAr ? "الصنف والمواصفات" : "Item & Specs"}</span>
                    <span>{isAr ? "الإجمالي" : "Total"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 flex justify-between items-center font-bold">
                    <span>جاكيت جلد طبيعي (XL / أسود) × 1</span>
                    <span>1,200.00 ج.م</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 flex justify-between items-center font-bold">
                    <span>حذاء رياضي مريح (43 / كحلي) × 1</span>
                    <span>850.00 ج.م</span>
                  </div>
                  <div className="pt-2 flex justify-between text-slate-900 dark:text-white font-black text-sm">
                    <span>{isAr ? "الصافي المطلوب:" : "Net Total:"}</span>
                    <span>2,050.00 ج.م</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PILLAR 2: Sizing & Color Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 order-last lg:order-first p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isAr ? "مصفوفة الأصناف والباركود" : "Variant Matrix Generator"}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {isAr ? "توليد فوري للباركود" : "Auto Barcode"}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { var: isAr ? "مقاس L — أزرق سماوي" : "Size L — Sky Blue", bar: "62210098201", stock: 18, price: "350 ج.م" },
                    { var: isAr ? "مقاس XL — أزرق سماوي" : "Size XL — Sky Blue", bar: "62210098202", stock: 12, price: "350 ج.م" },
                    { var: isAr ? "مقاس L — أسود ملكي" : "Size L — Royal Black", bar: "62210098203", stock: 24, price: "350 ج.م" },
                  ].map((row, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-between border border-slate-150 dark:border-white/5">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{row.var}</span>
                        <span className="font-mono text-slate-400 text-xs">{row.bar}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white block">{row.price}</span>
                        <span className="text-xs font-bold text-emerald-600">{row.stock} {isAr ? "قطع بالمخزن" : "in stock"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                  {isAr ? "مصفوفة متقدمة للمقاسات والألوان والباركود" : "Smart Variant Matrix & Barcode Engine"}
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? "تكويد سريع واحترافي لموديلات الملابس والأحذية. أنشئ مصفوفة المقاسات والألوان بضغطة زر واحدة واطبع ملصقات الباركود لجميع المتغيرات، مع جرد فوري بالسكانر أو الإكسيل دون إيقاف حركة البيع في المحل."
                    : "Create apparel size and color variations in seconds. Generate unique barcode stickers, configure reorder levels, and perform continuous audits without halting cash registers."}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "توليد تلقائي لأكواد الباركود الدولية والمحلية" : "Instant local & international barcode generation"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "جرد مستمر بالسكانر أو ملفات Excel دون إغلاق المتجر" : "Continuous stock audit via scanner or Excel"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "تنبيهات تلقائية عند وصول الصنف للحد الأدنى للطلب" : "Automated low-stock threshold alerts"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* PILLAR 3: Shift Closing & Cash Audits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                  {isAr ? "تقفيل دقيق للورديات ومطابقة الخزائن (Z-Report)" : "Shift Reconciliation & Cash Drawers"}
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? "إحكام الرقابة المالية ومنع أي تسريب. مطابقة دقيقة للنقدية الفعلية في الدرج مع مبيعات النظام، توثيق كل خصم أو حركة بيع باسم المستخدم المسؤول، وتقارير أرباح وخسائر واضحة على هاتفك."
                    : "Zero cash discrepancy at shift handovers. Strict drawer count verification, seller-attributed discounts, and daily P&L reports accessible directly from mobile."}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "كشف فوري لعجز أو زيادة الخزينة عند تقفيل الوردية" : "Instant drawer over/short calculation"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "توثيق كل حركة خصم أو تعديل بحساب الكاشير" : "Cashier-attributed discount tracking"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "تقارير وردية ملخصة تطبع حرارياً وتصل للمدير" : "Thermal summary slips and mobile sync"}</span>
                  </li>
                </ul>
              </div>

              {/* Visual Card */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isAr ? "تقرير تقفيل وردية (Z-Report)" : "Shift Closing Report"}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    {isAr ? "مطابق تماماً (عجز: 0.00)" : "Balanced: 0.00 Diff"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                    <span className="text-slate-500 block">{isAr ? "مبيعات الكاش الفعلي" : "Cash In Drawer"}</span>
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white">6,450.00 ج.م</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                    <span className="text-slate-500 block">{isAr ? "مبيعات الفيزا / فوري" : "Card / POS"}</span>
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white">4,200.00 ج.م</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? "مسؤول الوردية:" : "Cashier:"}</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">كاشير 1 (أحمد سامي)</span>
                </div>
              </div>
            </div>

            {/* PILLAR 4: WhatsApp Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 order-last lg:order-first p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isAr ? "إشعار فاتورة واتساب للعميل" : "WhatsApp Business Receipt"}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    {isAr ? "مُرسل للعميل" : "Delivered"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-2 text-slate-800 dark:text-emerald-200">
                  <p className="font-bold">
                    {isAr ? "مرحباً أستاذ محمد، شكراً لتسوقك من متجرنا!" : "Hello Mohamed, thanks for shopping with us!"}
                  </p>
                  <p className="text-slate-600 dark:text-emerald-300 leading-relaxed">
                    {isAr
                      ? "تم إصدار فاتورة مشترياتك رقم REC-001643 بقيمة 2,050 ج.م. يمكنك عرض الفاتورة الإلكترونية وتفاصيل الضمان عبر الرابط المعتمد:"
                      : "Receipt #REC-001643 for 2,050 EGP has been generated. View your digital receipt & warranty:"}
                  </p>
                  <div className="pt-1 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    manzoma.online/i/1643
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                  {isAr ? "فواتير إلكترونية وأتمتة التسويق عبر الواتساب" : "Automated WhatsApp Invoices & Marketing"}
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? "تواصل عصري ومباشر مع زبائنك ووفر تكلفة بكر الورق الحراري. أرسل فواتير الشراء الرقمية على واتساب العميل فور إصدارها، واستفد من أتمتة حملات إعادة استهداف العملاء الراكدين برسائل العروض والتخفيضات."
                    : "Eliminate thermal paper roll expenses while delighting customers. Send branded PDF receipts on WhatsApp and re-engage inactive customers with targeted promotion campaigns."}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "إرسال فواتير PDF فورية للعملاء بضغطة زر" : "One-click digital PDF receipt dispatch"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "توفير مئات الجنيهات شهرياً في بكر الورق" : "Significant monthly thermal paper savings"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "حملات إعادة استهداف العملاء وتصنيف كبار المشترين" : "VIP customer grouping and broadcast campaigns"}</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            4. INDUSTRY SOLUTIONS (Fit for your business)
            ======================================================== */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {isAr ? "حلول مصممة خصيصاً لنشاطك التجاري" : "Tailored Solutions for Your Industry"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "سواء كنت تدير متجر ملابس أو مستلزمات منزلية أو تجزئة عامة." : "Engineered to fit specific retail workflows."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "fashion",
                icon: Shirt,
                title: isAr ? "محلات الملابس والأحذية" : "Fashion & Footwear",
                desc: isAr ? "تكويد المقاسات والألوان وطباعة ملصقات الباركود، مع بيع سريع وسجل منظم للمرتجعات والاستبدال." : "Size/color matrix, barcode stickers, and streamlined garment returns.",
                points: [isAr ? "مصفوفة مقاسات وألوان ذكية" : "Smart variant matrix", isAr ? "طباعة فورية للباركود" : "Thermal barcode labels", isAr ? "فواتير استبدال سريعة" : "Unified exchange slips"]
              },
              {
                id: "homeware",
                icon: HomeIcon,
                title: isAr ? "الأدوات المنزلية والمفروشات" : "Home Goods & Kitchenware",
                desc: isAr ? "تنظيم آلاف الأصناف بالباركود أو الاسم، ومتابعة حركات الوارد والمنصرف وتنبيهات نواقص المخزن." : "Thousands of SKUs organized with low-stock alerts and physical counts.",
                points: [isAr ? "بحث فوري بالاسم والباركود" : "Instant search", isAr ? "تنبيهات نواقص الأصناف" : "Shortage warnings", isAr ? "جرد دوري بالسكانر" : "Continuous scanner audit"]
              },
              {
                id: "retail",
                icon: Store,
                title: isAr ? "متاجر التجزئة ومحلات البقالة" : "General Retail & POS",
                desc: isAr ? "بيع سريع وموثوق من الكاشير حتى بدون إنترنت، تسجيل الخصومات باسم الكاشير، وضبط الوردية والخزينة." : "Offline cashier checkout, shift reconciliation, and anti-leak cash controls.",
                points: [isAr ? "بيع محلي أوفلاين دون تأخير" : "Offline cashier speed", isAr ? "تقفيل دقيق للوردية" : "Z-report cash matching", isAr ? "تقارير أرباح يومية" : "Consolidated P&L"]
              }
            ].map((col, idx) => {
              const Icon = col.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4 hover:border-indigo-500/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                    {col.desc}
                  </p>
                  <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {col.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            5. ROI & PRACTICAL METRICS CALCULATOR
            ======================================================== */}
        <section className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                {isAr ? "حاسبة الكفاءة والتوفير" : "Savings & Efficiency"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                {isAr ? "احسب العائد والتوفير الشهري لمتجرك" : "Estimate Your Monthly ROI"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm font-black">
                    <span>{isAr ? "عدد الفروع:" : "Active Branches:"}</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{calcBranches} {isAr ? "فروع" : "branches"}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={calcBranches}
                    onChange={(e) => setCalcBranches(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm font-black">
                    <span>{isAr ? "متوسط عدد الفواتير الشهرية:" : "Monthly Invoices:"}</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{calcInvoices.toLocaleString()} {isAr ? "فاتورة" : "receipts"}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="15000"
                    step="500"
                    value={calcInvoices}
                    onChange={(e) => setCalcInvoices(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 block">{isAr ? "التوفير الشهري في بكر الورق الحراري:" : "Monthly Paper Savings:"}</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {Math.round(calcInvoices * 0.40)} {isAr ? "ج.م شهرياً" : "EGP/mo"}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/5 space-y-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <p>✓ {isAr ? "توفير ساعات تقفيل الورديات ومراجعة الخزائن يدوياً." : "Automated daily cashier reconciliation."}</p>
                  <p>✓ {isAr ? "منع تضارب المخزون بين الفروع عبر المزامنة السحابية." : "Central multi-branch sync prevents stock discrepancies."}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            6. COMPARISON MATRIX (لماذا منظومة مقارنة بالبدائل؟)
            ======================================================== */}
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {isAr ? "مقارنة عملية: منظومة مقابل البدائل التقليدية" : "Manzoma vs Traditional Alternatives"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "لماذا يفضل أصحاب المحلات الانتقال من الدفاتر والبرامج القديمة إلى منظومة؟" : "Clear comparison across reliability, hardware, and multi-branch management."}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                  <th className="p-4 sm:p-5 font-black text-slate-900 dark:text-white">{isAr ? "الميزة / المعيار" : "Feature"}</th>
                  <th className="p-4 sm:p-5 font-black text-indigo-600 dark:text-indigo-400">{isAr ? "منظومة ERP" : "Manzoma ERP"}</th>
                  <th className="p-4 sm:p-5 font-bold text-slate-500">{isAr ? "الدفاتر والإكسيل" : "Excel / Paper"}</th>
                  <th className="p-4 sm:p-5 font-bold text-slate-500">{isAr ? "البرامج السحابية البطيئة" : "Pure Web POS"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
                {[
                  { feature: isAr ? "البيع بدون إنترنت (أوفلاين 100%)" : "100% Offline Cashier", m: isAr ? "يعمل محلياً بأقصى سرعة" : "Instant local execution", other1: isAr ? "يدوي وبطيء" : "Manual", other2: isAr ? "يتوقف الكاشير تماماً" : "Completely freezes" },
                  { feature: isAr ? "مصفوفة المقاسات والألوان والباركود" : "Variant Matrix & Barcode", m: isAr ? "توليد فوري وطباعة بضغطة زر" : "One-click generation", other1: isAr ? "غير مدعوم ومعقد" : "Not supported", other2: isAr ? "يتطلب إدخال يدوي طويل" : "Complex setup" },
                  { feature: isAr ? "فواتير الواتساب الإلكترونية" : "WhatsApp Digital Receipts", m: isAr ? "إرسال تلقائي مدمج" : "Automated & Built-in", other1: isAr ? "غير متوفر" : "Unavailable", other2: isAr ? "اشتراك ورسوم إضافية" : "Expensive addons" },
                  { feature: isAr ? "متابعة أرباح الفروع على الهاتف" : "Multi-Branch Mobile Reports", m: isAr ? "تقارير موحدة لحظية" : "Live unified analytics", other1: isAr ? "لا توجد تقارير فورية" : "No live sync", other2: isAr ? "متاح" : "Available" },
                  { feature: isAr ? "تقفيل الخزائن ومنع العجز (Z-Report)" : "Shift Drawer Reconciliation", m: isAr ? "مطابقة دقيقة وتوثيق بالبائع" : "Exact drawer audit", other1: isAr ? "أخطاء حسابية متكررة" : "Frequent errors", other2: isAr ? "محدود" : "Limited" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                    <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="p-4 sm:p-5 font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{row.m}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">{row.other1}</td>
                    <td className="p-4 sm:p-5 text-slate-500">{row.other2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================
            7. TESTIMONIALS (Social Proof)
            ======================================================== */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {isAr ? "تجار يعتمدون على منظومة يومياً" : "Trusted by Retail Merchants"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "آراء حقيقية من مديري وأصحاب المتاجر في مصر والعالم العربي." : "Real feedback from fashion, footwear, and retail store owners."}
            </p>
          </div>

          <TestimonialsSwiper />
        </section>

        {/* ========================================================
            8. PRICING PLANS
            ======================================================== */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
              {isAr ? "باقات اشتراك واضحة" : "Transparent Pricing"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
              {isAr ? "اختر الخطة المناسبة لحجم متجرك" : "Choose the Plan That Fits Your Store"}
            </h2>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {isAr ? "بدون رسوم خفية، مع إمكانية الترقية أو الإلغاء في أي وقت." : "No hidden fees. Upgrade or adjust your package at any time."}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white dark:bg-[#0B132B] text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {isAr ? "دفع شهري" : "Monthly"}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-white dark:bg-[#0B132B] text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{isAr ? "دفع سنوي" : "Yearly"}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                  {isAr ? "وفر شهرين" : "Save 20%"}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {(packages && packages.length > 0 ? packages : [
              {
                id: "starter",
                name: isAr ? "الباقة الأساسية (Starter)" : "Starter Plan",
                price: billingCycle === "yearly" ? 2200 : 250,
                description: isAr ? "مثالية للمحلات الفردية ونقاط البيع المبتدئة." : "Ideal for single retail registers.",
                features: [
                  isAr ? "نقطة بيع واحدة (POS) أوفلاين 100%" : "Single offline POS terminal",
                  isAr ? "إدارة المخزن والأصناف والباركود" : "Inventory & barcode management",
                  isAr ? "طباعة الفواتير الحرارية (58mm/80mm)" : "Thermal receipt printing",
                  isAr ? "تقارير الوردية اليومية (Z-Report)" : "Daily shift reports",
                  isAr ? "دعم فني عبر الواتساب" : "WhatsApp technical support"
                ]
              },
              {
                id: "growth",
                name: isAr ? "باقة النمو والتوسع (Pro)" : "Professional Plan",
                price: billingCycle === "yearly" ? 4200 : 450,
                popular: true,
                description: isAr ? "الخيار الأفضل للمتاجر النشطة ومحلات الملابس." : "Best for active fashion & retail stores.",
                features: [
                  isAr ? "حتى 3 نقاط بيع (كاشيرات متعددة)" : "Up to 3 cashier terminals",
                  isAr ? "مصفوفة متقدمة للمقاسات والألوان" : "Variant matrix (Size & Color)",
                  isAr ? "فواتير واتساب إلكترونية للعملاء" : "Digital WhatsApp receipts",
                  isAr ? "لوحة تحكم سحابية ومتابعة من الهاتف" : "Centralized cloud mobile dashboard",
                  isAr ? "جرد مستمر بالسكانر والإكسيل" : "Continuous stocktaking",
                  isAr ? "دعم فني وأولوية تدريب" : "Priority support & staff onboarding"
                ]
              },
              {
                id: "enterprise",
                name: isAr ? "باقة الفروع المتعددة (Enterprise)" : "Multi-Branch Enterprise",
                price: billingCycle === "yearly" ? 7500 : 790,
                description: isAr ? "للشركات وسلاسل الفروع ذات الإدارة المركزية." : "For retail chains and multi-branch networks.",
                features: [
                  isAr ? "فروع متعددة غير محدودة" : "Unlimited branches & terminals",
                  isAr ? "تحويلات مخزنية مركزية بين الفروع" : "Central stock transfers",
                  isAr ? "مساعد الذكاء الاصطناعي للأرباح" : "AI business assistant",
                  isAr ? "تقارير موحدة وتحليلات مالية متقدمة" : "Consolidated executive analytics",
                  isAr ? "مدير حساب مخصص وتدريب ميداني" : "Dedicated account manager"
                ]
              }
            ]).map((pkg: any, idx: number) => {
              const isPopular = pkg.popular || idx === 1;
              return (
                <div
                  key={pkg.id || idx}
                  className={`p-7 rounded-3xl flex flex-col justify-between space-y-6 transition-all relative ${
                    isPopular
                      ? "bg-white dark:bg-[#0B132B] border-2 border-indigo-600 shadow-xl shadow-indigo-600/10"
                      : "bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-sm"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-md">
                      {isAr ? "الأكثر طلباً" : "Most Popular"}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {pkg.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-3xl sm:text-4xl font-black font-mono text-slate-950 dark:text-white">
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1.5">
                        {isAr ? "ج.م" : "EGP"} / {billingCycle === "yearly" ? (isAr ? "سنوياً" : "year") : (isAr ? "شهرياً" : "month")}
                      </span>
                    </div>

                    <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {(pkg.features || []).map((feat: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/signup"
                    className={`w-full h-11 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center transition-all cursor-pointer ${
                      isPopular
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white"
                    }`}
                  >
                    <span>{isAr ? "ابدأ التجربة المجانية" : "Start Free Trial"}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            9. FAQ SECTION
            ======================================================== */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "إجابات على أكثر الاستفسارات شيوعاً حول النظام والتطبيق." : "Clear answers to essential questions."}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: isAr ? "هل يستمر الكاشير في البيع إذا انقطع الإنترنت في المحل؟" : "Can checkout proceed without internet?",
                a: isAr
                  ? "نعم، 100%! تطبيق الكاشير يعمل محلياً بالكامل على جهاز الكمبيوتر بدون أي اعتماد على اتصال الإنترنت. يتم تسجيل المبيعات وطباعة الفواتير بسرعة فائقة، وعند عودة الإنترنت يتم رفع كافة الفواتير للسحابة تلقائياً دون أي تدخل يدوي."
                  : "Yes, completely! The POS app runs offline locally on your device. Receipts print instantly and data syncs back to cloud once internet is available."
              },
              {
                q: isAr ? "ما هي الأجهزة والطابعات المتوافقة مع النظام؟" : "Which printers and hardware are supported?",
                a: isAr
                  ? "يتوافق البرنامج مع جميع أجهزة الكمبيوتر التي تعمل بنظام Windows 10 أو 11 (64-bit)، ويدعم مباشرة كافة طابعات الفواتير الحرارية مقاس 58mm و 80mm عبر USB والشبكة، بالإضافة إلى قارئات الباركود وأدراج النقدية."
                  : "Windows 10/11 64-bit devices, ESC/POS thermal printers (58mm/80mm), USB/wireless barcode scanners, and standard cash drawers."
              },
              {
                q: isAr ? "هل يمكنني نقل بيانات منتجاتي وأسعاري القديمة من ملف Excel؟" : "Can I import existing products from Excel?",
                a: isAr
                  ? "نعم، يوفر النظام أداة استيراد وتصدير ذكية لملفات الإكسيل تمكنك من رفع آلاف الأصناف والأسعار والمخزون في أقل من دقيقة، وفريق الدعم الفني جاهز لمساعدتك في استيراد البيانات مجاناً."
                  : "Yes, an intuitive Excel bulk import tool allows you to upload thousands of SKUs and starting stock within minutes."
              },
              {
                q: isAr ? "كيف أتابع مبيعات فروع محلي من هاتفي؟" : "How do I monitor sales from my smartphone?",
                a: isAr
                  ? "يوفر النظام لوحة تحكم سحابية تعمل على متصفح الموبايل بسلاسة، تمنحك إجمالي المبيعات اللحظية، الأرباح، ورصيد الخزائن في كافة الفروع من أي مكان في العالم."
                  : "You get a responsive cloud dashboard on your mobile browser giving live multi-branch revenue and drawer balances."
              }
            ].map((faq, idx) => {
              const isOpen = openFAQ === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFAQ(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-right font-black text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            10. FINAL CONVERSION CTA (Shopify-style high-impact closure)
            ======================================================== */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="p-10 sm:p-14 rounded-3xl bg-indigo-600 dark:bg-indigo-950/80 border border-indigo-500/30 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
              {isAr ? "جاهز لتطوير إدارة محلك وفروعك؟" : "Ready to Elevate Your Retail Business?"}
            </h2>
            
            <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto font-medium">
              {isAr
                ? "ابدأ نسختك التجريبية المجانية اليوم خلال دقيقتين. كاشير سريع، مبيعات بدون انقطاع، وتحكم كامل في المخزون والأرباح."
                : "Launch your 14-day free trial in under 2 minutes. No credit card required."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto h-12 px-8 rounded-xl text-xs sm:text-sm font-black bg-white text-indigo-950 hover:bg-slate-100 shadow-lg active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isAr ? "ابدأ التجربة المجانية الآن" : "Start Free Trial Now"}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/201099600048"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-12 px-6 rounded-xl text-xs sm:text-sm font-bold bg-indigo-700/60 hover:bg-indigo-700 text-white border border-white/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>{isAr ? "تحدث مع خبير المبيعات" : "Talk to Sales"}</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Modern Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#070D1E] py-12 px-4 sm:px-6 lg:px-8 text-xs font-medium text-slate-500" dir={isAr ? "rtl" : "ltr"}>
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/cdn/Asset 1.png" alt="Manzoma ERP" className="h-7 w-auto object-contain" />
            <span className="font-bold text-slate-700 dark:text-slate-300">منظومة ERP</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-slate-600 dark:text-slate-400">
            <Link to="/" className="hover:text-indigo-600">{isAr ? "الرئيسية" : "Home"}</Link>
            <Link to="/#features" className="hover:text-indigo-600">{isAr ? "المميزات" : "Features"}</Link>
            <Link to="/#pricing" className="hover:text-indigo-600">{isAr ? "الأسعار" : "Pricing"}</Link>
            <Link to="/download" className="hover:text-indigo-600">{isAr ? "تحميل البرنامج" : "Download"}</Link>
            <Link to="/academy" className="hover:text-indigo-600">{isAr ? "الأكاديمية" : "Academy"}</Link>
            <Link to="/blog" className="hover:text-indigo-600">{isAr ? "المدونة" : "Blog"}</Link>
          </div>
          <div>
            © {new Date().getFullYear()} Manzoma ERP. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>
        </div>
      </footer>
    </div>
  );
}
