import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { config } = useAdminStore();

  const page = config.pages?.find((p) => p.slug === slug && p.isPublished);

  if (!page) {
    return (
      <div className="font-sans text-brand-navy bg-brand-bg" dir="rtl">
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center px-6">
            <h1 className="text-6xl font-[900] text-brand-navy mb-4">404</h1>
            <p className="text-xl text-brand-muted font-bold mb-8">
              الصفحة غير موجودة
            </p>
            <Link
              to="/"
              className="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Simple markdown-like rendering: ## headings, paragraphs, - lists
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pr-6 mb-6 space-y-2">
            {listItems.map((item, i) => (
              <li key={i} className="text-slate-600 font-medium leading-relaxed">
                {item}
              </li>
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
            className="text-2xl font-[900] text-brand-navy mt-10 mb-4"
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      } else if (trimmed.startsWith("- ")) {
        listItems.push(trimmed.replace("- ", ""));
      } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList();
        elements.push(
          <p key={`b-${idx}`} className="font-bold text-brand-navy mb-2">
            {trimmed.replace(/\*\*/g, "")}
          </p>
        );
      } else if (trimmed.startsWith("**")) {
        flushList();
        // Bold label with value: **Label:** value
        const parts = trimmed.split("**");
        elements.push(
          <p key={`bl-${idx}`} className="text-slate-600 font-medium mb-2 leading-relaxed">
            <strong className="text-brand-navy">{parts[1]}</strong>
            {parts[2] || ""}
          </p>
        );
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={`p-${idx}`} className="text-slate-600 font-medium leading-[2] mb-4">
            {trimmed}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="font-sans text-brand-navy bg-brand-bg" dir="rtl">
      <Navbar />

      {/* Page Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url(${config.patternUrl})`,
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Floating shapes */}
        <div className="absolute top-24 right-[10%] w-16 h-16 rounded-full border border-brand-primary/10 animate-float-slow pointer-events-none hidden md:block" />
        <div className="absolute bottom-10 left-[8%] w-3 h-3 rounded-full bg-brand-emerald/20 animate-float-medium pointer-events-none" />

        {/* Diagonal accent */}
        <div className="absolute top-0 right-0 w-[250px] h-[2px] bg-gradient-to-l from-brand-primary/15 to-transparent transform rotate-[-30deg] origin-top-right pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-brand-muted font-bold mb-6">
              <Link to="/" className="hover:text-brand-primary transition-colors">
                الرئيسية
              </Link>
              <span className="text-brand-border">/</span>
              <span className="text-brand-navy">{page.title}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-[900] text-brand-navy tracking-tight mb-4">
              {page.heroTitle || page.title}
            </h1>
            {page.heroSubtitle && (
              <p className="text-base md:text-lg text-brand-muted font-medium max-w-2xl mx-auto">
                {page.heroSubtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-separator">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Page Content */}
      <main className="bg-white py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto px-6"
        >
          <div className="bg-white rounded-3xl border border-brand-border/40 shadow-premium p-8 md:p-12">
            {renderContent(page.content)}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
