import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft, Star, Play, Trophy } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import { useAdminStore } from "../store/adminStore";
import { useSEO } from "../hooks/useSEO";
import { useSchema } from "../hooks/useSchema";
import { translations } from "../lib/translations";

export default function AcademyPage() {
  const { config, language } = useAdminStore();
  const videos = config.academyVideos || [];
  const t = translations[language];

  const isAr = language === "ar";

  useSEO({
    title: t.academySeoTitle,
    description: t.academySeoDescription,
    keywords: t.academySeoKeywords,
  });

  const videoSchemas = videos.map((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": isAr
      ? `شرح توضيحي تعليمي في أكاديمية منظومة: ${video.title}`
      : `Educational tutorial in Manzoma Academy: ${video.title}`,
    "thumbnailUrl": video.thumbnail || "https://manzoma.online/logo.png",
    "uploadDate": "2026-06-23T07:46:00+03:00",
    "embedUrl": video.url,
  }));

  useSchema(videoSchemas);

  return (
    <div className="min-h-screen bg-zinc-bg flex flex-col font-sans text-zinc-ink relative antialiased selection:bg-brand-primary/10" dir={isAr ? "rtl" : "ltr"}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      
      {/* Navigation Header */}
      <Navbar />

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto px-6 py-28 flex-grow flex flex-col justify-start z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-zinc-secondary hover:text-zinc-ink transition-colors active-scale"
          >
            <ArrowLeft className={`w-4 h-4 ${!isAr ? "rotate-180" : ""}`} />
            {isAr ? "العودة للرئيسية" : "Back to Homepage"}
          </Link>
        </div>

        {/* Hero Section */}
        <section className={`mb-12 ${isAr ? "text-right" : "text-left"}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>{isAr ? "أكاديمية التعليم الممنهج" : "Systematic Learning Academy"}</span>
          </div>
          
          <h1 className="text-3xl font-[900] leading-tight text-zinc-ink mb-2.5">
            {isAr ? (
              <>تعلم كيف تدير تجارتك بذكاء <span className="text-brand-primary">ومهارة</span></>
            ) : (
              <>Learn how to manage your business <span className="text-brand-primary">smartly & skillfully</span></>
            )}
          </h1>
          
          <p className="text-[14px] text-zinc-secondary font-medium leading-relaxed max-w-[60ch]">
            {isAr ? (
              "مكتبة متكاملة من الشروحات المصورة، مصممة خصيصاً لمساعدتك على تحقيق أقصى استفادة من نظام منظومة وتحويل أرقامك لأرباح حقيقية."
            ) : (
              "A comprehensive library of video guides, specifically designed to help you get the most out of Manzoma and turn your figures into real profits."
            )}
          </p>
        </section>

        {/* Video Cards Grid */}
        <section className="mb-12">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => window.open(video.url, "_blank")}
                  className="rounded-2xl border bg-white p-4 cursor-pointer active:scale-card hover:bg-zinc-50/50 shadow shadow-black/5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail video frame */}
                    <div className="w-full aspect-video rounded-xl bg-zinc-950 flex items-center justify-center text-white relative overflow-hidden border border-zinc-900 shadow-sm mb-4">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover opacity-60"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 opacity-80" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center absolute shadow-lg group-hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </div>
                    </div>

                    <h3 className="text-[13.5px] font-[900] text-zinc-ink line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-4 text-[10.5px]">
                    <div className="flex items-center gap-1.5 text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{isAr ? "موصى به" : "Recommended"}</span>
                    </div>
                    <span className="text-zinc-secondary font-bold">{isAr ? "دليل شامل" : "Complete Guide"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border shadow rounded-2xl">
              <BookOpen className="w-10 h-10 text-zinc-secondary/35 mx-auto mb-4" />
              <h3 className="text-[16px] font-[900] text-zinc-ink mb-1.5">
                {isAr ? "شروحات الأكاديمية قريباً" : "Academy Video Guides Coming Soon"}
              </h3>
              <p className="text-[12.5px] text-zinc-secondary max-w-xs mx-auto">
                {isAr ? (
                  "نعمل حالياً على إعداد مكتبة متكاملة من الفيديوهات لمساعدتك على إعداد نظامك في ثوانٍ."
                ) : (
                  "We are currently preparing a comprehensive library of videos to help you set up your system in seconds."
                )}
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t pt-8 text-center text-zinc-secondary font-medium mt-auto" style={{ borderColor: "var(--border)" }}>
          <p className="text-[11px]">
            © {new Date().getFullYear()} {isAr ? "منظومة" : "Manzoma"}. {isAr ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
          </p>
        </footer>

      </main>
    </div>
  );
}
