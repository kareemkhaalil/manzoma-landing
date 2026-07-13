import React, { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { TrendingUp, DollarSign, Users, Package, ShoppingCart, Loader2 } from "lucide-react";
import { fetchGlobalStats, GlobalStats, fetchCompanies } from "../../lib/apiService";

function MiniBarChart({ data, label, color = "#3B5BFF", isCurrency = false }: { data: number[]; label: string; color?: string; isCurrency?: boolean }) {
  const max = Math.max(...data, 1);
  const months = ["الشهر 1", "الشهر 2", "الشهر 3", "الشهر 4", "الشهر 5", "الشهر الحالي"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
      <h3 className="text-sm font-bold text-slate-900 mb-1">{label}</h3>
      <p className="text-2xl font-bold text-slate-900 mb-6">
        {data[data.length - 1]?.toLocaleString()}
        {isCurrency && <span className="text-sm font-bold text-slate-500 mr-1">ج.م</span>}
      </p>
      <div className="flex items-end gap-2 h-32 mt-auto">
        {data.map((val, i) => {
          const height = Math.max((val / max) * 100, 5);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-lg transition-all duration-500 hover:opacity-80 relative group"
                style={{ height: `${height}%`, backgroundColor: color, opacity: 0.3 + (i / data.length) * 0.7 }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-brand-navy text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {val.toLocaleString()}
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-500">{months[i] || ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [liveStats, setLiveStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchGlobalStats().then(setLiveStats),
      fetchCompanies().then(setCompanies)
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const summaryCards = [
    { 
      label: "إجمالي إيرادات النظام", 
      value: `${(liveStats?.totalRevenue || 0).toLocaleString()} ج.م`, 
      icon: DollarSign, 
      color: "bg-emerald-50 text-emerald-600" 
    },
    { 
      label: "متوسط قيمة الفاتورة", 
      value: `${Math.round(liveStats?.averageOrderValue || 0).toLocaleString()} ج.م`, 
      icon: TrendingUp, 
      color: "bg-blue-50 text-indigo-600" 
    },
    { 
      label: "إجمالي المبيعات (فواتير)", 
      value: (liveStats?.totalOrders || 0).toLocaleString(), 
      icon: ShoppingCart, 
      color: "bg-violet-50 text-violet-600" 
    },
    { 
      label: "المشتركين النشطين", 
      value: companies.filter((c:any) => c.isActive).length.toString(), 
      icon: Users, 
      color: "bg-amber-50 text-amber-600" 
    },
  ];

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الإحصائيات والتقارير المالية</h1>
        <p className="text-sm font-bold text-slate-500 mt-1">مراقبة الأداء المالي المجمع لكافة المؤسسات التابعة لمنظومة</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniBarChart 
          data={liveStats?.mrrHistory || []} 
          label="نمو المبيعات الشهرية (آخر 6 أشهر)" 
          color="#10B981"
          isCurrency={true} 
        />
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
           <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">كفاءة المتاجر</h3>
              <p className="text-xs font-bold text-slate-500 mb-6">أداء العملاء مقارنة بإجمالي الفواتير</p>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-slate-900">معدل الفواتير لكل متجر</span>
                 <span className="font-black text-lg text-indigo-600">
                    {liveStats?.totalCompanies ? Math.round(liveStats.totalOrders / liveStats.totalCompanies) : 0}
                 </span>
              </div>
              <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 rounded-full w-3/4" />
              </div>
              <p className="text-[11px] font-bold text-slate-500 text-center">
                توضح هذه النسبة تفاعل العملاء مع النظام، كلما ارتفعت دلت على استخدام مكثف.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

