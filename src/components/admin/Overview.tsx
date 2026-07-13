import React, { useState, useEffect } from "react";
import { Building2, Users, ShoppingCart, Clock, ArrowUpLeft, Download, Calendar, MoreHorizontal, CheckCircle2, CircleDashed, AlertCircle, XCircle, Search, DollarSign, TrendingUp, Sparkles, Package, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchGlobalStats, fetchGlobalInvoices, type GlobalStats, type InvoiceFromAPI } from "../../lib/apiService";
import { useAdminStore } from "../../store/adminStore";

export default function Overview() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [invoices, setInvoices] = useState<InvoiceFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchGlobalStats(),
      fetchGlobalInvoices(1, "")
    ])
      .then(([statsData, invoicesData]) => {
        setStats(statsData);
        setInvoices(invoicesData.data);
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-sm font-bold animate-pulse">جاري جلب البيانات المباشرة...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي الإيرادات",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: "+0% من الشهر الماضي",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "إجمالي المنشآت",
      value: (stats?.totalCompanies || 0).toLocaleString(),
      change: "+0% من الشهر الماضي",
      isPositive: true,
      icon: Building2,
    },
    {
      title: "إجمالي الطلبات",
      value: (stats?.totalOrders || 0).toLocaleString(),
      change: "-0% من الشهر الماضي",
      isPositive: false,
      icon: Package,
    },
    {
      title: "متوسط قيمة الطلب",
      value: `$${(stats?.averageOrderValue || 0).toLocaleString()}`,
      change: "+0% من الشهر الماضي",
      isPositive: true,
      icon: TrendingUp,
    },
  ];

  // Helper to map API status to UI styling
  const getStatusStyle = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'PAID': return { label: 'مكتمل', color: 'emerald' };
      case 'PENDING': return { label: 'معلق', color: 'amber' };
      case 'PARTIAL': return { label: 'جزئي', color: 'indigo' };
      case 'CANCELLED': return { label: 'ملغى', color: 'rose' };
      default: return { label: status || 'غير محدد', color: 'slate' };
    }
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium mb-1">
            <Sparkles className="w-4 h-4" />
            بيانات حية مباشرة (Live Data)
          </div>
          <h2 className="text-xl font-bold">لوحة التحكم متصلة الآن بقاعدة البيانات الخاصة بـ منظومة السحابية!</h2>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-900">نظرة عامة</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50">
            <span>آخر 30 يوم</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4 text-slate-400" />
            تصدير
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <card.icon className="w-4 h-4" />
                </div>
                {card.title}
              </div>
              <button className="text-slate-300 hover:text-slate-500 transition-colors">
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{card.value}</div>
            <div className={`text-xs font-bold ${card.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Bar Chart (Orders Volume) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-slate-500 text-sm font-medium">حجم الطلبات</p>
              <h3 className="text-2xl font-bold text-slate-900">{(stats?.totalOrders || 0).toLocaleString()}</h3>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50">
              <span>هذا الشهر</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {(stats?.mrrHistory?.length ? stats.mrrHistory : [30, 60, 50, 100, 20, 90, 80, 95, 100, 50, 30]).map((h, i) => {
              const height = typeof h === 'number' ? Math.max(10, Math.min(100, h/100)) : 10;
              return (
                <div key={i} className="w-full flex flex-col items-center gap-3">
                  <div className="w-full bg-slate-100 rounded-t-lg relative h-full flex items-end">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-lg transition-all duration-1000 hover:bg-indigo-600"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line Chart (Revenue Growth) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-slate-500 text-sm font-medium">إجمالي الإيرادات</p>
            <h3 className="text-2xl font-bold text-slate-900">${(stats?.totalRevenue || 0).toLocaleString()}</h3>
          </div>
          <div className="h-48 relative w-full flex items-end pb-8">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full stroke-indigo-500 fill-indigo-50">
               <path d="M0,30 C20,40 30,10 50,20 C70,30 80,5 100,10 L100,50 L0,50 Z" stroke="none" />
               <path d="M0,30 C20,40 30,10 50,20 C70,30 80,5 100,10" fill="none" strokeWidth="1.5" />
               <circle cx="0" cy="30" r="2" fill="white" strokeWidth="1" className="stroke-indigo-500" />
               <circle cx="25" cy="27" r="2" fill="white" strokeWidth="1" className="stroke-indigo-500" />
               <circle cx="50" cy="20" r="2" fill="white" strokeWidth="1" className="stroke-indigo-500" />
               <circle cx="75" cy="18" r="2" fill="white" strokeWidth="1" className="stroke-indigo-500" />
               <circle cx="100" cy="10" r="2" fill="white" strokeWidth="1" className="stroke-indigo-500" />
            </svg>
          </div>
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">أحدث المبيعات المجمعة (Live Invoices)</h2>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors">
               <ArrowUpLeft className="w-4 h-4" /> عرض الكل
             </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-200 overflow-x-auto scrollbar-hide">
          {["كل الفواتير"].map((tab, idx) => (
            <button 
              key={idx} 
              className={`py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 border-indigo-600 text-indigo-600`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="py-4 px-6 font-medium">رقم الفاتورة</th>
                <th className="py-4 px-6 font-medium">الشركة/المنشأة</th>
                <th className="py-4 px-6 font-medium">اسم العميل</th>
                <th className="py-4 px-6 font-medium">التاريخ</th>
                <th className="py-4 px-6 font-medium">الإجمالي</th>
                <th className="py-4 px-6 font-medium">الحالة</th>
                <th className="py-4 px-6 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {invoices.length > 0 ? invoices.map((inv, i) => {
                const statusInfo = getStatusStyle(inv.paymentStatus);
                return (
                  <tr key={inv.id || i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">{inv.receiptNumber}</td>
                    <td className="py-4 px-6 text-slate-600 font-bold">{inv.company?.name || 'غير متوفر'}</td>
                    <td className="py-4 px-6 text-slate-500">{inv.customerName || 'عميل عام'}</td>
                    <td className="py-4 px-6 text-slate-500">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('ar-EG') : '-'}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">${inv.total?.toLocaleString() || 0}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-${statusInfo.color}-50 text-${statusInfo.color}-600`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${statusInfo.color}-500`}></span>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 cursor-pointer hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-bold">
                    لا توجد فواتير أو مبيعات متاحة حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
