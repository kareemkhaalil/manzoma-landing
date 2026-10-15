import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart, 
  Loader2, 
  Calendar, 
  Store, 
  FileSpreadsheet, 
  RefreshCw, 
  Wallet, 
  PieChart, 
  ArrowUpDown,
  Receipt
} from "lucide-react";
import { fetchGlobalStats, GlobalStats, fetchCompanies, CompanyFromAPI } from "../../lib/apiService";

type PeriodType = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'specificMonth' | 'thisYear' | 'all' | 'custom';

export default function StatsPage() {
  const [liveStats, setLiveStats] = useState<GlobalStats | null>(null);
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter States
  const [periodType, setPeriodType] = useState<PeriodType>('thisMonth');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'totalSales' | 'netProfit' | 'ordersCount'>('totalSales');

  const periodLabels: Record<PeriodType, string> = {
    today: 'اليوم',
    yesterday: 'أمس',
    last7: 'آخر 7 أيام',
    last30: 'آخر 30 يوم',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    specificMonth: `شهر (${selectedMonth})`,
    thisYear: 'هذا العام',
    all: 'كل الأوقات',
    custom: 'فترة مخصصة'
  };

  const resolveDateRange = () => {
    const now = new Date();
    let startDate = '';
    let endDate = '';

    if (periodType === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
    } else if (periodType === 'yesterday') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0).toISOString();
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59).toISOString();
    } else if (periodType === 'last7') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0).toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'last30') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0).toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'lastMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0).toISOString();
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
    } else if (periodType === 'specificMonth' && selectedMonth) {
      const [y, m] = selectedMonth.split('-').map(Number);
      if (y && m) {
        startDate = new Date(y, m - 1, 1, 0, 0, 0).toISOString();
        endDate = new Date(y, m, 0, 23, 59, 59).toISOString();
      }
    } else if (periodType === 'thisYear') {
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0).toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'custom') {
      if (customStartDate) startDate = new Date(customStartDate + 'T00:00:00').toISOString();
      if (customEndDate) endDate = new Date(customEndDate + 'T23:59:59').toISOString();
    }

    return { startDate, endDate };
  };

  const loadFinancials = async (isRefetch = false) => {
    if (isRefetch) setRefreshing(true);
    else setLoading(true);

    try {
      const { startDate, endDate } = resolveDateRange();
      const [statsRes, compsRes] = await Promise.all([
        fetchGlobalStats({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          companyId: selectedCompanyId !== 'all' ? selectedCompanyId : undefined
        }),
        companies.length === 0 ? fetchCompanies().catch(() => []) : Promise.resolve(companies)
      ]);
      setLiveStats(statsRes);
      if (companies.length === 0 && Array.isArray(compsRes)) {
        setCompanies(compsRes);
      }
    } catch (err) {
      console.error("Failed to load financial reports:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFinancials(true);
  }, [periodType, selectedMonth, customStartDate, customEndDate, selectedCompanyId]);

  const handleExportReport = () => {
    const currentCompanyName = selectedCompanyId === 'all'
      ? 'جميع المنشآت'
      : companies.find(c => c.id === selectedCompanyId)?.name || 'منشأة محددة';

    let csv = "\uFEFF";
    csv += `"مركز التقارير المالية والمحاسبية الشاملة - منظومة ERP"\n`;
    csv += `"تاريخ استخراج التقرير","${new Date().toLocaleString('ar-EG')}"\n`;
    csv += `"الفترة الزمنية","${periodLabels[periodType]}"\n`;
    csv += `"المنشأة","${currentCompanyName}"\n\n`;

    csv += `"أولاً: قائمة الدخل والأرباح والخسائر (Income Statement)"\n`;
    csv += `"البند المحاسبي","المبلغ (ج.م)"\n`;
    csv += `"إجمالي المبيعات (قبل الخصم)","${liveStats?.totalSubTotal ?? liveStats?.totalRevenue ?? 0}"\n`;
    csv += `"(-) الخصومات الممنوحة","${liveStats?.totalDiscounts ?? 0}"\n`;
    csv += `"(-) المرتجعات","${liveStats?.totalReturns ?? 0}"\n`;
    csv += `"(=) صافي المبيعات","${liveStats?.netSales ?? liveStats?.totalRevenue ?? 0}"\n`;
    csv += `"(-) تكلفة البضاعة المباعة (COGS)","${liveStats?.totalCOGS ?? 0}"\n`;
    csv += `"(=) مجمل الربح (Gross Profit)","${liveStats?.grossProfit ?? 0}"\n`;
    csv += `"(-) المصروفات التشغيلية","${liveStats?.totalExpenses ?? 0}"\n`;
    csv += `"(=) صافي الربح النهائي (Net Profit)","${liveStats?.netProfit ?? 0}"\n`;
    csv += `"نسبة هامش الربح الصافي","${liveStats?.profitMargin ?? 0}%"\n\n`;

    if (liveStats?.companyBreakdown?.length) {
      csv += `"ثانياً: مصفوفة الأداء المالي للمنشآت"\n`;
      csv += `"اسم المنشأة","عدد الفواتير","المبيعات الصافية","الخصومات","المرتجعات","التكلفة COGS","مجمل الربح","المصروفات","صافي الربح","هامش الربح %"\n`;
      liveStats.companyBreakdown.forEach(c => {
        csv += `"${c.name}",${c.ordersCount},${c.totalSales},${c.discounts},${c.returns},${c.cogs},${c.grossProfit},${c.expenses},${c.netProfit},"${c.profitMargin}%"\n`;
      });
      csv += `\n`;
    }

    if (liveStats?.timelineData?.length) {
      csv += `"ثالثاً: التحليل الزمني (يومي / شهري)"\n`;
      csv += `"التاريخ / الفترة","عدد الطلبات","المبيعات","التكلفة COGS","المصروفات","صافي الربح"\n`;
      liveStats.timelineData.forEach(t => {
        csv += `"${t.label}",${t.orders},${t.sales},${t.cogs},${t.expenses},${t.netProfit}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `التقارير_المالية_المفصلة_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const grossSales = liveStats?.totalSubTotal || liveStats?.totalRevenue || 0;
  const discounts = liveStats?.totalDiscounts || 0;
  const returns = liveStats?.totalReturns || 0;
  const netSales = liveStats?.netSales ?? (liveStats?.totalRevenue || 0) - returns;
  const cogs = liveStats?.totalCOGS || 0;
  const grossProfit = liveStats?.grossProfit ?? (netSales - cogs);
  const expenses = liveStats?.totalExpenses || 0;
  const netProfit = liveStats?.netProfit ?? (grossProfit - expenses);
  const profitMargin = liveStats?.profitMargin ?? (netSales > 0 ? Number(((netProfit / netSales) * 100).toFixed(1)) : 0);

  const sortedCompanies = [...(liveStats?.companyBreakdown || [])].sort((a, b) => {
    if (sortBy === 'netProfit') return b.netProfit - a.netProfit;
    if (sortBy === 'ordersCount') return b.ordersCount - a.ordersCount;
    return b.totalSales - a.totalSales;
  });

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-indigo-600" />
              <span>مركز الإحصائيات والتقارير المالية والمحاسبية</span>
              {refreshing && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1">
              قوائم الدخل، صافي الأرباح الحقيقية، تكلفة البضاعة المباعة (COGS)، والمصروفات الفعلية لجميع المنشآت
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Company Select */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <Store className="w-4 h-4 text-indigo-600" />
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">كل الشركات والمؤسسات ({companies.length})</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Month Picker */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-500">الشهر:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setPeriodType('specificMonth');
                }}
                className="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => loadFinancials(true)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md shadow-emerald-600/20"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير القوائم المالية (Excel)</span>
            </button>
          </div>
        </div>

        {/* Period Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 ml-1">الفترة الزمنية:</span>
          {(['today', 'yesterday', 'last7', 'last30', 'thisMonth', 'lastMonth', 'thisYear', 'all', 'custom'] as PeriodType[]).map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => setPeriodType(pt)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                periodType === pt
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {periodLabels[pt]}
            </button>
          ))}
        </div>

        {periodType === 'custom' && (
          <div className="flex flex-wrap items-center gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">من تاريخ:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">إلى تاريخ:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {/* 1. Full Income Statement (قائمة الدخل الشاملة) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">قائمة الدخل والأرباح والخسائر المحاسبية (P&L Statement)</h2>
                <p className="text-xs font-bold text-slate-500">حساب دقيق للمبيعات، الخصومات، تكلفة البضاعة، المصروفات، وصافي الربح</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-black">
                {periodLabels[periodType]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-500">1. إجمالي المبيعات (قبل الخصم)</p>
                <p className="text-xl font-black text-slate-900 mt-1">{grossSales.toLocaleString()} ج.م</p>
                <p className="text-[11px] font-bold text-amber-600 mt-1">
                  (-) خصومات: {discounts.toLocaleString()} | (-) مرتجع: {returns.toLocaleString()} ج.م
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-800">2. صافي المبيعات الفعلية</p>
                <p className="text-xl font-black text-emerald-700 mt-1">{netSales.toLocaleString()} ج.م</p>
                <p className="text-[11px] font-bold text-emerald-600 mt-1">
                  من إجمالي {liveStats?.totalOrders || 0} فاتورة مؤكدة
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <p className="text-xs font-bold text-blue-800">3. مجمل الربح (بعد خصم التكلفة)</p>
                <p className="text-xl font-black text-blue-700 mt-1">{grossProfit.toLocaleString()} ج.م</p>
                <p className="text-[11px] font-bold text-slate-600 mt-1">
                  (-) تكلفة البضاعة (COGS): {cogs.toLocaleString()} ج.م
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${netProfit >= 0 ? 'bg-indigo-50/70 border-indigo-200' : 'bg-rose-50 border-rose-200'}`}>
                <p className="text-xs font-bold text-indigo-900">4. صافي الربح النهائي (Net Profit)</p>
                <p className={`text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-indigo-700' : 'text-rose-600'}`}>
                  {netProfit.toLocaleString()} ج.م
                </p>
                <p className="text-[11px] font-bold text-rose-600 mt-1">
                  (-) المصروفات: {expenses.toLocaleString()} ج.م | الهامش: {profitMargin}%
                </p>
              </div>
            </div>
          </div>

          {/* 2. Per-Company Financial Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">مصفوفة الأداء المالي المفصل لكل منشأة</h2>
                <p className="text-xs font-bold text-slate-500">مقارنة المبيعات، التكلفة، المصروفات، وصافي الربح الحقيقي لكل مشترك</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-500">ترتيب حسب:</span>
                <button
                  type="button"
                  onClick={() => setSortBy('totalSales')}
                  className={`px-3 py-1.5 rounded-lg ${sortBy === 'totalSales' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  الأعلى مبيعاً
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('netProfit')}
                  className={`px-3 py-1.5 rounded-lg ${sortBy === 'netProfit' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  الأعلى صافي ربح
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('ordersCount')}
                  className={`px-3 py-1.5 rounded-lg ${sortBy === 'ordersCount' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  عدد الفواتير
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                    <th className="py-3.5 px-4">المنشأة</th>
                    <th className="py-3.5 px-4">عدد الفواتير</th>
                    <th className="py-3.5 px-4">المبيعات قبل الخصم</th>
                    <th className="py-3.5 px-4">الخصومات</th>
                    <th className="py-3.5 px-4">صافي المبيعات</th>
                    <th className="py-3.5 px-4">تكلفة البضاعة (COGS)</th>
                    <th className="py-3.5 px-4">مجمل الربح</th>
                    <th className="py-3.5 px-4">المصروفات</th>
                    <th className="py-3.5 px-4">صافي الربح</th>
                    <th className="py-3.5 px-4">هامش الربح</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedCompanies.map((c) => (
                    <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{c.ordersCount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-600">{c.grossSales.toLocaleString()} ج.م</td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">{c.discounts.toLocaleString()} ج.م</td>
                      <td className="py-3.5 px-4 font-black text-emerald-700">{c.totalSales.toLocaleString()} ج.م</td>
                      <td className="py-3.5 px-4 font-bold text-slate-600">{c.cogs.toLocaleString()} ج.م</td>
                      <td className="py-3.5 px-4 font-black text-blue-600">{c.grossProfit.toLocaleString()} ج.م</td>
                      <td className="py-3.5 px-4 font-bold text-rose-600">{c.expenses.toLocaleString()} ج.م</td>
                      <td className={`py-3.5 px-4 font-black ${c.netProfit >= 0 ? 'text-indigo-700' : 'text-rose-600'}`}>
                        {c.netProfit.toLocaleString()} ج.م
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${c.profitMargin >= 15 ? 'bg-emerald-100 text-emerald-700' : c.profitMargin > 0 ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                          {c.profitMargin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Timeline Daily / Monthly Breakdown Table */}
          {liveStats?.timelineData && liveStats.timelineData.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-black text-slate-900">كشف الحساب الزمني المفصل (الأيام / الشهور)</h2>
                <p className="text-xs font-bold text-slate-500">تفصيل الإيرادات والتكلفة والمصروفات وصافي الربح لكل فترة زمنية</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                      <th className="py-3.5 px-6">التاريخ / الفترة</th>
                      <th className="py-3.5 px-6">عدد الفواتير</th>
                      <th className="py-3.5 px-6">صافي المبيعات</th>
                      <th className="py-3.5 px-6">تكلفة البضاعة (COGS)</th>
                      <th className="py-3.5 px-6">المصروفات التشغيلية</th>
                      <th className="py-3.5 px-6">صافي الربح</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {liveStats.timelineData.map((t, idx) => (
                      <tr key={t.key || idx} className="hover:bg-slate-50">
                        <td className="py-3.5 px-6 font-black text-slate-900">{t.label}</td>
                        <td className="py-3.5 px-6 font-bold text-slate-700">{t.orders.toLocaleString()}</td>
                        <td className="py-3.5 px-6 font-black text-emerald-700">{t.sales.toLocaleString()} ج.م</td>
                        <td className="py-3.5 px-6 font-bold text-slate-600">{t.cogs.toLocaleString()} ج.م</td>
                        <td className="py-3.5 px-6 font-bold text-rose-600">{t.expenses.toLocaleString()} ج.م</td>
                        <td className={`py-3.5 px-6 font-black ${t.netProfit >= 0 ? 'text-indigo-700' : 'text-rose-600'}`}>
                          {t.netProfit.toLocaleString()} ج.م
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
