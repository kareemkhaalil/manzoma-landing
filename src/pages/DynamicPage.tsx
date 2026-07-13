import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, MessageCircle, Mail, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminStore } from "../store/adminStore";
import Navbar from "../components/landing/Navbar";
import { useSEO } from "../hooks/useSEO";
import { useSchema } from "../hooks/useSchema";
import { translations } from "../lib/translations";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { config, language } = useAdminStore();
  const t = translations[language];

  const isAr = language === "ar";
  const page = config.pages?.find((p) => p.slug === slug && p.isPublished);

  // Retrieve translated content if available, fallback to database pages
  const translatedPage = t.dynamicPages?.[slug as keyof typeof t.dynamicPages];
  // CMS content takes precedence. Translation data is only a safe fallback
  // when no page has been created in the dashboard for this slug.
  const pageTitle = page?.heroTitle || page?.title || translatedPage?.title || "";
  const pageSubtitle = page?.heroSubtitle || translatedPage?.subtitle || "";
  const pageContent = page?.content || translatedPage?.content || "";

  // 🌍 Dynamic SEO Meta
  const seoData = t.dynamicSeo?.[slug as keyof typeof t.dynamicSeo] || {
    title: page ? `${page.title} | ${config.siteName || "منظومة"}` : "",
    desc: page ? page.content.slice(0, 150).replace(/[#*_\-\n]/g, " ").trim() : "",
    keywords: page ? page.title.split(" ").join(", ") : ""
  };

  useSEO({
    title: seoData.title,
    description: seoData.desc,
    keywords: seoData.keywords,
  });

  // ⚙️ Dynamic JSON-LD schema
  let schemaData: any = null;
  if (slug === "faq") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": t.faqList.map((faq: any) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
  } else if (slug === "contact") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": language === "ar" ? "منظومة" : "Manzoma POS",
      "url": "https://manzoma.online",
      "logo": "https://manzoma.online/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+201099600048",
        "contactType": "sales",
        "areaServed": "EG",
        "availableLanguage": ["Arabic", "English"]
      }
    };
  }

  useSchema(schemaData ? [schemaData] : []);

  if (!page && !translatedPage) {
    return (
      <div className="min-h-screen flex flex-col font-sans relative antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
        <Navbar />
        <main className="w-full max-w-6xl mx-auto px-6 py-20 flex-grow flex flex-col justify-center text-center">
          <h1 className="text-4xl font-[900] mb-2" style={{ color: "var(--text-1)" }}>404</h1>
          <p className="text-[13px] font-bold mb-6" style={{ color: "var(--text-2)" }}>
            {isAr ? "الصفحة المطلوبة غير موجودة" : "The requested page was not found"}
          </p>
          <Link
            to="/"
            className="h-10 px-6 rounded-xl text-[12.5px] font-bold inline-flex items-center justify-center gap-1.5 active-scale self-center"
            style={{ backgroundColor: "var(--text-1)", color: "var(--bg-page)" }}
          >
            <ArrowRight className={`w-4 h-4 ${!isAr ? "rotate-180" : ""}`} />
            {isAr ? "العودة للرئيسية" : "Back to Homepage"}
          </Link>
        </main>
      </div>
    );
  }

  // Parses Dynamic text formatting
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={`list-disc ${isAr ? "pr-6" : "pl-6"} mb-6 space-y-2 text-[13.5px] font-medium leading-relaxed`} style={{ color: "var(--text-2)" }}>
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2
            key={`h2-${idx}`}
            className="text-[16px] font-[900] mt-8 mb-3"
            style={{ color: "var(--text-1)" }}
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      } else if (trimmed.startsWith("- ")) {
        listItems.push(trimmed.replace("- ", ""));
      } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList();
        elements.push(
          <p key={`b-${idx}`} className="font-extrabold text-[14px] mb-2.5" style={{ color: "var(--text-1)" }}>
            {trimmed.replace(/\*\*/g, "")}
          </p>
        );
      } else if (trimmed.startsWith("**")) {
        flushList();
        const parts = trimmed.split("**");
        elements.push(
          <p key={`bl-${idx}`} className="text-[13.5px] font-medium mb-3 leading-relaxed" style={{ color: "var(--text-2)" }}>
            <strong className="font-bold" style={{ color: "var(--text-1)" }}>{parts[1]}</strong>
            {parts[2] || ""}
          </p>
        );
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={`p-${idx}`} className="text-[13.5px] font-medium leading-[1.85] mb-4" style={{ color: "var(--text-2)" }}>
            {trimmed}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

      {/* Decorative Glows */}
      <div className="absolute top-20 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/3 blur-[140px] pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl mx-auto px-6 pt-28 pb-16 flex-grow flex flex-col justify-start z-10"
      >
        
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-1.5 text-[12px] font-bold" style={{ color: "var(--text-2)" }}>
          <Link to="/" className="hover:opacity-80">{isAr ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <span className="font-extrabold" style={{ color: "var(--text-1)" }}>{pageTitle}</span>
        </div>

        {/* Dynamic Title Header */}
        <section className={`mb-10 ${isAr ? "text-right" : "text-left"} max-w-3xl mx-auto w-full`}>
          <h1 className="text-3xl sm:text-4xl font-[900] leading-tight mb-3.5 bg-gradient-to-r from-brand to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-[13.5px] font-bold leading-relaxed max-w-[65ch]" style={{ color: "var(--text-2)" }}>
              {pageSubtitle}
            </p>
          )}
        </section>

        {/* Split Grid for Contact Page */}
        {slug === "contact" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto w-full mb-12 items-start">
            {/* Left Content Card */}
            <div className="lg:col-span-7 border shadow-sm rounded-3xl p-6 md:p-10 w-full" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="page-content">
                {renderContent(pageContent)}
              </div>
            </div>

            {/* Right Contact Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4 w-full">
              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/201099600048"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border hover:shadow-lg transition-all duration-300 flex items-center gap-4 group hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black" style={{ color: "var(--text-3)" }}>{isAr ? "المبيعات والدعم الفني عبر واتساب" : "WhatsApp Sales & Support"}</h4>
                  <p className="text-sm font-black font-mono" style={{ color: "var(--text-1)" }}>+20 109 960 0048</p>
                </div>
              </a>

              {/* Email Card */}
              <a 
                href="mailto:support@manzoma.online"
                className="p-5 rounded-2xl border hover:shadow-lg transition-all duration-300 flex items-center gap-4 group hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black" style={{ color: "var(--text-3)" }}>{isAr ? "راسلنا عبر البريد الإلكتروني" : "Email Support Inbox"}</h4>
                  <p className="text-sm font-black font-mono" style={{ color: "var(--text-1)" }}>support@manzoma.online</p>
                </div>
              </a>

              {/* Status Card */}
              <div 
                className="p-5 rounded-2xl border flex items-center gap-4"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center shrink-0 relative">
                  <Clock className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black" style={{ color: "var(--text-3)" }}>{isAr ? "حالة الدعم والمبيعات" : "Support Helpline Status"}</h4>
                  <p className="text-sm font-black" style={{ color: "var(--text-1)" }}>{isAr ? "متصل الآن — خدمة 24/7" : "Online Now — Available 24/7"}</p>
                </div>
              </div>

              {/* Headquarters Card */}
              <div 
                className="p-5 rounded-2xl border flex items-center gap-4"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black" style={{ color: "var(--text-3)" }}>{isAr ? "موقع الشركة الرئيسي" : "Company Headquarters"}</h4>
                  <p className="text-sm font-black" style={{ color: "var(--text-1)" }}>{isAr ? "القاهرة، جمهورية مصر العربية" : "Cairo, Arab Republic of Egypt"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* General Dynamic Card Layout */
          <section className="border shadow-sm rounded-3xl p-8 md:p-12 max-w-3xl mx-auto w-full mb-12" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="page-content">
              {renderContent(pageContent)}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t pt-8 text-center font-medium mt-auto" style={{ borderColor: "var(--border)", color: "var(--text-3)" }}>
          <p className="text-[11px]">
            © {new Date().getFullYear()} {config.siteName}. {isAr ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
          </p>
        </footer>

      </motion.main>
    </div>
  );
}
