import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  ShoppingBag,
  Search,
  Bell,
  Clock,
  LayoutDashboard,
  Tag,
  Package,
  Layers
} from "lucide-react";

export default function HeroDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Mock Sales Data for 7 days
  const chartData = [
    { day: "الأحد", sales: 42000 },
    { day: "الإثنين", sales: 55000 },
    { day: "الثلاثاء", sales: 48000 },
    { day: "الأربعاء", sales: 72000 },
    { day: "الخميس", sales: 95000 },
    { day: "الجمعة", sales: 88000 },
    { day: "السبت", sales: 68000 },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.sales));

  const recentOrders = [
    { id: "MNZM-8902", branch: "فرع المهندسين", time: "منذ دقيقتين", amount: 1450, status: "completed" },
    { id: "MNZM-8901", branch: "فرع التجمع", time: "منذ 5 دقائق", amount: 2800, status: "completed" },
    { id: "MNZM-8900", branch: "فرع سيتي ستارز", time: "منذ 12 دقيقة", amount: 950, status: "offline_synced" },
    { id: "MNZM-8899", branch: "فرع الإسكندرية", time: "منذ 20 دقيقة", amount: 3700, status: "completed" },
  ];

  return (
    <div className="w-full rounded-3xl overflow-hidden border shadow-2xl relative select-none font-sans text-right"
         style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border)" }}
         dir="rtl">
      
      {/* Browser Bar */}
      <div className="px-4 py-3 border-b flex items-center justify-between shrink-0"
           style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
        <div className="flex gap-1.5 order-first">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="rounded-lg px-8 py-1 text-xs font-mono tracking-wider w-[40%] text-center"
             style={{ backgroundColor: "var(--bg-card)", color: "var(--text-3)" }}>
          system.manzoma.com/dashboard
        </div>
        <div className="w-6" />
      </div>

      {/* Main Container */}
      <div className="flex min-h-[500px] md:min-h-[580px]">
        {/* Sidebar */}
        <aside className="w-48 border-l p-4 hidden md:flex flex-col justify-between"
               style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg"
                   style={{ backgroundColor: "var(--brand)" }}>
                <span className="font-black text-sm">M</span>
              </div>
              <div>
                <div className="text-xs font-black leading-none" style={{ color: "var(--text-1)" }}>منظومة ERP</div>
                <span className="text-[9px] font-medium" style={{ color: "var(--text-3)" }}>لوحة الإدارة</span>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
                { id: "pos", label: "نقطة البيع (POS)", icon: Tag },
                { id: "products", label: "تكويد المنتجات", icon: Package },
                { id: "inventory", label: "المخازن والجرد", icon: Layers },
              ].map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveItem(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                      color: isActive ? "var(--brand)" : "var(--text-2)"
                    }}
                  >
                    <item.icon className="w-4 h-4 shrink-0" style={{ color: isActive ? "var(--brand)" : "var(--text-3)" }} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="rounded-xl p-3 border"
               style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">كاشير متصل</span>
            </div>
            <div className="text-[9px] leading-tight" style={{ color: "var(--text-3)" }}>الوردية الحالية: #12</div>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4"
               style={{ borderColor: "var(--border)" }}>
            <div>
              <h1 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-1)" }}>نظرة عامة</h1>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--text-3)" }}>
                التحليلات والمبيعات اللحظية عبر جميع الفروع.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
                <input
                  type="text"
                  placeholder="بحث سريع..."
                  className="border-none rounded-xl pr-9 pl-4 py-1.5 text-xs outline-none w-40 focus:w-48 transition-all"
                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-1)" }}
                  readOnly
                />
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center relative cursor-pointer"
                   style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-2)" }}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>
              <div className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-lg"
                   style={{ backgroundColor: "var(--brand)" }}>
                أ
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "إجمالي مبيعات اليوم", value: "468,780", suffix: "ج.م", trend: "+12.4%", icon: TrendingUp, color: "bg-emerald-500" },
              { title: "صافي الأرباح", value: "352,430", suffix: "ج.م", trend: "+8.2%", icon: Wallet, color: "bg-brand" },
              { title: "فواتير الوردية", value: "164", suffix: "فاتورة", trend: "نشط حالياً", icon: ShoppingBag, color: "bg-amber-500" },
            ].map((card, i) => (
              <div key={i} className="p-5 rounded-2xl border relative overflow-hidden group shadow-sm"
                   style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full translate-x-10 -translate-y-10"
                     style={{ backgroundColor: "var(--bg-elevated)" }} />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`${card.color.startsWith("bg-") ? card.color : ""} w-9 h-9 rounded-xl flex items-center justify-center text-white`}
                       style={{ backgroundColor: card.color.startsWith("bg-") ? undefined : "var(--brand)" }}>
                    <card.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-2)" }}>
                    {card.trend}
                  </span>
                </div>
                <div className="space-y-1 relative z-10">
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>{card.title}</div>
                  <div className="text-xl md:text-2xl font-black leading-none" style={{ color: "var(--text-1)" }}>
                    {card.value} <span className="text-xs font-bold" style={{ color: "var(--text-3)" }}>{card.suffix}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts & Table Split */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Chart Card */}
            <div className="lg:col-span-3 p-5 rounded-2xl border shadow-sm space-y-4"
                 style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm" style={{ color: "var(--text-1)" }}>نمو المبيعات الأسبوعي</h3>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-3)" }}>مبيعات آخر 7 أيام بالألف</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
                  <span className="text-[10px] font-bold" style={{ color: "var(--text-2)" }}>المبيعات</span>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="h-44 flex items-end justify-between gap-2.5 pt-4 px-2 border-b relative"
                   style={{ borderColor: "var(--border)" }}>
                {chartData.map((d, i) => {
                  const percent = (d.sales / maxVal) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {hoveredBar === i && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="absolute bottom-full mb-2 text-white text-[9px] font-black py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-xl z-30"
                          style={{ backgroundColor: "var(--navy)" }}
                        >
                          {(d.sales / 1000).toFixed(1)}k ج.م
                        </motion.div>
                      )}
                      
                      {/* Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer`}
                        style={{
                          backgroundColor: i === 4 ? "var(--brand)" : "var(--border-strong)"
                        }}
                      />
                      
                      {/* Day Label */}
                      <span className="text-[9px] font-black mt-2 leading-none" style={{ color: "var(--text-3)" }}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Orders Card */}
            <div className="lg:col-span-2 p-5 rounded-2xl border shadow-sm space-y-4"
                 style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div>
                <h3 className="font-black text-sm" style={{ color: "var(--text-1)" }}>أحدث الفواتير</h3>
                <span className="text-[10px] font-medium" style={{ color: "var(--text-3)" }}>مزامنة فورية من الفروع</span>
              </div>

              <div className="space-y-2.5">
                {recentOrders.map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border transition-all"
                       style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[9px] font-bold"
                           style={{ backgroundColor: "var(--bg-card)", color: "var(--brand)" }}>
                        #{order.id.split("-")[1]}
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-black" style={{ color: "var(--text-1)" }}>{order.branch}</div>
                        <div className="text-[8px] flex items-center gap-1 mt-0.5" style={{ color: "var(--text-3)" }}>
                          <Clock className="w-2.5 h-2.5" />
                          <span>{order.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-black" style={{ color: "var(--text-1)" }}>{order.amount} ج.م</div>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black mt-1 ${
                        order.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      }`}>
                        {order.status === "completed" ? "مكتمل" : "أوفلاين مزامن"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
