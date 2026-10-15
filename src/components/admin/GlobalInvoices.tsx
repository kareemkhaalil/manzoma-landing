import React, { useState, useEffect } from "react";
import { Search, Calendar, Store, User, Receipt, ChevronLeft, ChevronRight, Loader2, Eye, Printer, X, FileSpreadsheet, RefreshCw } from "lucide-react";
import { fetchGlobalInvoices, fetchCompanies, InvoiceFromAPI, CompanyFromAPI } from "../../lib/apiService";

type PeriodType = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'specificMonth' | 'all' | 'custom';

export default function GlobalInvoices() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceFromAPI[]>([]);
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceFromAPI | null>(null);

  // Filters
  const [periodType, setPeriodType] = useState<PeriodType>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');

  const periodLabels: Record<PeriodType, string> = {
    today: 'اليوم',
    yesterday: 'أمس',
    last7: 'آخر 7 أيام',
    last30: 'آخر 30 يوم',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    specificMonth: `شهر (${selectedMonth})`,
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
    } else if (periodType === 'custom') {
      if (customStartDate) startDate = new Date(customStartDate + 'T00:00:00').toISOString();
      if (customEndDate) endDate = new Date(customEndDate + 'T23:59:59').toISOString();
    }

    return { startDate, endDate };
  };

  const loadInvoices = () => {
    setLoading(true);
    const { startDate, endDate } = resolveDateRange();
    Promise.all([
      fetchGlobalInvoices({
        page,
        limit: 30,
        search,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        companyId: selectedCompanyId !== 'all' ? selectedCompanyId : undefined
      }),
      companies.length === 0 ? fetchCompanies().catch(() => []) : Promise.resolve(companies)
    ])
      .then(([res, comps]) => {
        setInvoices(res.data || []);
        setPagination(res.pagination || { pages: 1, total: 0 });
        if (companies.length === 0 && Array.isArray(comps)) {
          setCompanies(comps);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      loadInvoices();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, periodType, selectedMonth, customStartDate, customEndDate, selectedCompanyId]);

  useEffect(() => {
    loadInvoices();
  }, [page]);

  const handleExportCSV = () => {
    let csv = "\uFEFF";
    csv += `"سجل الفواتير العام - منظومة ERP"\n`;
    csv += `"تاريخ التصدير","${new Date().toLocaleString('ar-EG')}"\n`;
    csv += `"الفترة","${periodLabels[periodType]}"\n\n`;
    csv += `"رقم الفاتورة","المؤسسة / المتجر","اسم العميل","الكاشير","التاريخ والوقت","الإجمالي (ج.م)","الحالة"\n`;

    invoices.forEach(inv => {
      csv += `"${(inv.receiptNumber || inv.id).replace(/"/g, '""')}","${(inv.company?.name || 'عام').replace(/"/g, '""')}","${(inv.customerName || 'عميل نقدي').replace(/"/g, '""')}","${(inv.user?.fullName || inv.user?.username || 'كاشير').replace(/"/g, '""')}","${new Date(inv.createdAt).toLocaleString('ar-EG')}",${inv.total || 0},"${inv.paymentStatus || 'PAID'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `فواتير_المنظومة_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !selectedInvoice) return;
    
    printWindow.document.write(`
      <html dir="rtl">
      <head>
          <title>فاتورة #${selectedInvoice.receiptNumber}</title>
          <style>
              body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #eee; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f4f4f4; }
              .total { font-size: 20px; font-weight: bold; margin-top: 20px; text-align: left; }
          </style>
      </head>
      <body>
          <div class="header">
              <h2>${selectedInvoice.company?.name || 'مؤسسة تجارية'}</h2>
              <p>فاتورة بيع رقم: ${selectedInvoice.receiptNumber}</p>
              <p>التاريخ: ${new Date(selectedInvoice.createdAt).toLocaleDateString('ar-EG')}</p>
          </div>
          <p>العميل: ${selectedInvoice.customerName || 'عميل نقدي'}</p>
          <p>الكاشير: ${selectedInvoice.user?.fullName || 'غير معروف'}</p>
          
          <table>
              <thead>
                  <tr>
                      <th>المنتج</th>
                      <th>الكمية</th>
                      <th>السعر</th>
                      <th>المجموع</th>
                  </tr>
              </thead>
              <tbody>
                  ${selectedInvoice.items?.map(item => `
                      <tr>
                          <td>${item.productName || 'منتج'}</td>
                          <td>${item.quantity}</td>
                          <td>${item.unitPrice || item.price || 0}</td>
                          <td>${item.quantity * (item.unitPrice || item.price || 0)}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
          
          <div class="total">الإجمالي: ${selectedInvoice.total} ج.م</div>
          
          <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const pageInvoicesSum = invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">متصفح الفواتير العام والفلترة المتقدمة</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">
              عرض وتصفية وتصدير كافة الفواتير الصادرة من جميع المنشآت المسجلة ({pagination.total} فاتورة مطابقة)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Company Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <Store className="w-4 h-4 text-indigo-600" />
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">كل الشركات والمؤسسات</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <Calendar className="w-4 h-4 text-indigo-600" />
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

            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث برقم الفاتورة، العميل، أو المتجر..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
              />
            </div>

            {/* Export */}
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={invoices.length === 0}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير الفواتير (Excel)</span>
            </button>
          </div>
        </div>

        {/* Period Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'today', 'yesterday', 'last7', 'last30', 'thisMonth', 'lastMonth', 'custom'] as PeriodType[]).map(pt => (
              <button
                key={pt}
                type="button"
                onClick={() => setPeriodType(pt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  periodType === pt ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {periodLabels[pt]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-black">
            <span className="text-slate-500">إجمالي المعروض بالصفحة: <strong className="text-emerald-600">{pageInvoicesSum.toLocaleString()} ج.م</strong></span>
            <span className="text-slate-500">عدد الفواتير الكلي: <strong className="text-indigo-600">{pagination.total}</strong></span>
          </div>
        </div>

        {periodType === 'custom' && (
          <div className="flex flex-wrap items-center gap-4 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">من:</span>
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">إلى:</span>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold" />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
          <span className="text-sm font-bold text-slate-500">جاري تحميل الفواتير...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-right">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500">رقم الفاتورة</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500">المتجر / الشركة</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500">العميل</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500">التاريخ</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500">القيمة</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500">الحالة</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm font-bold text-slate-500">
                      لا توجد فواتير مطابقة للفترة أو البحث
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                          <Receipt className="w-4 h-4 text-indigo-600" />
                          {inv.receiptNumber}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <Store className="w-3.5 h-3.5 text-slate-500" />
                          {inv.company?.name || "عام"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <User className="w-3.5 h-3.5" />
                          {inv.customerName || "عميل نقدي"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(inv.createdAt).toLocaleString('ar-EG')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-emerald-600">{(inv.total || 0).toLocaleString()} ج.م</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          inv.paymentStatus === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {inv.paymentStatus === 'PAID' ? 'تم الدفع' : inv.paymentStatus || 'مؤكدة'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-2 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-slate-500"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                صفحة {page} من {pagination.pages} (إجمالي {pagination.total} فاتورة)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-lg">تفاصيل الفاتورة #{selectedInvoice.receiptNumber}</h3>
                  <p className="text-xs text-white/60 font-bold">{selectedInvoice.company?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50/40 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">العميل</span>
                  <span className="text-sm font-bold text-slate-900">{selectedInvoice.customerName || "عميل نقدي"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">بواسطة</span>
                  <span className="text-sm font-bold text-slate-900">{selectedInvoice.user?.fullName || "كاشير النظام"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">التاريخ والوقت</span>
                  <span className="text-sm font-bold text-slate-900">{new Date(selectedInvoice.createdAt).toLocaleString('ar-EG')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 px-1">الأصناف المباعة</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                        <th className="py-3 px-4">الصنف</th>
                        <th className="py-3 px-4">الكمية</th>
                        <th className="py-3 px-4">السعر</th>
                        <th className="py-3 px-4">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {selectedInvoice.items?.map((item, idx) => (
                        <tr key={idx} className="font-bold text-slate-900">
                          <td className="py-3 px-4">{item.productName || "صنف مبيعات"}</td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">{item.unitPrice || item.price || 0} ج.م</td>
                          <td className="py-3 px-4 font-black">{(item.quantity * (item.unitPrice || item.price || 0)).toLocaleString()} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-slate-500 font-bold text-sm">إجمالي قيمة الفاتورة</div>
                <div className="text-2xl font-black text-indigo-600">{selectedInvoice.total?.toLocaleString()} ج.م</div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-xs flex items-center gap-2 hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/20"
              >
                <Printer className="w-4 h-4" />
                طباعة نسخة
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-900 hover:bg-white transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
