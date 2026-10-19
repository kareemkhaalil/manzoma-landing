import React, { useState } from "react";
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
  WifiOff,
  Package,
  Layers,
  Receipt,
  Printer,
  Calculator,
  MessageSquare,
  Download,
  Barcode,
  Play,
  Shirt,
  Store,
  Home as HomeIcon,
  User,
  Users,
  Smartphone,
  CheckSquare
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";
import { useSchema } from "../hooks/useSchema";
import Navbar from "../components/landing/Navbar";
import MarqueeTape from "../components/landing/MarqueeTape";
import TestimonialsSwiper from "../components/landing/TestimonialsSwiper";

export default function LandingPage() {
  const store = useAdminStore();
  const config = store.config;
  const packages = store.packages;
  const language = store.language;

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

  // States
  const [heroContact, setHeroContact] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [activeSegment, setActiveSegment] = useState<"fashion" | "homeware" | "retail">("fashion");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroContact.trim()) return;
    window.location.href = `/signup?contact=${encodeURIComponent(heroContact)}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Dynamic Navbar with theme="blue" for the Hero header */}
      <Navbar theme="blue" />

      <main className="w-full flex-grow space-y-20 sm:space-y-28 pb-20">
        
        {/* ========================================================
            1. THE GABRUN-INSPIRED BLUE HERO CANVAS
            ======================================================== */}
        <section className="pt-2 sm:pt-4 px-3 sm:px-6 max-w-[1360px] mx-auto w-full">
          <div className="rounded-[2.2rem] sm:rounded-[3rem] bg-gradient-to-b from-[#0F4CE6] via-[#1B5CF0] to-[#3B82F6] text-white pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-10 lg:px-12 relative overflow-hidden shadow-2xl shadow-blue-600/25">
            
            {/* Tech Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

            {/* Glowing Depth Blur */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Hero Main Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-xs font-bold text-white shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                <span>{isAr ? "منظومة كاشير ومخازن للتجزئة" : "Manzoma Retail ERP & POS"}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-[900] tracking-tight leading-[1.12] text-white">
                {isAr ? "إدارة مبيعات ومخازن محلك" : "Make Your Retail Business Fast"}{" "}
                <br />
                <span>{isAr ? "بأقصى سرعة وأمان، مع" : "and Secure, with"}{" "}</span>
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-1 rounded-2xl border border-white/30 text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-300" />
                  {isAr ? "منظومة" : "Manzoma"}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 max-w-2xl mx-auto leading-relaxed">
                {isAr
                  ? "كاشير سريع ومستقر يعمل 100% بدون إنترنت، مصفوفة متطورة للمقاسات والألوان، طباعة إيصالات فورية، وتقارير أرباح موحدة على هاتفك."
                  : "High-velocity cashier that operates 100% offline, smart variant matrix, thermal receipt printing, and real-time consolidated reporting."}
              </p>

              {/* Pill Input & CTA Container (Exact match to Gabrun design) */}
              <div className="max-w-md mx-auto pt-2">
                <form onSubmit={handleHeroSubmit} className="h-14 p-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/35 shadow-2xl flex items-center gap-2">
                  <input
                    type="text"
                    value={heroContact}
                    onChange={(e) => setHeroContact(e.target.value)}
                    placeholder={isAr ? "أدخل رقم هاتفك لتجربة النظام..." : "Enter phone or email to start..."}
                    className="flex-1 bg-transparent px-4 text-xs sm:text-sm text-white placeholder-white/70 outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="h-11 px-5 sm:px-6 rounded-full bg-slate-950 text-white hover:bg-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isAr ? "ابدأ الآن" : "Get Started"}</span>
                  </button>
                </form>
              </div>

              {/* ================= 3 OVERLAPPING FLOATING CARDS ================= */}
              <div className="relative max-w-4xl mx-auto pt-8 sm:pt-12">
                
                {/* Center Elevated Card */}
                <div className="relative z-20 max-w-sm sm:max-w-md mx-auto rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-2xl shadow-blue-950/40 border border-white/80 text-right">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-bold block">{isAr ? "فاتورة مبيعات كاشير" : "Cashier Checkout"}</span>
                        <span className="text-sm font-black text-slate-800">#REC-001643</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      {isAr ? "أوفلاين 100%" : "Offline Mode"}
                    </span>
                  </div>

                  <div className="py-4 space-y-1">
                    <span className="text-xs text-slate-400 font-bold block">{isAr ? "إجمالي الإيراد المسجل" : "Total Revenue"}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-mono text-slate-950">35,400.00</span>
                      <span className="text-xs font-bold text-slate-500">ج.م (EGP)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>{isAr ? "وسيلة الدفع: نقدي / فيزا / محفظة" : "Payment: Cash & Digital"}</span>
                    </div>
                    <span className="text-emerald-600 font-black">{isAr ? "مطابقة" : "Balanced"}</span>
                  </div>
                </div>

                {/* Left Offset Card */}
                <div className="hidden md:block absolute -left-4 bottom-2 z-10 w-64 rounded-3xl bg-white/95 text-slate-900 p-5 shadow-xl border border-white/60 backdrop-blur-md text-right">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">+10,000 تاجر</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-slate-500 font-bold block">{isAr ? "سرعة إتمام الفاتورة" : "Checkout Latency"}</span>
                  <span className="text-xl font-black font-mono text-slate-900">0.04 ثانية</span>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isAr ? "طباعة حرارية لحظية" : "Instant thermal print"}</span>
                  </div>
                </div>

                {/* Right Offset Card */}
                <div className="hidden md:block absolute -right-4 bottom-2 z-10 w-64 rounded-3xl bg-white/95 text-slate-900 p-5 shadow-xl border border-white/60 backdrop-blur-md text-right">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                      أح
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">{isAr ? "أحمد سامي" : "Ahmed Sami"}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{isAr ? "كاشير فرع 1 — الوردية نشطة" : "Active Shift Register"}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-bold block">{isAr ? "مبيعات الوردية الحالية" : "Current Shift Sales"}</span>
                  <span className="text-xl font-black font-mono text-slate-900">14,250.00 ج.م</span>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            2. TRUSTED BY LOGOS BAR
            ======================================================== */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-xs sm:text-sm font-black text-slate-600 dark:text-slate-400">
            {isAr ? "موثوق به من قِبل أكثر من" : "Trusted By More Than"}{" "}
            <span className="text-blue-600 dark:text-blue-400 font-mono">+10,000</span>{" "}
            {isAr ? "تاجر ومحل تجاري" : "Users & Retailers"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 pt-2 opacity-70">
            {["فودافون كاش", "فوري", "ميزة", "فيزا / ماستركارد", "إنستاباي", "البنك الأهلي"].map((partner, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-black text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {partner}
              </span>
            ))}
          </div>
        </section>

        {/* ========================================================
            3. SECTION: GET THE MOST POWERFUL AND EASY TO USE POS
            ======================================================== */}
        <section id="categories" className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{isAr ? "سهولة وسرعة فائقة" : "Easy to Use"}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] text-slate-950 dark:text-white tracking-tight">
              {isAr ? "النظام الأقوى و" : "Get The Most Powerful and"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {isAr ? "الأسهل استخداماً" : "Easy to Use"}
              </span>{" "}
              {isAr ? "لإدارة متجرك" : "Software"}
            </h2>

            {/* Segment Switcher Pills */}
            <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 mt-2">
              {[
                { id: "fashion", label: isAr ? "محلات الملابس" : "Fashion Stores" },
                { id: "homeware", label: isAr ? "الأدوات المنزلية" : "Home Goods" },
                { id: "retail", label: isAr ? "التجزئة والسوبرماركت" : "Retail & POS" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSegment(tab.id as any)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeSegment === tab.id
                      ? "bg-white dark:bg-[#0B132B] text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Overlapping Horizontal Cards (Recreated exactly from Gabrun image) */}
          <div className="relative max-w-5xl mx-auto pt-4">
            
            {/* Subtle flow connector line behind cards */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent -translate-y-1/2 -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Inactive Card */}
              <div className="hidden md:block md:col-span-3 p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 shadow-sm opacity-60 text-right space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <HomeIcon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm text-slate-800 dark:text-white">
                  {isAr ? "الأدوات المنزلية" : "Home Goods"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? "تكويد آلاف الأصناف بالباركود والجرد الدوري." : "Organized SKUs and stock audits."}
                </p>
              </div>

              {/* Center Active Highlighted Card (Gabrun signature blue glass) */}
              <div className="md:col-span-6 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#124CE6] to-[#2563EB] text-white shadow-2xl shadow-blue-600/30 text-right space-y-5 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  {activeSegment === "fashion" ? <Shirt className="w-6 h-6" /> : activeSegment === "homeware" ? <HomeIcon className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-[900]">
                    {activeSegment === "fashion" && (isAr ? "محلات الملابس والأحذية" : "Fashion & Footwear Stores")}
                    {activeSegment === "homeware" && (isAr ? "الأدوات المنزلية والمفروشات" : "Home Goods & Kitchenware")}
                    {activeSegment === "retail" && (isAr ? "متاجر التجزئة والسوبرماركت" : "Retail & POS Terminals")}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                    {activeSegment === "fashion" && (isAr ? "إدارة متطورة لمصفوفة المقاسات والألوان، طباعة ملصقات الباركود بضغطة زر واحدة، وكاشير سريع ومستقر أوفلاين 100% مع تنظيم فواتير المرتجعات." : "Advanced size/color matrix, one-click barcode generation, and 100% offline cashier.")}
                    {activeSegment === "homeware" && (isAr ? "تنظيم آلاف الأصناف المتنوعة بالاسم والباركود، مع تنبيهات تلقائية عند اقتراب نفاد المخزون وجرد مرن بالسكانر دون إيقاف البيع." : "Manage diverse inventory with real-time low-stock alerts and flexible scanner audits.")}
                    {activeSegment === "retail" && (isAr ? "بيع سريع وموثوق من الكاشير حتى بدون إنترنت، تسجيل الخصومات باسم الكاشير المسؤول، وتقفيل دقيق للوردية والخزينة." : "Offline fast checkout, cashier-attributed discounts, and shift drawer balancing.")}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/20">
                  <span className="text-xs font-bold text-white/80">
                    {isAr ? "+10,000 عملية بيع يومياً" : "+10k daily sales"}
                  </span>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 text-xs font-black bg-white text-blue-900 px-4 py-2 rounded-xl shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <span>{isAr ? "اعرف المزيد" : "Learn More"}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Inactive Card */}
              <div className="hidden md:block md:col-span-3 p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 shadow-sm opacity-60 text-right space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm text-slate-800 dark:text-white">
                  {isAr ? "التجزئة العامة" : "General Retail"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? "بيع سريع وتقفيل ورديات ومطابقة الخزينة." : "Fast checkout and shift cash closing."}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            4. SECTION: REWARDS THAT ARE ENDLESSLY REWARDING (Invoices & POS)
            ======================================================== */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{isAr ? "سرعة إصدار الفواتير" : "Instant Invoices"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] text-slate-950 dark:text-white tracking-tight">
              {isAr ? "فواتير لحظية وطباعة" : "Transactions That are Endlessly"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {isAr ? "فورية" : "Fast & Rewarding"}
              </span>{" "}
              {isAr ? "لكل حركة بيع" : "For Every Sale"}
            </h2>

            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
              {isAr
                ? "طباعة الإيصالات الحرارية في أجزاء من الثانية مع إرسال الفاتورة الرقمية لواتساب العميل تلقائياً."
                : "Print thermal receipts instantly and auto-dispatch digital invoices to WhatsApp."}
            </p>
          </div>

          {/* Center Floating Invoice Card (Recreated from Gabrun image) */}
          <div className="max-w-xl mx-auto">
            <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-blue-500/10 text-right space-y-6 relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">{isAr ? "فاتورة مبيعات معتمدة" : "Official Invoice"}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">#REC-001643</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xl sm:text-2xl font-black font-mono text-blue-600 dark:text-blue-400 block">350.00 ج.م</span>
                  <span className="text-[10px] text-slate-400 font-bold">25 سبتمبر 2026</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                    <span className="text-slate-400 block font-bold">{isAr ? "الكاشير المسؤول:" : "Cashier:"}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">أحمد سامي (كاشير 1)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                    <span className="text-slate-400 block font-bold">{isAr ? "طريقة الدفع:" : "Payment Method:"}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">نقدي (كاش)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">قميص كتان كاجوال (L / أزرق) × 1</span>
                  <span className="font-black font-mono text-slate-900 dark:text-white">350.00 ج.م</span>
                </div>
              </div>

              {/* Solid Blue Action Button (Exact match) */}
              <button
                type="button"
                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? "إصدار الفاتورة وطباعة الإيصال" : "Print & Issue Receipt"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. SECTION: KEEP YOUR MONEY SECURE ALWAYS (Shift Reconciliation & Security)
            ======================================================== */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{isAr ? "رقابة مالية محكمة" : "Financial Security"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] text-slate-950 dark:text-white tracking-tight">
              {isAr ? "حماية أموالك وتقفيل الخزائن" : "Keep Your Money Secure"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {isAr ? "بدقة متناهية" : "Always"}
              </span>
            </h2>

            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
              {isAr
                ? "مطابقة فورية لنقدية الدرج مع مبيعات النظام، توثيق كل خصم باسم الكاشير، ومنع أي عجز أو تلاعب."
                : "Exact cash drawer reconciliation, user-attributed discounts, and complete financial integrity."}
            </p>
          </div>

          {/* Connected Network Diagram (Faithfully recreating the node diagram from the Gabrun image) */}
          <div className="max-w-2xl mx-auto relative pt-4 pb-4">
            
            {/* Top Node: Store Manager */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-800 dark:text-slate-200">{isAr ? "مدير المتجر (إشراف مركزي)" : "Store Manager"}</span>
              </div>
              <div className="w-[1.5px] h-6 bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Central Balanced Card */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-2xl text-center space-y-4 max-w-md mx-auto relative z-10">
              <span className="text-xs text-slate-400 font-bold block">{isAr ? "إجمالي مبيعات الوردية" : "Total Shift Balance"}</span>
              <span className="text-3xl sm:text-4xl font-black font-mono text-slate-950 dark:text-white block">
                35,400.00 <span className="text-xs font-bold text-slate-500">ج.م</span>
              </span>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-xs">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold block">{isAr ? "نقدية الدرج (كاش)" : "Cash in Drawer"}</span>
                  <span className="font-black font-mono text-emerald-800 dark:text-emerald-200">24,500 ج.م</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 text-xs">
                  <span className="text-blue-700 dark:text-blue-300 font-bold block">{isAr ? "مدفوعات إلكترونية" : "Cards & Wallets"}</span>
                  <span className="font-black font-mono text-blue-800 dark:text-blue-200">10,900 ج.م</span>
                </div>
              </div>
            </div>

            {/* Connecting Horizontal Branch to Cashier Terminals */}
            <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto pt-6">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0">
                  ك1
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">{isAr ? "كاشير 1 (أحمد)" : "Terminal 1"}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{isAr ? "الخزينة مطابقة ✓" : "Balanced"}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs shrink-0">
                  ك2
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">{isAr ? "كاشير 2 (سامح)" : "Terminal 2"}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{isAr ? "الخزينة مطابقة ✓" : "Balanced"}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            6. SECTION: COLLECT ALL PAYMENTS WITHIN MINUTES (Multi-Branch)
            ======================================================== */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column (Content & Feature Pills) */}
            <div className="lg:col-span-6 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{isAr ? "تحكم مركزي متعدد الفروع" : "Multi-Branch Control"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] text-slate-950 dark:text-white tracking-tight leading-[1.15]">
                {isAr ? "إدارة كافة الفروع والمبيعات" : "Collect All Payments Within"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {isAr ? "في شاشة واحدة" : "Minutes"}
                </span>
              </h2>

              <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? "تابع تقارير أرباح محلاتك لحظة بلحظة من هاتفك أو جهازك، مع مزامنة سحابية تمنع أي تضارب بالمخزون وتمنحك السيطرة الكاملة على مبيعاتك أينما كنت."
                  : "Consolidated multi-branch reporting on your mobile browser. Delta cloud sync prevents inventory concurrency issues with 100% offline cashier resilience."}
              </p>

              {/* 4 Feature Pills at the bottom (Exact match) */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{isAr ? "كاشير أوفلاين 100%" : "Offline-First"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{isAr ? "مزامنة سحابية لحظية" : "Live Cloud Sync"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{isAr ? "جرد مستمر بالسكانر" : "Continuous Audit"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{isAr ? "دعم فني وتدريب مجاني" : "Certified Support"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sleek Smartphone/Terminal Card Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm rounded-[2.5rem] bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-5 text-right">
                
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-bold block">{isAr ? "إجمالي مبيعات الفروع الموحدة" : "Consolidated Branches"}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-slate-950 dark:text-white">48,250.00</span>
                    <span className="text-xs font-bold text-slate-500">ج.م</span>
                  </div>
                </div>

                {/* Card Graphic Simulation */}
                <div className="h-40 rounded-2xl bg-gradient-to-br from-[#124CE6] via-[#1E60F2] to-[#3B82F6] text-white p-5 flex flex-col justify-between shadow-lg">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">Manzoma Pay</span>
                    <CreditCard className="w-5 h-5 opacity-80" />
                  </div>
                  <div className="font-mono text-sm tracking-widest">
                    •••• •••• •••• 8901
                  </div>
                  <div className="flex justify-between text-[10px] text-white/80">
                    <span>فرع المهندسين</span>
                    <span>ACTIVE</span>
                  </div>
                </div>

                {/* Confirmation Status Pill (Exact match) */}
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? "تمت المزامنة والتأكيد بنجاح ✓" : "Payment Successfully Recorded"}</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            7. PRICING PLANS
            ======================================================== */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{isAr ? "باقات اشتراك واضحة" : "Transparent Pricing"}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-[900] text-slate-950 dark:text-white">
              {isAr ? "اختر الخطة المناسبة لحجم متجرك" : "Choose the Plan That Fits Your Store"}
            </h2>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {isAr ? "بدون رسوم خفية، مع إمكانية الترقية أو الإلغاء في أي وقت." : "No hidden fees. Upgrade or adjust your package at any time."}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-white dark:bg-[#0B132B] text-blue-600 dark:text-blue-400 shadow-sm"
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
                      ? "bg-white dark:bg-[#0B132B] border-2 border-blue-600 shadow-xl shadow-blue-600/10"
                      : "bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-sm"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-md">
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
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"
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
            8. TESTIMONIALS
            ======================================================== */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-[900] text-slate-950 dark:text-white">
              {isAr ? "تجار يثقون في منظومة يومياً" : "Trusted by Retail Merchants"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "آراء حقيقية من مديري وأصحاب المتاجر في مصر والعالم العربي." : "Real feedback from fashion, footwear, and retail store owners."}
            </p>
          </div>

          <TestimonialsSwiper />
        </section>

        {/* ========================================================
            9. FAQ ACCORDION
            ======================================================== */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-[900] text-slate-950 dark:text-white">
              {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "إجابات واضحة على أكثر استفسارات التجار شيوعاً." : "Clear answers to essential questions."}
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
            10. FINAL CONVERSION BANNER
            ======================================================== */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#1048DE] via-[#1B5CF0] to-[#3B82F6] text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] tracking-tight leading-tight max-w-3xl mx-auto">
              {isAr ? "جاهز لتطوير إدارة محلك وفروعك؟" : "Ready to Elevate Your Retail Business?"}
            </h2>
            
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto font-medium">
              {isAr
                ? "ابدأ نسختك التجريبية المجانية اليوم خلال دقيقتين. كاشير سريع، مبيعات بدون انقطاع، وتحكم كامل في المخزون والأرباح."
                : "Launch your 14-day free trial in under 2 minutes. No credit card required."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto h-12 px-8 rounded-full text-xs sm:text-sm font-black bg-white text-blue-950 hover:bg-slate-100 shadow-lg active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isAr ? "ابدأ التجربة المجانية الآن" : "Start Free Trial Now"}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/201099600048"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-12 px-6 rounded-full text-xs sm:text-sm font-bold bg-white/15 hover:bg-white/20 text-white border border-white/30 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <MessageSquare className="w-4 h-4 text-cyan-300" />
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
            <Link to="/" className="hover:text-blue-600">{isAr ? "الرئيسية" : "Home"}</Link>
            <Link to="/#categories" className="hover:text-blue-600">{isAr ? "القطاعات" : "Categories"}</Link>
            <Link to="/#pricing" className="hover:text-blue-600">{isAr ? "الأسعار" : "Pricing"}</Link>
            <Link to="/download" className="hover:text-blue-600">{isAr ? "تحميل البرنامج" : "Download"}</Link>
            <Link to="/academy" className="hover:text-blue-600">{isAr ? "الأكاديمية" : "Academy"}</Link>
            <Link to="/blog" className="hover:text-blue-600">{isAr ? "المدونة" : "Blog"}</Link>
          </div>
          <div>
            © {new Date().getFullYear()} Manzoma ERP. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>
        </div>
      </footer>
    </div>
  );
}
