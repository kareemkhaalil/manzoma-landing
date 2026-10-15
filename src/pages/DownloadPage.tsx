import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Monitor,
  ShieldCheck,
  Zap,
  WifiOff,
  RefreshCw,
  Printer,
  CheckCircle2,
  HardDrive,
  Cpu,
  Layers,
  ChevronDown,
  ExternalLink,
  MessageSquareText,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  Info
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { useAdminStore } from "../store/adminStore";
import { useSEO } from "../hooks/useSEO";

export default function DownloadPage() {
  const { language, config } = useAdminStore();
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"features" | "install" | "specs" | "changelog">("features");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO({
    title: isAr ? "تحميل برنامج المنظومة لسطح المكتب | Manzoma ERP Desktop" : "Download Manzoma ERP Desktop Edition",
    description: isAr 
      ? "حمّل النسخة الرسمية الأحدث من برنامج المنظومة ERP لأجهزة الكمبيوتر والويندوز. أوفلاين 100% مع مزامنة سحابية ودعم مباشر للطابعات والباركود."
      : "Download the official latest release of Manzoma ERP for Windows Desktop. 100% Offline with Cloud Sync and hardware support.",
    keywords: "download, manzoma erp, desktop app, pos offline, windows 11, point of sale software",
  });

  const appVersion = config.download?.version || "v1.5.0";
  const releaseDate = config.download?.releaseDate || "سبتمبر 2026";
  const fileSize = config.download?.fileSize || "225 MB";
  const downloadUrl = config.download?.windowsUrl || "https://github.com/kareemkhaalil/manzoma-erp-release/releases/download/v1.5.0/Manzoma.ERP-Setup-1.5.0.exe";
  const fileSha256 = config.download?.fileSha256 || "N/A";

  const keyFeatures = [
    {
      icon: WifiOff,
      title: isAr ? "أوفلاين 100% بدون انقطاع" : "100% Offline-First",
      desc: isAr 
        ? "قاعدة بيانات SQLite محلية مدمجة تجعل الكاشير يسجل المبيعات ويطبع الفواتير بأقصى سرعة حتى لو انقطع الإنترنت لأيام."
        : "Local embedded SQLite database keeps sales running with zero lag even if the internet is down for days.",
      color: "from-blue-500/20 to-indigo-500/10 text-indigo-600 dark:text-indigo-400"
    },
    {
      icon: RefreshCw,
      title: isAr ? "مزامنة سحابية تفاضلية ذكية" : "Smart Delta Cloud Sync",
      desc: isAr 
        ? "محرك مزامنة غير متزامن يرفع الفواتير وحركات المخزون للـ VPS السحابي فور عودة الاتصال تلقائياً لمنع أي تضارب."
        : "Asynchronous sync engine pushes invoices and ledger movements to cloud VPS as soon as connectivity resumes.",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      icon: Printer,
      title: isAr ? "ربط مباشر مع الطابعات والباركود" : "Thermal & Barcode Ready",
      desc: isAr 
        ? "دعم فوري لكافة طابعات الفواتير الحرارية (58mm و 80mm) بدون قص الحواف، وطابعات الباركود ودرج النقدية."
        : "Native printing to 58mm/80mm thermal receipt rolls, barcode sticker printers, and cash drawers.",
      color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      icon: ShieldCheck,
      title: isAr ? "حماية العتاد وبصمة الجهاز HWID" : "Node-Locked Hardware Security",
      desc: isAr 
        ? "ترخيص مشفر يرتبط بالبصمة الفيزيائية للكمبيوتر مع حماية متقدمة ضد التلاعب بساعة النظام وعقد إيجار أوفلاين آمن."
        : "Cryptographic hardware fingerprint locking with anti-clock rollback protection and secure offline lease tokens.",
      color: "from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400"
    },
    {
      icon: Zap,
      title: isAr ? "تحديثات تلقائية في الخلفية" : "Silent Background Auto-Updates",
      desc: isAr 
        ? "البرنامج يفحص التحديثات تلقائياً ويقوم بتحميل الميزات الجديدة في الخلفية وتطبيقها بسلاسة دون مسح أي بيانات."
        : "Built-in auto-updater downloads new features and security patches in background without losing local data.",
      color: "from-purple-500/20 to-violet-500/10 text-purple-600 dark:text-purple-400"
    },
    {
      icon: MessageSquareText,
      title: isAr ? "منصة واتساب التسويقية المدمجة" : "Integrated WhatsApp Hub",
      desc: isAr 
        ? "إرسال إيصالات وفواتير الـ PDF عبر الواتساب للعميل تلقائياً، مع أتمتة العروض والرسائل المشروطة وإدارة المجموعات."
        : "Send automatic WhatsApp receipt PDFs, run conditional marketing automations, and manage VIP customer groups.",
      color: "from-green-500/20 to-emerald-500/10 text-green-600 dark:text-green-400"
    }
  ];

  const installSteps = [
    {
      step: "01",
      title: isAr ? "تحميل ملف التثبيت" : "Download the Installer",
      desc: isAr 
        ? "اضغط على زر التحميل للحصول على ملف التثبيت المعتمد (Manzoma-ERP-Setup.exe) بحجم 86 ميجابايت."
        : "Click the download button to get the official installer package (Manzoma-ERP-Setup.exe)."
    },
    {
      step: "02",
      title: isAr ? "التثبيت الصامت بنقرة واحدة" : "One-Click Quick Install",
      desc: isAr 
        ? "افتح الملف ليتم تثبيت النظام تلقائياً وإنشاء اختصار مباشر على سطح المكتب وقائمة ابدأ في 10 ثوانٍ."
        : "Run the setup file. It installs silently and creates desktop and start menu shortcuts in 10 seconds."
    },
    {
      step: "03",
      title: isAr ? "التفعيل وبدء العمل أوفلاين" : "Activate & Start Selling",
      desc: isAr 
        ? "أدخل كود التفعيل الخاص بفرعك، وسيعمل البرنامج فوراً محلياً ويستقبل المزامنة من السحابة بسلاسة."
        : "Enter your branch activation key. The app launches immediately with full offline capabilities."
    }
  ];

  const systemSpecs = [
    { label: isAr ? "نظام التشغيل المدعوم" : "Operating System", value: "Windows 10 / Windows 11 (64-bit)" },
    { label: isAr ? "المعالج المطلوب (CPU)" : "Processor", value: "Intel Core i3 / AMD Ryzen 3 أو أعلى" },
    { label: isAr ? "الذاكرة العشوائية (RAM)" : "Memory (RAM)", value: "4 GB كحد أدنى (يوصى بـ 8 GB)" },
    { label: isAr ? "المساحة التخزينية" : "Disk Space", value: "500 MB مساحة شاغرة على القرص الصلب" },
    { label: isAr ? "الشاشة والدقة" : "Display Resolution", value: "1280 × 720 أو أعلى (دعم كامل للشاشات اللمسية)" },
    { label: isAr ? "توافق الطابعات" : "Printers Support", value: "ESC/POS Thermal (58mm / 80mm), USB, Network LAN, Bluetooth" },
    { label: isAr ? "أجهزة قراءة الباركود" : "Barcode Scanners", value: "جميع أجهزة قراءة الباركود اللاسلكية و USB (1D / 2D / QR)" },
    { label: isAr ? "محرك البيانات المحلي" : "Embedded Local Database", value: "High-Performance Embedded SQLite Node" }
  ];

  const changelog = [
    {
      ver: "v1.4.0 (الإصدار الحالي)",
      date: "سبتمبر 2026",
      items: [
        isAr ? "إطلاق منصة الواتساب التسويقية المتكاملة مع Baileys Engine وأتمتة المجموعات." : "Launched WhatsApp Marketing Hub with Baileys Engine and group automations.",
        isAr ? "دعم قوالب الفواتير المخصصة لطابعات 58mm و 80mm بدون قص الأطراف." : "Added thermal receipt templates optimized for 58mm/80mm without clipped edges.",
        isAr ? "محرك المزامنة التفاضلية Delta Stock Ledger لمنع تعارضات المخزون." : "Engineered Delta Stock Ledger to eliminate inventory overwrite conflicts.",
        isAr ? "ترقية نظام أمان العتاد HWID وكشف التلاعب بساعة الويندوز." : "Enhanced HWID hardware security with anti-clock tampering protection."
      ]
    },
    {
      ver: "v1.3.5",
      date: "أغسطس 2026",
      items: [
        isAr ? "تحسين سرعة معالجة الفواتير في الـ POS لأقل من 0.05 ثانية." : "Boosted POS checkout latency to sub-50ms.",
        isAr ? "دعم فواتير الاستبدال والمرتجعات المتزامنة في نفس الفاتورة." : "Added multi-item exchange & return transactions in a single receipt.",
        isAr ? "إضافة الصندوق الأسود BlackBox Logger لتسجيل الأحداث أوفلاين." : "Integrated BlackBox local audit logger."
      ]
    }
  ];

  const faqs = [
    {
      q: isAr ? "هل يتوقف البرنامج إذا انقطع الإنترنت في المحل؟" : "Will the POS stop working if internet is disconnected?",
      a: isAr 
        ? "نهائياً! البرنامج مصمم بمعمارية Offline-First حقيقية، حيث تخزن كافة البيانات والمنتجات في قاعدة بيانات محلية سريعة، ويتم طباعة الفواتير والبيع بشكل طبيعي 100%، وعند عودة الإنترنت يتم رفع كل الفواتير للسحابة تلقائياً."
        : "Never! The system is built with true Offline-First architecture. Local embedded database processes all sales and receipt printing seamlessly, syncing back to cloud once internet returns."
    },
    {
      q: isAr ? "كيف يتم تفعيل البرنامج على جهاز الكاشير؟" : "How is the license activated on the terminal?",
      a: isAr 
        ? "بمجرد تثبيت البرنامج، يولد النظام بصمة عتاد فريدة لجهازك (HWID)، ثم تدخل كود التفعيل الممنوح لك في باقتك ليتم ربط الجهاز وبدء العمل فوراً."
        : "Upon installation, the app generates an immutable hardware fingerprint (HWID). Enter your subscription serial key to bind the device and activate instantly."
    },
    {
      q: isAr ? "كيف تعمل التحديثات التلقائية؟" : "How do automatic updates work?",
      a: isAr 
        ? "يقوم البرنامج بفحص وجود إصدارات جديدة عند الاتصال بالإنترنت، ويقوم بتحميل التحديث وتثبيته في ثانيتين عند إعادة تشغيل البرنامج دون أي تدخل يدوي ودون أي مساس ببياناتك."
        : "The built-in updater checks for new releases, downloads updates in the background, and applies them upon restart without affecting local data."
    },
    {
      q: isAr ? "هل يمكن ربط أكثر من نقطة بيع (كاشير) في نفس الفرع؟" : "Can I connect multiple POS terminals in the same store?",
      a: isAr 
        ? "نعم، تدعم المنظومة شبكة الكاشيرات المتعددة في نفس الفرع عبر الخادم المحلي (Local Hub) والربط مع السيرفر السحابي المركزي."
        : "Yes, multi-terminal LAN networking is supported, syncing across local registers and the master cloud database."
    }
  ];

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen flex flex-col font-sans relative antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex-grow flex flex-col space-y-20">
        
        {/* ================= HERO SECTION ================= */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto space-y-8 pt-8">
          
          {/* Version Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              {isAr ? `الإصدار الرسمي الأحدث ${appVersion} متوفر الآن` : `Official Release ${appVersion} is now available`}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Windows 64-bit
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl font-[900] tracking-tight leading-[1.1]" style={{ color: "var(--text-1)" }}>
            {isAr ? "برنامج المنظومة لسطح المكتب" : "Manzoma ERP for Desktop"} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              {isAr ? "قوة الأوفلاين ومرونة السحابة" : "Offline Power, Cloud Flexibility"}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp} className="text-base sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-2)" }}>
            {isAr 
              ? "نظام نقاط بيع وإدارة متكامل مصمم للعمل بأقصى سرعة واستقرار بدون إنترنت، مع مزامنة سحابية تلقائية ودعم مباشر للطابعات والباركود."
              : "Enterprise Point of Sale engineered for unmatched speed, 100% offline reliability, and automated cloud sync."}
          </motion.p>

          {/* Download Box Card */}
          <motion.div variants={fadeUp} className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden text-center space-y-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="space-y-2">
              <div className="inline-flex p-4 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 mb-2">
                <Monitor className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black" style={{ color: "var(--text-1)" }}>
                Manzoma ERP {appVersion} for Windows
              </h3>
              <p className="text-xs font-bold text-slate-500">
                {isAr ? `تاريخ الإصدار: ${releaseDate} • الحجم: ${fileSize}` : `Release Date: ${releaseDate} • Size: ${fileSize}`}
              </p>
              <div className="pt-1">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 select-all inline-block max-w-full truncate">
                  SHA-256: {fileSha256}
                </span>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={downloadUrl}
                className="w-full sm:w-auto h-14 px-8 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-3 text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 animate-bounce" />
                <span>{isAr ? "تحميل برنامج الويندوز (Setup.exe)" : "Download for Windows (.exe)"}</span>
              </a>

              <a
                href="https://app.manzoma.online"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-14 px-6 rounded-2xl text-sm font-bold inline-flex items-center justify-center gap-2 border hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
                style={{ borderColor: "var(--border)", color: "var(--text-1)" }}
              >
                <span>{isAr ? "تجربة النسخة السحابية" : "Live Web Demo"}</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </div>

            {/* Badges under download button */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? "حزمة أصلية مفحوصة" : "Clean Verified Package"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{isAr ? "تحديثات صامتة تلقائية" : "Auto-Updates Included"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>{isAr ? "تجربة مجانية 14 يوم" : "14-Day Free Trial"}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex justify-center border-b pb-4" style={{ borderColor: "var(--border)" }}>
          <div className="inline-flex p-1.5 rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            {[
              { id: "features", label: isAr ? "المميزات الخارقة" : "Superpowers", icon: Sparkles },
              { id: "install", label: isAr ? "دليل التثبيت السريع" : "Installation Guide", icon: Download },
              { id: "specs", label: isAr ? "المواصفات الفنية" : "System Specs", icon: Cpu },
              { id: "changelog", label: isAr ? "سجل التحديثات" : "Changelog", icon: Layers },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= TAB 1: FEATURES ================= */}
        {activeTab === "features" && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black mb-3" style={{ color: "var(--text-1)" }}>
                    {feat.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ================= TAB 2: INSTALLATION GUIDE ================= */}
        {activeTab === "install" && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8 max-w-4xl mx-auto w-full">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-1)" }}>
                {isAr ? "التثبيت والتشغيل في 3 خطوات فقط" : "Install in 3 Simple Steps"}
              </h2>
              <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                {isAr ? "لا يتطلب خبرة فنية، كل شيء مجهز للعمل تلقائياً." : "No technical expertise required. Fully automated setup."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {installSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="p-6 rounded-3xl border shadow-sm relative overflow-hidden text-center space-y-4"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                >
                  <span className="text-4xl font-black text-indigo-600/30 dark:text-indigo-400/30">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-black" style={{ color: "var(--text-1)" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* SmartScreen Warning Guidance */}
            <div className="p-5 rounded-2xl border bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-right space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-200 text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{isAr ? "ملاحظة هامة عند التثبيت لأول مرة على Windows 10 / 11:" : "First-time installation note on Windows 10/11:"}</span>
              </div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 leading-relaxed">
                {isAr 
                  ? "نظراً لأن النسخة تصدر مباشرة من السيرفر المعتمد، قد تظهر رسالة الحماية الزرقاء (Windows protected your PC). للمتابعة: اضغط على 'المزيد من المعلومات (More info)' ثم اختر 'تشغيل على أية حال (Run anyway)'."
                  : "If Windows SmartScreen displays 'Windows protected your PC', click 'More info' and then select 'Run anyway' to complete the installation."}
              </p>
            </div>

            {/* Need Help Box */}
            <div className="p-6 rounded-2xl border bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-right">
                <Info className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <div className="text-sm font-black text-indigo-950 dark:text-indigo-200">
                    {isAr ? "تحتاج مساعدة في التثبيت أو ربط الطابعات؟" : "Need help with setup or printer connection?"}
                  </div>
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    {isAr ? "فريق الدعم الفني متاح لمساعدتك عبر AnyDesk أو الواتساب فوراً." : "Our support team is available via AnyDesk or WhatsApp."}
                  </div>
                </div>
              </div>
              <a
                href="https://wa.me/201012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-6 rounded-xl text-xs font-black inline-flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-500 shrink-0 shadow-lg shadow-indigo-600/20"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>{isAr ? "تواصل مع الدعم الفني" : "Chat with Support"}</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 3: SYSTEM SPECS ================= */}
        {activeTab === "specs" && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto w-full space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-1)" }}>
                {isAr ? "المواصفات الفنية ومتطلبات التشغيل" : "Technical Specifications"}
              </h2>
              <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                {isAr ? "يعمل البرنامج بكفاءة عالية حتى على الأجهزة الاقتصادية." : "Engineered to run super fast even on budget hardware."}
              </p>
            </div>

            <div className="rounded-3xl border overflow-hidden shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <table className="w-full text-sm">
                <tbody>
                  {systemSpecs.map((spec, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-500/5 transition-colors" style={{ borderColor: "var(--border)" }}>
                      <td className="p-4 font-black w-1/3 text-slate-500 dark:text-slate-400">
                        {spec.label}
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-100">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 4: CHANGELOG ================= */}
        {activeTab === "changelog" && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto w-full space-y-8">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-1)" }}>
                {isAr ? "سجل التحديثات والإصدارات" : "Release Notes & Changelog"}
              </h2>
              <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                {isAr ? "تحديثات دورية مستمرة لتحسين الأداء وإضافة الميزات." : "Continuous improvements and feature releases."}
              </p>
            </div>

            <div className="space-y-6">
              {changelog.map((entry, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="p-6 rounded-3xl border shadow-sm space-y-4"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border)" }}>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{entry.ver}</span>
                    <span className="text-xs font-bold text-slate-500">{entry.date}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {entry.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: "var(--text-2)" }}>
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= FAQ SECTION ================= */}
        <div className="max-w-3xl mx-auto w-full space-y-6 pt-12 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-1)" }}>
              {isAr ? "الأسئلة الشائعة حول برنامج الديسكتوب" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border overflow-hidden transition-all"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-right flex items-center justify-between font-black text-sm sm:text-base cursor-pointer"
                    style={{ color: "var(--text-1)" }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 border-t pt-3"
                        style={{ borderColor: "var(--border)" }}
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= FINAL CTA ================= */}
        <div className="p-8 sm:p-12 rounded-3xl text-center space-y-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black">
              {isAr ? "جاهز لتحويل مبيعات متجرك إلى السرعة القصوى؟" : "Ready to Supercharge Your Retail POS?"}
            </h2>
            <p className="text-sm sm:text-base font-medium text-white/80">
              {isAr 
                ? "حمّل البرنامج الآن وجرب كافة الميزات مجاناً لمدة 14 يوماً بدون أي التزام."
                : "Download now and try all premium features free for 14 days."}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={downloadUrl}
                className="h-14 px-8 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-3 bg-white text-indigo-950 hover:bg-slate-100 shadow-xl active:scale-95 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>{isAr ? "تحميل فوري لنسخة الويندوز" : "Instant Windows Download"}</span>
              </a>
              <Link
                to="/signup"
                className="h-14 px-8 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 active:scale-95 transition-all"
              >
                <span>{isAr ? "إنشاء حساب سحابي" : "Create Cloud Account"}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
