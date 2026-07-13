import React from "react";
import { DollarSign, Users, Box, Clock, ArrowUpLeft, Globe, TrendingUp, Video, Package, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../store/adminStore";

export default function Overview() {
  const { stats } = useAdminStore();

  const statCards = [
    {
      title: "إجمالي الإيرادات (MRR)",
      value: new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(stats.mrr),
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      href: "/admin/subscriptions",
      change: "+12%",
      changeColor: "text-emerald-600",
      ltr: true,
      bars: stats.mrrHistory,
    },
    {
      title: "المشتركين النشطين",
      value: stats.activeSubscriptions.toLocaleString(),
      icon: Users,
      color: "bg-blue-50 text-brand-primary",
      href: "/admin/subscriptions",
      change: "+8%",
      changeColor: "text-emerald-600",
      bars: stats.subscriptionGrowth,
    },
    {
      title: "إجمالي نقاط البيع",
      value: stats.totalTerminals.toLocaleString(),
      icon: Box,
      color: "bg-violet-50 text-violet-600",
      href: "/admin/stats",
      change: "+15%",
      changeColor: "text-emerald-600",
    },
    {
      title: "فترات تجريبية جديدة",
      value: stats.newTrials.toString(),
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      href: "/admin/subscriptions",
      urgent: stats.newTrials > 0,
    },
  ];

  const sections = [
    {
      title: "إدارة المحتوى",
      icon: Globe,
      links: [
        { href: "/admin/landing", label: "تعديل الصفحة الرئيسية", icon: Globe, color: "bg-brand-primary" },
        { href: "/admin/packages", label: "إدارة الباقات والأسعار", icon: Package, color: "bg-emerald-600" },
        { href: "/admin/academy", label: "أكاديمية التعليم (فيديو)", icon: Video, color: "bg-amber-600" },
      ],
    },
    {
      title: "المتابعة والتقارير",
      icon: TrendingUp,
      links: [
        { href: "/admin/stats", label: "تقارير الأداء والنمو", icon: TrendingUp, color: "bg-orange-500" },
        { href: "/admin/subscriptions", label: "قائمة العملاء والمشتركين", icon: Users, color: "bg-blue-600" },
        { href: "/admin/settings", label: "إعدادات المنصة العامة", icon: Settings, color: "bg-slate-600" },
      ],
    },
  ];

  return (
    <div className="space-y-10 pb-10" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-[900] text-brand-navy">لوحة التحكم</h1>
          <p className="text-brand-muted font-bold mt-1">نظرة شاملة على أداء منصة منظومة</p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 text-sm border border-brand-border px-6 py-3 rounded-2xl font-bold text-brand-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
        >
          عرض الموقع
          <ArrowUpLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-white rounded-3xl border border-brand-border/40 p-6 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-1 ${
                card.urgent ? "border-amber-200 bg-amber-50/10" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {card.change && (
                  <span className={`text-[11px] font-[900] ${card.changeColor} bg-emerald-50 px-2.5 py-1 rounded-full`}>
                    {card.change}
                  </span>
                )}
                {card.urgent && (
                  <span className="text-[10px] font-[900] text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                    يحتاج مراجعة
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-brand-muted">{card.title}</p>
              <div className={`text-2xl font-[900] text-brand-navy mt-1 ${card.ltr ? "font-mono" : ""}`}>
                {card.value}
              </div>

              {/* Mini Sparkline */}
              {card.bars && (
                <div className="flex items-end gap-1 mt-4 h-8">
                  {card.bars.map((val, i) => {
                    const max = Math.max(...card.bars!);
                    const height = (val / max) * 100;
                    return (
                      <div
                        key={i}
                        className="mini-chart-bar flex-1 rounded-sm"
                        style={{ height: `${height}%`, opacity: 0.3 + (i / card.bars!.length) * 0.7 }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-[900] text-brand-navy mb-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-bg flex items-center justify-center text-brand-primary">
                <section.icon className="w-4 h-4" />
              </div>
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-4 bg-white border border-brand-border/40 rounded-2xl p-5 shadow-premium hover:shadow-premium-lg hover:-translate-y-0.5 hover:border-brand-primary/20 transition-all group"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${link.color} shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-[800] text-brand-navy text-sm group-hover:text-brand-primary transition-colors">
                      {link.label}
                    </span>
                    <ArrowUpLeft className="w-4 h-4 text-brand-muted/30 group-hover:text-brand-primary transition-colors mr-auto" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CMS Banner */}
      <div className="bg-brand-navy rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-premium-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex-1 text-center md:text-right">
          <h3 className="text-white font-[900] text-xl md:text-2xl mb-2">
            تعديل محتوى الصفحة الرئيسية 🚀
          </h3>
          <p className="text-white/50 text-sm md:text-base font-bold leading-relaxed max-w-2xl">
            تحكم في نصوص الهيرو، المزايا، الأسعار وفيديوهات الأكاديمية من مكان واحد متكامل.
          </p>
        </div>
        <Link
          to="/admin/landing"
          className="relative z-10 bg-brand-primary hover:bg-white hover:text-brand-navy text-white font-[900] px-8 py-3.5 rounded-2xl transition-all duration-300 text-sm shadow-lg hover:scale-105"
        >
          فتح المحرر
        </Link>
      </div>
    </div>
  );
}
