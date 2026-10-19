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
  Cpu,
  Layers,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Check,
  Copy,
  Terminal,
  HelpCircle
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
  const [copiedSha, setCopiedSha] = useState(false);

  useSEO({
    title: isAr ? "تحميل برنامج المنظومة لسطح المكتب | Windows POS" : "Download Manzoma ERP Desktop for Windows",
    description: isAr
      ? "حمّل النسخة الرسمية الأحدث من برنامج المنظومة ERP لأجهزة الكمبيوتر والويندوز. أوفلاين 100% مع مزامنة سحابية ودعم مباشر لطابعات الفواتير والباركود."
      : "Download official release of Manzoma ERP for Windows Desktop. 100% offline POS with cloud sync and thermal printer support.",
    canonical: "https://manzoma.online/download",
    image: "https://manzoma.online/cdn/Asset%201.png",
  });

  const appVersion = config.download?.version || "v1.5.0";
  const releaseDate = config.download?.releaseDate || "سبتمبر 2026";
  const fileSize = config.download?.fileSize || "225 MB";
  const downloadUrl = config.download?.windowsUrl || "https://github.com/kareemkhaalil/manzoma-erp-release/releases/download/v1.5.0/Manzoma.ERP-Setup-1.5.0.exe";
  const fileSha256 = config.download?.fileSha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const copySha = () => {
    navigator.clipboard.writeText(fileSha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const desktopAdvantages = [
    {
      icon: WifiOff,
      title: isAr ? "أوفلاين 100% بدون انقطاع" : "100% Offline Resilience",
      desc: isAr
        ? "قاعدة بيانات محلية سريعة تجعل الكاشير يسجل المبيعات ويطبع الفواتير بلحظة واحدة حتى لو انقطع الإنترنت لأيام."
        : "Local embedded database keeps checkout running instantly even if your internet is completely disconnected."
    },
    {
      icon: RefreshCw,
      title: isAr ? "مزامنة سحابية تفاضلية ذكية" : "Smart Delta Cloud Sync",
      desc: isAr
        ? "محرك مزامنة غير متزامن يرفع الفواتير وحركات المخزون للسحابة فور توفر الاتصال دون التأثير على سرعة الكاشير."
        : "Asynchronous background engine syncs transactions to cloud VPS as soon as internet is detected."
    },
    {
      icon: Printer,
      title: isAr ? "توافق مباشر مع الطابعات والباركود" : "Thermal & Barcode Hardware",
      desc: isAr
        ? "دعم فوري لكافة طابعات الفواتير الحرارية (58mm و 80mm) بدون قص أطراف، وقارئات الباركود وأدراج النقدية."
        : "Direct USB and LAN driver support for 58mm/80mm receipt printers, barcode scanners, and cash drawers."
    },
    {
      icon: ShieldCheck,
      title: isAr ? "حماية العتاد وبصمة الجهاز HWID" : "Hardware Fingerprint Security",
      desc: isAr
        ? "ترخيص محمي وموثوق يرتبط بالبصمة الفيزيائية للكمبيوتر مع حماية ضد التلاعب بساعة الويندوز."
        : "Cryptographic device locking bound to motherboard fingerprint with anti-clock-rollback safeguards."
    }
  ];

  const installSteps = [
    {
      num: "01",
      title: isAr ? "تحميل ملف التثبيت المعتمد" : "Download Official Package",
      desc: isAr
        ? "اضغط على زر التحميل للحصول على ملف التثبيت المعتمد (Manzoma-ERP-Setup.exe) بحجم 225 ميجابايت."
        : "Click the download button to get the verified installer (Manzoma-ERP-Setup.exe)."
    },
    {
      num: "02",
      title: isAr ? "تثبيت تلقائي في 10 ثوانٍ" : "Instant 10-Second Install",
      desc: isAr
        ? "افتح الملف ليتم تثبيت التطبيق تلقائياً وإنشاء اختصار مباشر على سطح المكتب وقائمة ابدأ بنقرة واحدة."
        : "Run the setup file. It configures the local engine and desktop shortcut automatically."
    },
    {
      num: "03",
      title: isAr ? "التفعيل والبدء بالبيع فوراً" : "Activate & Start Selling",
      desc: isAr
        ? "أدخل كود التفعيل الممنوح لك في باقتك، وسيعمل البرنامج فوراً محلياً مع المزامنة مع السحابة."
        : "Enter your branch activation key to launch the POS terminal with full offline readiness."
    }
  ];

  const systemSpecs = [
    { label: isAr ? "نظام التشغيل المدعوم" : "Operating System", value: "Windows 10 / Windows 11 (64-bit)" },
    { label: isAr ? "المعالج المطلوب (CPU)" : "Processor", value: "Intel Core i3 / AMD Ryzen 3 أو أعلى" },
    { label: isAr ? "الذاكرة العشوائية (RAM)" : "RAM", value: "4 GB كحد أدنى (يوصى بـ 8 GB لتعدد المهام)" },
    { label: isAr ? "المساحة التخزينية" : "Disk Space", value: "500 MB مساحة خالية على القرص الصلب" },
    { label: isAr ? "الشاشات المدعومة" : "Display", value: "1280 × 720 فأعلى (دعم كامل للشاشات اللمسية Touchscreens)" },
    { label: isAr ? "طابعات الفواتير" : "Receipt Printers", value: "طابعات الفواتير الحرارية ESC/POS (58mm / 80mm) عبر USB أو الشبكة" },
    { label: isAr ? "قارئات الباركود" : "Barcode Scanners", value: "جميع أجهزة قراءة الباركود السلكية واللاسلكية (1D / 2D / QR)" },
    { label: isAr ? "محرك البيانات المحلي" : "Embedded Database", value: "محرك SQLite محلي عالي السرعة مدمج داخل التطبيق" }
  ];

  const changelog = [
    {
      ver: `${appVersion} (الإصدار الأحدث)`,
      date: "سبتمبر 2026",
      items: [
        isAr ? "دعم قوالب الفواتير المخصصة لطابعات 58mm و 80mm بدون قص الأطراف." : "Enhanced thermal receipt formatting for 58mm & 80mm rolls.",
        isAr ? "محرك المزامنة التفاضلية لمنع تعارضات حركات المخزون بين الفروع." : "Delta sync engine eliminating inventory concurrency conflicts.",
        isAr ? "دعم تعليق سلات متعددة للزبائن واستعادتها بضغطة زر (Multi-Cart)." : "Added multi-cart hold with instant recall.",
        isAr ? "تسجيل مبيعات واستبدال ومرتجع في نفس الفاتورة بسلاسة." : "Unified sales, returns, and exchanges on a single receipt."
      ]
    },
    {
      ver: "v1.4.0",
      date: "أغسطس 2026",
      items: [
        isAr ? "إطلاق منصة إرسال الفواتير الإلكترونية عبر واتساب." : "Integrated digital WhatsApp receipt dispatching.",
        isAr ? "تحسين سرعة معالجة الفواتير في الـ POS لأقل من 0.05 ثانية." : "Sub-50ms checkout latency improvements.",
        isAr ? "حماية متقدمة لبصمة العتاد HWID ومنع التلاعب بساعة النظام." : "Hardware fingerprint locking with anti-rollback safeguards."
      ]
    }
  ];

  const faqs = [
    {
      q: isAr ? "هل يتوقف البرنامج إذا انقطع الإنترنت في المحل؟" : "Will checkout halt if internet disconnects?",
      a: isAr
        ? "نهائياً! البرنامج مصمم بمعمارية Offline-First حقيقية. تُحفظ كافة المعاملات في قاعدة بيانات محلية سريعة على جهازك، ويتم طباعة الفواتير والبيع بشكل طبيعي 100%، وعند عودة الإنترنت يتم رفع الفواتير للسحابة تلقائياً دون أي تدخل منك."
        : "Never! The desktop app is fully offline-first. Invoices and inventory updates are stored locally and synced automatically once internet is restored."
    },
    {
      q: isAr ? "كيف يتم تفعيل الترخيص على جهاز الكاشير؟" : "How is the terminal license activated?",
      a: isAr
        ? "بمجرد تثبيت البرنامج، يتم إنشاء كود بصمة عتاد فريد لجهازك (HWID). كل ما عليك هو إدخال كود التفعيل الممنوح لك في باقتك ليتم ربط الجهاز وتشغيل النظام فوراً."
        : "After installation, enter your branch subscription activation key to bind the device HWID and launch immediately."
    },
    {
      q: isAr ? "هل يمكن ربط أكثر من كاشير في نفس الفرع؟" : "Can I run multiple checkout counters in one branch?",
      a: isAr
        ? "نعم، يدعم النظام ربط عدة نقاط بيع في نفس الفرع عبر الشبكة المحلية (Local LAN) مع مزامنة لحظية بين الخزائن والسيرفر السحابي المركزي."
        : "Yes, multi-terminal local networking is supported, syncing cashier terminals to your central cloud hub."
    },
    {
      q: isAr ? "هل أحتاج تثبيت برامج إضافية مثل SQL Server أو خوادم معقدة؟" : "Do I need to install SQL Server or third-party engines?",
      a: isAr
        ? "لا، حزمة التثبيت مدمجة بالكامل وتحتوي على محرك البيانات والمكونات الضرورية دون الحاجة لأي برامج مساعدة خارجية."
        : "No, the installer is completely self-contained with no external database servers required."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 antialiased" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <main className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 flex-grow space-y-20">
        
        {/* ================= HERO SECTION ================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? `الإصدار الرسمي ${appVersion} متوفر الآن` : `Official Release ${appVersion}`}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              Windows 64-bit
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-slate-950 dark:text-white">
            {isAr ? "برنامج المنظومة لسطح المكتب" : "Manzoma ERP Desktop"} <br />
            <span className="text-indigo-600 dark:text-indigo-400">
              {isAr ? "استقرار وسرعة فائقة بدون إنترنت" : "Offline Speed & Cloud Flexibility"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "نظام نقاط بيع وإدارة متكامل مصمم لأجهزة الكاشير والكمبيوتر. يعمل محلياً بسرعة استجابة لحظية، مع مزامنة سحابية تلقائية ودعم مباشر لكافة طابعات الفواتير والباركود."
              : "Retail POS engineered for desktop performance. 100% offline checkout with automated cloud sync and full hardware compatibility."}
          </p>

          {/* Download Box Card */}
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center space-y-6">
            
            <div className="space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Monitor className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Manzoma ERP {appVersion} for Windows
              </h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isAr ? `تاريخ الإصدار: ${releaseDate} • الحجم: ${fileSize}` : `Released: ${releaseDate} • Size: ${fileSize}`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={downloadUrl}
                className="w-full sm:w-auto h-12 px-7 rounded-xl text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isAr ? "تحميل برنامج الويندوز (Setup.exe)" : "Download for Windows (.exe)"}</span>
              </a>

              <a
                href="https://app.manzoma.online"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-12 px-5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                <span>{isAr ? "تجربة النسخة السحابية" : "Open Web App"}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* Checksum SHA-256 */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="truncate max-w-[280px] sm:max-w-[360px]">
                SHA-256: {fileSha256}
              </span>
              <button
                type="button"
                onClick={copySha}
                className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title={isAr ? "نسخ البصمة" : "Copy hash"}
              >
                {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? "حزمة أصلية آمنة ومفحوصة" : "Verified Clean Package"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-500" />
                <span>{isAr ? "تحديثات صامتة في الخلفية" : "Silent Auto-Updates"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? "تجربة مجانية فورية" : "Free Trial Included"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3-STEP SETUP ================= */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? "ابدأ العمل في 3 خطوات بسيطة" : "Start Selling in 3 Quick Steps"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "إعداد سريع وسهل دون الحاجة لخبرة تقنية أو إعدادات خوادم معقدة." : "Simple setup with no complex server configuration required."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {installSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    {idx === 0 ? <Download className="w-4 h-4" /> : idx === 1 ? <Terminal className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= DESKTOP ADVANTAGES ================= */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? "لماذا يعتمد التجار على تطبيق سطح المكتب؟" : "Why Merchants Prefer the Desktop App"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "مصمم خصيصاً لمواجهة تحديات نقاط البيع ومتاجر التجزئة اليومية." : "Engineered specifically for continuous retail cashiers."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {desktopAdvantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {adv.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= NAVIGATION TABS (SPECS / CHANGELOG) ================= */}
        <section className="space-y-6">
          <div className="flex justify-center border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              {[
                { id: "specs", label: isAr ? "المواصفات الفنية والمتطلبات" : "System Specs", icon: Cpu },
                { id: "changelog", label: isAr ? "سجل التحديثات" : "Changelog", icon: Layers },
              ].map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-[#0B132B] text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === "specs" && (
              <div className="rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-white/10">
                  {isAr ? "متطلبات التشغيل والتوافق مع العتاد" : "Hardware & System Compatibility"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {systemSpecs.map((spec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{spec.label}</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "changelog" && (
              <div className="rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-white/10">
                  {isAr ? "سجل الإصدارات والتحسينات" : "Release History & Improvements"}
                </h3>
                <div className="space-y-6">
                  {changelog.map((rel, idx) => (
                    <div key={idx} className="space-y-3 pb-6 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">{rel.ver}</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{rel.date}</span>
                      </div>
                      <ul className="space-y-2">
                        {rel.items.map((it, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 shrink-0" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= FAQ ACCORDION ================= */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? "الأسئلة الشائعة حول برنامج سطح المكتب" : "Frequently Asked Questions"}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {isAr ? "إجابات واضحة ومباشرة عن تشغيل وتفعيل البرنامج." : "Clear answers about setup and offline operations."}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-white/10 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
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

        {/* ================= ASSISTED INSTALLATION / WHATSAPP BANNER ================= */}
        <section className="p-8 sm:p-10 rounded-3xl bg-indigo-600 dark:bg-indigo-950/70 border border-indigo-500/30 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-black">
              {isAr ? "تحتاج مساعدة في التثبيت أو تعريف الطابعات؟" : "Need help setting up your printers?"}
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl font-medium">
              {isAr
                ? "فريق الدعم الفني جاهز لمساعدتك مجاناً عبر الواتساب وربط طابعات الفواتير والباركود وتجهيز النظام لبدء العمل في محلك."
                : "Our technical team is ready to assist you in configuring receipt printers and hardware."}
            </p>
          </div>

          <a
            href="https://wa.me/201099600048"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-6 rounded-xl text-xs sm:text-sm font-black bg-white text-indigo-950 hover:bg-slate-100 shadow-md active:scale-95 transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? "تواصل مع الدعم الفني (واتساب)" : "Chat with Technical Support"}</span>
          </a>
        </section>

      </main>

      <Footer />
    </div>
  );
}
