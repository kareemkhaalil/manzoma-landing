import React from "react";
import { useAdminStore } from "../../store/adminStore";
import { TrendingUp, DollarSign, Users, Package } from "lucide-react";

function MiniBarChart({ data, label, color = "#3B5BFF" }: { data: number[]; label: string; color?: string }) {
  const max = Math.max(...data);
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو"];

  return (
    <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-premium">
      <h3 className="text-sm font-[900] text-brand-navy mb-1">{label}</h3>
      <p className="text-2xl font-[900] text-brand-navy mb-6">{data[data.length - 1]?.toLocaleString()}</p>
      <div className="flex items-end gap-2 h-32">
        {data.map((val, i) => {
          const height = (val / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-lg transition-all duration-500 hover:opacity-80"
                style={{ height: `${height}%`, backgroundColor: color, opacity: 0.3 + (i / data.length) * 0.7 }}
              />
              <span className="text-[9px] font-bold text-brand-muted">{months[i]?.slice(0, 3)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let offset = 0;

  return (
    <div className="bg-white rounded-3xl border border-brand-border/40 p-6 shadow-premium">
      <h3 className="text-sm font-[900] text-brand-navy mb-6">توزيع الباقات</h3>
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.map((item, i) => {
              const pct = (item.value / total) * 100;
              const dashArray = `${pct} ${100 - pct}`;
              const currentOffset = offset;
              offset += pct;
              return (
                <circle
                  key={i}
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="3"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-[900] text-brand-navy">{total}</span>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-bold text-brand-navy flex-1">{item.label}</span>
              <span className="text-sm font-[900] text-brand-muted">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const { stats, subscriptions, packages } = useAdminStore();

  // Package distribution
  const pkgDist = packages.map((pkg, i) => ({
    label: pkg.name,
    value: subscriptions.filter((s) => s.packageId === pkg.id).length,
    color: ["#3B5BFF", "#10B981", "#F59E0B"][i] || "#94A3B8",
  }));

  // Status distribution
  const statusDist = [
    { label: "نشط", value: subscriptions.filter((s) => s.status === "active").length, color: "#10B981" },
    { label: "تجريبي", value: subscriptions.filter((s) => s.status === "trial").length, color: "#3B5BFF" },
    { label: "منتهي", value: subscriptions.filter((s) => s.status === "expired").length, color: "#F43F5E" },
  ];

  const summaryCards = [
    { label: "إجمالي الإيرادات", value: `${stats.mrr.toLocaleString()} ج.م`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
    { label: "معدل النمو الشهري", value: "+12%", icon: TrendingUp, color: "bg-blue-50 text-brand-primary" },
    { label: "إجمالي المشتركين", value: stats.activeSubscriptions.toString(), icon: Users, color: "bg-violet-50 text-violet-600" },
    { label: "عدد الباقات النشطة", value: packages.length.toString(), icon: Package, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      <div>
        <h1 className="text-2xl font-[900] text-brand-navy">الإحصائيات والتقارير</h1>
        <p className="text-sm font-bold text-brand-muted mt-1">تتبع أداء منصتك ونمو أعمالك</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-brand-border/40 p-5 shadow-premium">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-brand-muted">{card.label}</p>
              <p className="text-xl font-[900] text-brand-navy mt-0.5">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniBarChart data={stats.mrrHistory} label="إجمالي الإيرادات الشهرية (MRR)" color="#10B981" />
        <MiniBarChart data={stats.subscriptionGrowth} label="نمو المشتركين" color="#3B5BFF" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart data={pkgDist} />
        <DonutChart data={statusDist} />
      </div>
    </div>
  );
}
