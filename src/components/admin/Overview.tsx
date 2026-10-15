import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, 
  ShoppingCart, 
  ArrowUpLeft, 
  Download, 
  Calendar, 
  Search, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Sparkles, 
  Package, 
  Loader2, 
  Sliders, 
  ChevronDown, 
  RefreshCw, 
  Check, 
  Store,
  FileSpreadsheet,
  Wallet,
  Receipt,
  PieChart,
  Percent,
  RotateCcw
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  fetchGlobalStats, 
  fetchGlobalInvoices, 
  fetchCompanies, 
  type GlobalStats, 
  type InvoiceFromAPI, 
  type CompanyFromAPI 
} from "../../lib/apiService";

type PeriodType = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'specificMonth' | 'thisYear' | 'all' | 'custom';

export default function Overview() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [invoices, setInvoices] = useState<InvoiceFromAPI[]>([]);
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Filter States
  const [periodType, setPeriodType] = useState<PeriodType>('thisMonth');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showChartPeriodMenu, setShowChartPeriodMenu] = useState(false);
  const [chartMetric, setChartMetric] = useState<'sales' | 'netProfit' | 'orders'>('sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'companies' | 'invoices' | 'expenses'>('companies');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const chartMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPeriodDropdown(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
      if (chartMenuRef.current && !chartMenuRef.current.contains(event.target as Node)) {
        setShowChartPeriodMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resolveDateRange = () => {
    const now = new Date();
    let startDate = '';
    let endDate = '';

    if (periodType === 'today') {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const e = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      startDate = s.toISOString();
      endDate = e.toISOString();
    } else if (periodType === 'yesterday') {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
      const e = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
      startDate = s.toISOString();
      endDate = e.toISOString();
    } else if (periodType === 'last7') {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
      startDate = s.toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'last30') {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0);
      startDate = s.toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'thisMonth') {
      const s = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      startDate = s.toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'lastMonth') {
      const s = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
      const e = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      startDate = s.toISOString();
      endDate = e.toISOString();
    } else if (periodType === 'specificMonth' && selectedMonth) {
      const [y, m] = selectedMonth.split('-').map(Number);
      if (y && m) {
        const s = new Date(y, m - 1, 1, 0, 0, 0);
        const e = new Date(y, m, 0, 23, 59, 59);
        startDate = s.toISOString();
        endDate = e.toISOString();
      }
    } else if (periodType === 'thisYear') {
      const s = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      startDate = s.toISOString();
      endDate = now.toISOString();
    } else if (periodType === 'custom') {
      if (customStartDate) {
        startDate = new Date(customStartDate + 'T00:00:00').toISOString();
      }
      if (customEndDate) {
        endDate = new Date(customEndDate + 'T23:59:59').toISOString();
      }
    }

    return { startDate, endDate };
  };

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

  const loadData = async (isRefetch = false) => {
    if (isRefetch) setRefreshing(true);
    else setLoading(true);

    try {
      const { startDate, endDate } = resolveDateRange();
      const filterParams = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        companyId: selectedCompanyId !== 'all' ? selectedCompanyId : undefined
      };

      const [statsData, invoicesData, companiesData] = await Promise.all([
        fetchGlobalStats(filterParams),
        fetchGlobalInvoices({
          page: 1,
          limit: 50,
          search: searchQuery,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          companyId: selectedCompanyId !== 'all' ? selectedCompanyId : undefined
        }),
        companies.length === 0 ? fetchCompanies().catch(() => []) : Promise.resolve(companies)
      ]);

      setStats(statsData);
      setInvoices(invoicesData.data || []);
      if (companies.length === 0 && Array.isArray(companiesData)) {
        setCompanies(companiesData);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [periodType, selectedMonth, customStartDate, customEndDate, selectedCompanyId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Comprehensive Excel / CSV Export with UTF-8 BOM
  const handleExport = () => {
    setExporting(true);
    try {
      const currentCompanyName = selectedCompanyId === 'all' 
        ? 'كل المنشآت والمؤسسات' 
        : companies.find(c => c.id === selectedCompanyId)?.name || 'منشأة محددة';

      const periodLabel = periodType === 'custom' 
        ? `من ${customStartDate || 'البداية'} إلى ${customEndDate || 'اليوم'}`
        : periodLabels[periodType];

      let csvContent = "\uFEFF"; // UTF-8 BOM for Arabic Excel

      // Section 1: Executive Financial Summary
      csvContent += `"التقرير المالي والمحاسبي الشامل - لوحة تحكم السوبر أدمن (Manzoma ERP)"\n`;
      csvContent += `"تاريخ التصدير","${new Date().toLocaleString('ar-EG')}"\n`;
      csvContent += `"الفترة المحددة","${periodLabel}"\n`;
      csvContent += `"نطاق المنشآت","${currentCompanyName}"\n\n`;

      csvContent += `"ملخص قائمة الدخل والأرباح والخسائر"\n`;
      csvContent += `"البند المحاسبي","القيمة (ج.م)"\n`;
      csvContent += `"إجمالي المبيعات (قبل الخصم)","${stats?.totalSubTotal ?? stats?.totalRevenue ?? 0}"\n`;
      csvContent += `"إجمالي الخصومات الممنوحة","${stats?.totalDiscounts ?? 0}"\n`;
      csvContent += `"صافي المبيعات الفعلية","${stats?.totalRevenue ?? 0}"\n`;
      csvContent += `"إجمالي المرتجعات","${stats?.totalReturns ?? 0}"\n`;
      csvContent += `"تكلفة البضاعة المباعة (COGS)","${stats?.totalCOGS ?? 0}"\n`;
      csvContent += `"مجمل الربح (Gross Profit)","${stats?.grossProfit ?? 0}"\n`;
      csvContent += `"إجمالي المصروفات التشغيلية","${stats?.totalExpenses ?? 0}"\n`;
      csvContent += `"صافي الربح النهائي (Net Profit)","${stats?.netProfit ?? 0}"\n`;
      csvContent += `"هامش صافي الربح (%)","${stats?.profitMargin ?? 0}%"\n`;
      csvContent += `"إجمالي عدد الفواتير","${stats?.totalOrders ?? 0}"\n`;
      csvContent += `"متوسط قيمة الفاتورة","${Math.round(stats?.averageOrderValue ?? 0)}"\n\n`;

      // Section 2: Per-Company Financial Breakdown
      if (stats?.companyBreakdown && stats.companyBreakdown.length > 0) {
        csvContent += `"تفصيل الأداء المالي لكل منشأة على حدة"\n`;
        csvContent += `"اسم المنشأة","الباقة","عدد الفواتير","المبيعات الصافية (ج.م)","الخصومات (ج.م)","المرتجعات (ج.م)","تكلفة البضاعة COGS (ج.م)","مجمل الربح (ج.م)","المصروفات (ج.م)","صافي الربح النهائي (ج.م)","هامش الربح %"\n`;
        stats.companyBreakdown.forEach(c => {
          csvContent += `"${(c.name || '').replace(/"/g, '""')}","${c.planName}",${c.ordersCount},${c.totalSales},${c.discounts},${c.returns},${c.cogs},${c.grossProfit},${c.expenses},${c.netProfit},"${c.profitMargin}%"\n`;
        });
        csvContent += `\n`;
      }

      // Section 3: Timeline Breakdown (Days / Months)
      if (stats?.timelineData && stats.timelineData.length > 0) {
        csvContent += `"التحليل الزمني (الأيام / الشهور)"\n`;
        csvContent += `"الفترة / التاريخ","عدد الطلبات","المبيعات (ج.م)","التكلفة COGS (ج.م)","المصروفات (ج.م)","صافي الربح (ج.م)"\n`;
        stats.timelineData.forEach(t => {
          csvContent += `"${t.label}",${t.orders},${t.sales},${t.cogs},${t.expenses},${t.netProfit}\n`;
        });
        csvContent += `\n`;
      }

      // Section 4: Expenses List
      if (stats?.expensesList && stats.expensesList.length > 0) {
        csvContent += `"سجل المصروفات التشغيلية للفترة"\n`;
        csvContent += `"المنشأة","بند المصروف","التفاصيل","المبلغ (ج.م)","التاريخ"\n`;
        stats.expensesList.forEach(exp => {
          csvContent += `"${(exp.companyName || '').replace(/"/g, '""')}","${(exp.title || '').replace(/"/g, '""')}","${(exp.description || '').replace(/"/g, '""')}",${exp.amount},"${new Date(exp.date).toLocaleString('ar-EG')}"\n`;
        });
        csvContent += `\n`;
      }

      // Section 5: Invoices
      csvContent += `"سجل الفواتير الصادرة للفترة"\n`;
      csvContent += `"رقم الفاتورة","المؤسسة / المتجر","اسم العميل","الكاشير / المدير","التاريخ والوقت","الإجمالي (ج.م)","حالة الدفع"\n`;
      invoices.forEach(inv => {
        const receiptNo = `"${(inv.receiptNumber || inv.id.slice(0, 8)).replace(/"/g, '""')}"`;
        const compName = `"${(inv.company?.name || 'عام').replace(/"/g, '""')}"`;
        const custName = `"${(inv.customerName || 'عميل نقدي').replace(/"/g, '""')}"`;
        const userName = `"${(inv.user?.fullName || inv.user?.username || 'كاشير').replace(/"/g, '""')}"`;
        const dateStr = `"${new Date(inv.createdAt).toLocaleString('ar-EG')}"`;
        const totalAmt = `"${inv.total || 0}"`;
        const statusStr = `"${inv.paymentStatus || 'PAID'}"`;

        csvContent += `${receiptNo},${compName},${custName},${userName},${dateStr},${totalAmt},${statusStr}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeDate = new Date().toISOString().split('T')[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `التقرير_المالي_الشامل_منظومة_${safeDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const totalSalesVal = stats?.totalRevenue || 0;
  const totalCogsVal = stats?.totalCOGS || 0;
  const grossProfitVal = stats?.grossProfit ?? (totalSalesVal - totalCogsVal);
  const totalExpensesVal = stats?.totalExpenses || 0;
  const netProfitVal = stats?.netProfit ?? (grossProfitVal - totalExpensesVal);
  const totalDiscountsVal = stats?.totalDiscounts || 0;
  const totalReturnsVal = stats?.totalReturns || 0;
  const profitMarginVal = stats?.profitMargin ?? (totalSalesVal > 0 ? Number(((netProfitVal / totalSalesVal) * 100).toFixed(1)) : 0);

  const statCards = [
    {
      title: "صافي المبيعات الفعلية",
      value: `${totalSalesVal.toLocaleString()} ج.م`,
      subtitle: `قبل الخصم: ${(stats?.totalSubTotal || totalSalesVal).toLocaleString()} ج.م`,
      badge: `${stats?.totalOrders || 0} فاتورة`,
      icon: DollarSign,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200"
    },
    {
      title: "تكلفة البضاعة المباعة (COGS)",
      value: `${totalCogsVal.toLocaleString()} ج.م`,
      subtitle: `مجمل الربح: ${grossProfitVal.toLocaleString()} ج.م`,
      badge: totalSalesVal > 0 ? `${Math.round((totalCogsVal / totalSalesVal) * 100)}% من المبيعات` : '0%',
      icon: Package,
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200"
    },
    {
      title: "المصروفات والمرتجعات",
      value: `${totalExpensesVal.toLocaleString()} ج.م`,
      subtitle: `خصومات: ${totalDiscountsVal.toLocaleString()} | مرتجع: ${totalReturnsVal.toLocaleString()} ج.م`,
      badge: `${stats?.expensesList?.length || 0} بند مصروف`,
      icon: Wallet,
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200"
    },
    {
      title: "صافي الربح الحقيقي (Net Profit)",
      value: `${netProfitVal.toLocaleString()} ج.م`,
      subtitle: `بعد خصم التكلفة والمصروفات والمرتجعات`,
      badge: `هامش ربح ${profitMarginVal}%`,
      icon: netProfitVal >= 0 ? TrendingUp : TrendingDown,
      bg: netProfitVal >= 0 ? "bg-indigo-50" : "bg-rose-50",
      text: netProfitVal >= 0 ? "text-indigo-600" : "text-rose-600",
      border: netProfitVal >= 0 ? "border-indigo-200" : "border-rose-200"
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID': return { label: 'مكتمل', color: 'emerald' };
      case 'PENDING': return { label: 'معلق', color: 'amber' };
      case 'PARTIAL': return { label: 'جزئي', color: 'indigo' };
      case 'CANCELLED': return { label: 'ملغى', color: 'rose' };
      default: return { label: status || 'غير محدد', color: 'slate' };
    }
  };

  const selectedCompanyName = selectedCompanyId === 'all' 
    ? 'كل الشركات والمؤسسات' 
    : companies.find(c => c.id === selectedCompanyId)?.name || 'شركة محددة';

  const timeline = stats?.timelineData && stats.timelineData.length > 0
    ? stats.timelineData
    : (stats?.mrrHistory || [0, 0, 0, 0, 0, 0]).map((v, i) => ({
        key: String(i),
        label: `فترة ${i + 1}`,
        sales: v,
        orders: 0,
        cogs: 0,
        expenses: 0,
        netProfit: v
      }));

  const maxMetricVal = Math.max(
    ...timeline.map(t => chartMetric === 'sales' ? t.sales : chartMetric === 'netProfit' ? Math.max(0, t.netProfit) : t.orders),
    1
  );

  // Build SVG polyline points for dynamic revenue/profit curve
  const svgPoints = timeline.map((t, idx) => {
    const x = timeline.length > 1 ? (idx / (timeline.length - 1)) * 100 : 50;
    const val = Math.max(0, t.netProfit);
    const maxProfit = Math.max(...timeline.map(item => Math.max(0, item.netProfit)), 1);
    const y = 45 - (val / maxProfit) * 38;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            بيانات مالية ومحاسبية حية مباشرة (Real-Time Cloud Accounting)
          </div>
          <h2 className="text-xl font-bold">لوحة تحكم السوبر أدمن — الرقابة المالية والتحليلات الشاملة للمنشآت</h2>
        </div>
        <div className="relative z-10 mt-3 md:mt-0 flex items-center gap-3">
          <Link
            to="/admin/stats"
            className="px-4 py-2 rounded-xl bg-white text-indigo-700 text-xs font-black shadow-md hover:bg-indigo-50 transition-all flex items-center gap-1.5"
          >
            <PieChart className="w-4 h-4" />
            <span>مركز التقارير المالية المفصلة</span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🎛️ INTERACTIVE FINANCIAL FILTERS & EXPORT BAR */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5 shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>نظرة عامة والتحليل المالي الفوري</span>
              {refreshing && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              حدد المنشأة والفترة الزمنية (أيام / شهور / تاريخ مخصص) لعرض وتصدير الحسابات الحقيقية بدقة 100%
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
            
            {/* 1. Company Filter Dropdown */}
            <div className="relative" ref={companyDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-800 transition-colors shadow-xs"
              >
                <Store className="w-4 h-4 text-indigo-600" />
                <span>{selectedCompanyName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {showCompanyDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                    تصفية حسب المؤسسة / العميل
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    <button
                      type="button"
                      onClick={() => { setSelectedCompanyId('all'); setShowCompanyDropdown(false); }}
                      className={`w-full text-right px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${
                        selectedCompanyId === 'all' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>كل الشركات والمؤسسات ({companies.length})</span>
                      {selectedCompanyId === 'all' && <Check className="w-4 h-4" />}
                    </button>
                    {companies.map(c => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => { setSelectedCompanyId(c.id); setShowCompanyDropdown(false); }}
                        className={`w-full text-right px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${
                          selectedCompanyId === c.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {selectedCompanyId === c.id && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Period Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2.5 rounded-xl text-xs font-black text-indigo-900 transition-colors shadow-xs"
              >
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{periodLabels[periodType]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-500 mr-1" />
              </button>

              {showPeriodDropdown && (
                <div className="absolute left-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                    تحديد الفترة الزمنية (أيام / شهور)
                  </div>
                  {(Object.keys(periodLabels) as PeriodType[]).map((key) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        setPeriodType(key);
                        setShowPeriodDropdown(false);
                      }}
                      className={`w-full text-right px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors ${
                        periodType === key ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{periodLabels[key]}</span>
                      {periodType === key && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Direct Month Input (Always accessible for instant month jump) */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500">شهر محدد:</span>
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

            {/* 4. Refresh Button */}
            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={refreshing}
              title="تحديث البيانات الحية"
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* 5. Export Full Financial Report to Excel/CSV */}
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{exporting ? 'جاري التصدير...' : 'تصدير التقرير المالي (Excel)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Pills for 1-Click Switching */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 ml-1">انتقال سريع:</span>
          {(['today', 'yesterday', 'last7', 'last30', 'thisMonth', 'lastMonth', 'thisYear', 'all', 'custom'] as PeriodType[]).map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => setPeriodType(pt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodType === pt
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {periodLabels[pt]}
            </button>
          ))}
        </div>

        {/* Custom Date Range Inputs */}
        {periodType === 'custom' && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 bg-indigo-50/50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">من تاريخ:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">إلى تاريخ:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 💰 REAL ACCOUNTING KPI CARDS */}
      {/* ======================================================== */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-36 animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              <div className="h-8 bg-slate-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card, idx) => (
            <div key={idx} className={`bg-white rounded-2xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5 text-slate-700 font-black text-xs">
                  <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center ${card.text}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <span>{card.title}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${card.bg} ${card.text}`}>
                  {card.badge}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1.5 tracking-tight">{card.value}</div>
              <div className="text-[11px] font-bold text-slate-500">
                {card.subtitle}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 📊 CHARTS SECTION (Interactive Daily / Monthly Timeline) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Main Interactive Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-slate-500 text-xs font-bold">التحليل الزمني التفاعلي ({periodLabels[periodType]})</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {chartMetric === 'sales' && `إجمالي المبيعات: ${totalSalesVal.toLocaleString()} ج.م`}
                {chartMetric === 'netProfit' && `صافي الأرباح: ${netProfitVal.toLocaleString()} ج.م`}
                {chartMetric === 'orders' && `حجم الطلبات: ${(stats?.totalOrders || 0).toLocaleString()} فاتورة`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Metric Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setChartMetric('sales')}
                  className={`px-3 py-1 rounded-lg transition-all ${chartMetric === 'sales' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
                >
                  المبيعات
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('netProfit')}
                  className={`px-3 py-1 rounded-lg transition-all ${chartMetric === 'netProfit' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'}`}
                >
                  صافي الربح
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('orders')}
                  className={`px-3 py-1 rounded-lg transition-all ${chartMetric === 'orders' ? 'bg-white text-violet-600 shadow-xs' : 'text-slate-600'}`}
                >
                  الطلبات
                </button>
              </div>

              {/* Interactive Period Selector inside Chart */}
              <div className="relative" ref={chartMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowChartPeriodMenu(!showChartPeriodMenu)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700"
                >
                  <span>{periodLabels[periodType]}</span>
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                </button>
                {showChartPeriodMenu && (
                  <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-40 py-1">
                    {(['today', 'last7', 'last30', 'thisMonth', 'lastMonth', 'thisYear', 'all'] as PeriodType[]).map(k => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => { setPeriodType(k); setShowChartPeriodMenu(false); }}
                        className={`w-full text-right px-3 py-2 text-xs font-bold flex items-center justify-between ${periodType === k ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <span>{periodLabels[k]}</span>
                        {periodType === k && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="h-52 flex items-end justify-between gap-2 px-2 pt-6 overflow-x-auto">
            {timeline.map((t, i) => {
              const rawVal = chartMetric === 'sales' ? t.sales : chartMetric === 'netProfit' ? t.netProfit : t.orders;
              const height = Math.max(8, Math.min(100, (Math.max(0, rawVal) / maxMetricVal) * 100));
              const barColor = chartMetric === 'sales' ? 'bg-indigo-600 hover:bg-indigo-700' : chartMetric === 'netProfit' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-violet-500 hover:bg-violet-600';
              return (
                <div key={t.key || i} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 h-full justify-end group relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-20 pointer-events-none shadow-md">
                    {t.label}: {rawVal.toLocaleString()} {chartMetric !== 'orders' ? 'ج.م' : 'طلب'}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-xl relative h-36 flex items-end overflow-hidden">
                    <div 
                      className={`w-full ${barColor} rounded-t-xl transition-all duration-500`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 truncate max-w-[60px]">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Net Profit & Income Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold">ملخص قائمة الدخل للفترة</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{netProfitVal.toLocaleString()} ج.م</h3>
            <p className="text-[11px] font-bold text-slate-400">صافي الربح بعد التكلفة والمصروفات</p>
          </div>

          <div className="my-4 space-y-2.5 text-xs border-y border-slate-100 py-4">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-500">إجمالي المبيعات الصافية:</span>
              <span className="text-slate-900">{totalSalesVal.toLocaleString()} ج.م</span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-500">(-) تكلفة البضاعة (COGS):</span>
              <span className="text-rose-600">-{totalCogsVal.toLocaleString()} ج.م</span>
            </div>
            <div className="flex items-center justify-between font-black border-t border-dashed border-slate-200 pt-1.5">
              <span className="text-slate-700">(=) مجمل الربح:</span>
              <span className="text-indigo-600">{grossProfitVal.toLocaleString()} ج.م</span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-500">(-) المصروفات التشغيلية:</span>
              <span className="text-amber-600">-{totalExpensesVal.toLocaleString()} ج.م</span>
            </div>
            <div className="flex items-center justify-between font-black border-t border-slate-200 pt-2 text-sm">
              <span className="text-slate-900">(=) صافي الربح:</span>
              <span className={netProfitVal >= 0 ? "text-emerald-600" : "text-rose-600"}>
                {netProfitVal.toLocaleString()} ج.م
              </span>
            </div>
          </div>

          <div className="h-20 relative w-full">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full stroke-emerald-500 fill-emerald-50/60">
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                points={svgPoints || "0,40 50,25 100,10"}
              />
            </svg>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 📑 MULTI-TAB DETAILED FINANCIAL TABLES */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'companies'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>التقرير المالي للمنشآت ({stats?.companyBreakdown?.length || 0})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'invoices'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>سجل الفواتير المفلترة ({invoices.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'expenses'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>سجل المصروفات ({stats?.expensesList?.length || 0})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث سريع في الجدول..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PER-COMPANY FINANCIAL BREAKDOWN */}
        {activeTab === 'companies' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-black">
                  <th className="py-3.5 px-4">المنشأة / المتجر</th>
                  <th className="py-3.5 px-4">عدد الفواتير</th>
                  <th className="py-3.5 px-4">صافي المبيعات</th>
                  <th className="py-3.5 px-4">الخصومات</th>
                  <th className="py-3.5 px-4">تكلفة البضاعة (COGS)</th>
                  <th className="py-3.5 px-4">مجمل الربح</th>
                  <th className="py-3.5 px-4">المصروفات</th>
                  <th className="py-3.5 px-4">صافي الربح النهائي</th>
                  <th className="py-3.5 px-4">هامش الربح</th>
                  <th className="py-3.5 px-4">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(stats?.companyBreakdown || [])
                  .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((c) => (
                  <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{c.ordersCount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">{c.totalSales.toLocaleString()} ج.م</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">{c.discounts.toLocaleString()} ج.م</td>
                    <td className="py-3.5 px-4 font-bold text-slate-600">{c.cogs.toLocaleString()} ج.م</td>
                    <td className="py-3.5 px-4 font-black text-indigo-600">{c.grossProfit.toLocaleString()} ج.م</td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">{c.expenses.toLocaleString()} ج.م</td>
                    <td className={`py-3.5 px-4 font-black ${c.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {c.netProfit.toLocaleString()} ج.م
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-black ${c.profitMargin >= 20 ? 'bg-emerald-100 text-emerald-700' : c.profitMargin > 0 ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                        {c.profitMargin}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCompanyId(c.id === selectedCompanyId ? 'all' : c.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[11px]"
                      >
                        {selectedCompanyId === c.id ? 'إلغاء الفلتر' : 'تركيز على المنشأة'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: FILTERED INVOICES */}
        {activeTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-600 font-black">
                  <th className="py-3.5 px-6">رقم الفاتورة</th>
                  <th className="py-3.5 px-6">الشركة / المنشأة</th>
                  <th className="py-3.5 px-6">اسم العميل</th>
                  <th className="py-3.5 px-6">الكاشير</th>
                  <th className="py-3.5 px-6">التاريخ والوقت</th>
                  <th className="py-3.5 px-6">الإجمالي</th>
                  <th className="py-3.5 px-6">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.length > 0 ? invoices.map((inv, i) => {
                  const statusInfo = getStatusStyle(inv.paymentStatus);
                  return (
                    <tr key={inv.id || i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                        {inv.receiptNumber || `#${inv.id?.slice(0, 8)}`}
                      </td>
                      <td className="py-3.5 px-6 text-slate-700 font-bold">
                        {inv.company?.name || 'غير متوفر'}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium">
                        {inv.customerName || 'عميل نقدي'}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium">
                        {inv.user?.fullName || inv.user?.username || 'كاشير'}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                      </td>
                      <td className="py-3.5 px-6 font-black text-slate-900">
                        {(inv.total || 0).toLocaleString()} ج.م
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-${statusInfo.color}-50 text-${statusInfo.color}-600`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                      لا توجد فواتير مطابقة للفترة المحددة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: EXPENSES BREAKDOWN */}
        {activeTab === 'expenses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-600 font-black">
                  <th className="py-3.5 px-6">المنشأة</th>
                  <th className="py-3.5 px-6">بند المصروف</th>
                  <th className="py-3.5 px-6">البيان / التفاصيل</th>
                  <th className="py-3.5 px-6">التاريخ</th>
                  <th className="py-3.5 px-6">المبلغ (ج.م)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(stats?.expensesList || []).length > 0 ? (stats?.expensesList || []).map((exp, idx) => (
                  <tr key={exp.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-indigo-700">{exp.companyName}</td>
                    <td className="py-3.5 px-6 font-black text-slate-900">{exp.title}</td>
                    <td className="py-3.5 px-6 font-medium text-slate-500">{exp.description || '-'}</td>
                    <td className="py-3.5 px-6 text-slate-500">{new Date(exp.date).toLocaleString('ar-EG')}</td>
                    <td className="py-3.5 px-6 font-black text-rose-600">{exp.amount.toLocaleString()} ج.م</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                      لا توجد مصروفات مسجلة في هذه الفترة الزمنية
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
