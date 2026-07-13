import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Award } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";
import { useSchema } from "../hooks/useSchema";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { config, language } = useAdminStore();
  const t = translations[language];
  const isAr = language === "ar";

  const articles = t.blogArticles || [];
  const article = articles.find((a) => a.slug === slug);

  // 🌍 SEO & JSON-LD Structured Data
  useSEO({
    title: article ? `${article.title} | منظومة` : isAr ? "المقال غير موجود" : "Article Not Found",
    description: article?.excerpt || "",
    keywords: article ? article.title.split(" ").join(", ") : "",
    canonical: `https://manzoma.online/blog/${slug}`
  });

  const schemaPayload = article ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": "https://manzoma.online/logo.png",
    "datePublished": "2026-06-23T07:50:00+03:00",
    "author": {
      "@type": "Organization",
      "name": language === "ar" ? "فريق منظومة المحاسبي" : "Manzoma Editorial Team",
      "url": "https://manzoma.online"
    },
    "publisher": {
      "@type": "Organization",
      "name": "منظومة - Manzoma",
      "logo": {
        "@type": "ImageObject",
        "url": "https://manzoma.online/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://manzoma.online/blog/${slug}`
    }
  } : null;

  useSchema(schemaPayload ? [schemaPayload] : []);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col font-sans relative antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
        <Navbar />
        <main className="w-full max-w-6xl mx-auto px-6 py-20 flex-grow flex flex-col justify-center text-center">
          <h1 className="text-4xl font-[900] mb-2" style={{ color: "var(--text-1)" }}>404</h1>
          <p className="text-[13px] font-bold mb-6" style={{ color: "var(--text-2)" }}>
            {isAr ? "المقال المطلوب غير موجود" : "The requested article was not found"}
          </p>
          <Link
            to="/blog"
            className="h-10 px-6 rounded-xl text-[12.5px] font-bold inline-flex items-center justify-center gap-1.5 active-scale self-center"
            style={{ backgroundColor: "var(--text-1)", color: "var(--bg-page)" }}
          >
            <ArrowLeft className={`w-4 h-4 ${!isAr ? "rotate-180" : ""}`} />
            {t.backToBlog}
          </Link>
        </main>
      </div>
    );
  }

  // Parses dynamic markdown formatting
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={`list-disc ${isAr ? "pr-6" : "pl-6"} mb-6 space-y-2.5 text-[14px] font-medium leading-relaxed`} style={{ color: "var(--text-2)" }}>
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
            className="text-[18px] font-[900] mt-8 mb-3.5 leading-snug"
            style={{ color: "var(--text-1)" }}
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      } else if (trimmed.startsWith("- ")) {
        listItems.push(trimmed.replace("- ", ""));
      } else if (trimmed.startsWith("1. ")) {
        flushList();
        elements.push(
          <p key={`num-${idx}`} className="text-[14px] font-medium mb-3 leading-relaxed" style={{ color: "var(--text-2)" }}>
            <strong className="font-bold" style={{ color: "var(--text-1)" }}>{trimmed.slice(0, 3)}</strong>
            {trimmed.slice(3)}
          </p>
        );
      } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList();
        elements.push(
          <p key={`b-${idx}`} className="font-extrabold text-[14.5px] mb-2.5" style={{ color: "var(--text-1)" }}>
            {trimmed.replace(/\*\*/g, "")}
          </p>
        );
      } else if (trimmed.startsWith("**")) {
        flushList();
        const parts = trimmed.split("**");
        elements.push(
          <p key={`bl-${idx}`} className="text-[14px] font-medium mb-3 leading-relaxed" style={{ color: "var(--text-2)" }}>
            <strong className="font-bold" style={{ color: "var(--text-1)" }}>{parts[1]}</strong>
            {parts[2] || ""}
          </p>
        );
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        // Replace **bold** occurrences inline
        const formattedLine = trimmed.split("**").map((chunk, i) => {
          if (i % 2 !== 0) {
            return <strong key={i} className="font-bold" style={{ color: "var(--text-1)" }}>{chunk}</strong>;
          }
          return chunk;
        });
        
        elements.push(
          <p key={`p-${idx}`} className="text-[14px] font-medium leading-[1.85] mb-4" style={{ color: "var(--text-2)" }}>
            {formattedLine}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(isAr ? "تم نسخ رابط المقال!" : "Article link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-6 pt-24 pb-16 flex-grow flex flex-col justify-start z-10">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-1.5 text-[12px] font-bold" style={{ color: "var(--text-2)" }}>
          <Link to="/" className="hover:opacity-85">{isAr ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <Link to="/blog" className="hover:opacity-85">{t.blogTitle}</Link>
          <span>/</span>
          <span className="font-extrabold max-w-[200px] truncate" style={{ color: "var(--text-1)" }}>{article.title}</span>
        </div>

        {/* Dynamic Title Header */}
        <section className={`mb-8 ${isAr ? "text-right" : "text-left"} max-w-3xl mx-auto w-full`}>
          {/* Tag */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10.5px] font-bold mb-3.5">
            <Award className="w-3 h-3" />
            <span>{isAr ? "نصائح وإرشادات" : "Expert Insights"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-[900] leading-snug mb-3.5 bg-gradient-to-r from-brand to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--border)" }}>
            {/* Meta info */}
            <div className="flex items-center gap-4 text-[11px] font-bold" style={{ color: "var(--text-3)" }}>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            {/* Share CTA */}
            <button
              onClick={shareArticle}
              className="px-3.5 h-9 rounded-xl border active-scale inline-flex items-center gap-1.5 text-[12px] font-bold cursor-pointer transition-colors hover:opacity-85"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-2)" }}
            >
              <Share2 className="w-4 h-4" />
              {isAr ? "مشاركة المقال" : "Share Article"}
            </button>
          </div>
        </section>

        {/* Article Body */}
        <section className="border shadow-sm rounded-2xl p-6 md:p-10 max-w-3xl mx-auto w-full mb-12" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          {/* Article Banner mockup */}
          <div className="w-full aspect-video rounded-xl bg-gradient-to-tr from-brand-primary/10 to-brand-primary/5 mb-8 flex items-center justify-center relative overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <img
              src="/cdn/logo.png"
              alt={article.title}
              className="w-24 h-24 object-contain opacity-50 select-none pointer-events-none"
            />
          </div>

          <div className="article-body">
            {renderContent(article.content)}
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="max-w-3xl mx-auto w-full mb-12 flex justify-start">
          <Link
            to="/blog"
            className="px-5 h-10 rounded-xl text-[12.5px] font-bold inline-flex items-center gap-1.5 active-scale transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--text-1)", color: "var(--bg-page)" }}
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? "" : "rotate-180"}`} />
            {t.backToBlog}
          </Link>
        </div>

        {/* Footer */}
        <footer className="border-t pt-8 text-center font-medium mt-auto" style={{ borderColor: "var(--border)", color: "var(--text-3)" }}>
          <p className="text-[11px]">
            © {new Date().getFullYear()} {isAr ? "منظومة" : "Manzoma"}. {isAr ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
          </p>
        </footer>
      </main>
    </div>
  );
}
