import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Calendar, Clock, Search, ArrowRight } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";

export default function BlogPage() {
  const { language } = useAdminStore();
  const t = translations[language];
  const isAr = language === "ar";

  const [searchQuery, setSearchQuery] = useState("");

  // SEO metadata
  useSEO({
    title: isAr ? "المدونة المعرفية وأخبار التجزئة | منظومة" : "Knowledge Blog & Retail News | Manzoma",
    description: isAr
      ? "تصفح المقالات والأدلة التعليمية من خبراء المحاسبة والتجزئة لتطوير متجرك وحماية أرباحك وتجنب عجز الخزينة."
      : "Browse retail insights, tips, and tutorials from industry experts to grow your store and secure cash registers.",
    keywords: isAr
      ? "مدونة كاشير, مقالات تجارة تجزئة, حماية الخزينة, الفاتورة الإلكترونية مصر, منظومة"
      : "retail blog, cashier tips, pos guides, e-invoicing egypt, retail automation"
  });

  const articles = t.blogArticles || [];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans relative antialiased selection:bg-brand-primary/10" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-6 py-28 flex-grow flex flex-col justify-start z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold transition-colors active-scale hover:opacity-80"
            style={{ color: "var(--text-2)" }}
          >
            <ArrowLeft className={`w-4 h-4 ${!isAr ? "rotate-180" : ""}`} />
            {isAr ? "العودة للرئيسية" : "Back to Homepage"}
          </Link>
        </div>

        {/* Hero Section */}
        <section className={`mb-12 ${isAr ? "text-right" : "text-left"}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.blogTitle}</span>
          </div>

          <h1 className="text-3xl font-[900] leading-tight mb-2.5 bg-gradient-to-r from-brand to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            {isAr ? (
              <>مقالات وأدلة إرشادية لتطوير <span className="text-brand-primary">تجارتك</span></>
            ) : (
              <>Articles & Guides to Scale Your <span className="text-brand-primary">Retail Business</span></>
            )}
          </h1>

          <p className="text-[14px] font-bold leading-relaxed max-w-[60ch]" style={{ color: "var(--text-2)" }}>
            {t.blogSubtitle}
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-md relative">
            <div className={`absolute inset-y-0 ${isAr ? "right-3" : "left-3"} flex items-center pointer-events-none`} style={{ color: "var(--text-3)" }}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={isAr ? "ابحث عن مقال معين..." : "Search articles..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} rounded-xl border text-[13px] font-medium focus:outline-none focus:border-brand-primary shadow-sm transition-colors`}
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-1)" }}
            />
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mb-12">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, i) => (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  key={article.slug}
                  className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                >
                  <div>
                    {/* Header Image */}
                    <div className="w-full aspect-video bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border-b flex items-center justify-center relative overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                      <img
                        src={article.image || "/cdn/logo.png"}
                        alt={article.title}
                        className="w-16 h-16 object-contain opacity-80"
                      />
                    </div>

                    <div className="p-5">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-[11px] font-bold mb-2.5" style={{ color: "var(--text-3)" }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-[14.5px] font-[900] mb-2 leading-snug hover:opacity-85 transition-colors" style={{ color: "var(--text-1)" }}>
                        <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                      </h3>

                      <p className="text-[12.5px] font-medium leading-relaxed line-clamp-3" style={{ color: "var(--text-2)" }}>
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2">
                    <Link
                      to={`/blog/${article.slug}`}
                      className="text-[12.5px] font-black inline-flex items-center gap-1 transition-transform group"
                      style={{ color: "var(--brand)" }}
                    >
                      {t.readArticle}
                      <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="border rounded-2xl p-12 text-center max-w-md mx-auto" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="text-[13px] font-bold" style={{ color: "var(--text-2)" }}>
                {isAr ? "لا توجد مقالات تطابق بحثك حالياً." : "No articles match your search query."}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center font-medium mt-auto" style={{ borderColor: "var(--border)", color: "var(--text-3)" }}>
        <p className="text-[11px]">
          © {new Date().getFullYear()} {isAr ? "منظومة" : "Manzoma"}. {isAr ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
        </p>
      </footer>
    </div>
  );
}
