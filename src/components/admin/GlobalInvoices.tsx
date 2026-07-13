import React, { useState, useEffect } from "react";
import { Search, Calendar, Store, User, Receipt, ChevronLeft, ChevronRight, Loader2, Eye, Printer, X } from "lucide-react";
import { fetchGlobalInvoices, InvoiceFromAPI } from "../../lib/apiService";

export default function GlobalInvoices() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceFromAPI[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceFromAPI | null>(null);

  const loadInvoices = () => {
    setLoading(true);
    fetchGlobalInvoices(page, search)
      .then(res => {
        setInvoices(res.data);
        setPagination(res.pagination);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      loadInvoices();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    loadInvoices();
  }, [page]);

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
                            <td>${item.unitPrice}</td>
                            <td>${item.quantity * item.unitPrice}</td>
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

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">متصفح الفواتير العام</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">عرض كافة الفواتير الصادرة من جميع المؤسسات المسجلة</p>
        </div>

        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="بحث برقم الفاتورة، العميل، أو اسم المتجر..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/10 w-80"
          />
        </div>
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
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">رقم الفاتورة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">المؤسسة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">العميل</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">التاريخ</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">الإجمالي</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/10">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{inv.receiptNumber || `#${inv.id.slice(0,8)}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Store className="w-4 h-4 text-indigo-600" />
                        {inv.company?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                         <User className="w-4 h-4 text-slate-500" />
                         {inv.customerName || "عميل نقدي"}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                       {new Date(inv.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        {inv.total.toLocaleString()} ج.م
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-2 hover:bg-brand-navy hover:text-white rounded-xl text-slate-500 transition-all inline-flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center font-bold text-slate-500">لا توجد فواتير مطابقة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50/20 px-6 py-4 flex items-center justify-between border-t border-slate-200">
             <span className="text-xs font-bold text-slate-500">إجمالي النتائج: {pagination.total}</span>
             <div className="flex items-center gap-2">
               <button 
                 disabled={page <= 1}
                 onClick={() => setPage(p => p-1)}
                 className="p-2 bg-white border rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-all"
                >
                 <ChevronRight className="w-4 h-4" />
               </button>
               <span className="text-sm font-bold text-slate-900">صفحة {page} من {pagination.pages}</span>
               <button 
                 disabled={page >= pagination.pages}
                 onClick={() => setPage(p => p+1)}
                 className="p-2 bg-white border rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-all"
                >
                 <ChevronLeft className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Invoice View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-navy/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-sm w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
             <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-lg">تفاصيل الفاتورة</h3>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="flex justify-between items-start bg-slate-50 p-5 rounded-2xl">
                   <div>
                     <p className="text-xs font-bold text-slate-500 uppercase">المؤسسة</p>
                     <p className="font-black text-xl text-slate-900 mt-1">{selectedInvoice.company?.name}</p>
                   </div>
                   <div className="text-left">
                     <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">مدفوعة</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-2xl p-4">
                     <p className="text-xs font-bold text-slate-500">رقم الفاتورة</p>
                     <p className="font-bold text-slate-900 mt-0.5">{selectedInvoice.receiptNumber || 'بدون'}</p>
                  </div>
                  <div className="border rounded-2xl p-4">
                     <p className="text-xs font-bold text-slate-500">التاريخ والوقت</p>
                     <p className="font-bold text-slate-900 mt-0.5">{new Date(selectedInvoice.createdAt).toLocaleString('ar-EG')}</p>
                  </div>
                  <div className="border rounded-2xl p-4">
                     <p className="text-xs font-bold text-slate-500">العميل</p>
                     <p className="font-bold text-slate-900 mt-0.5">{selectedInvoice.customerName || 'عميل نقدي'}</p>
                  </div>
                  <div className="border rounded-2xl p-4">
                     <p className="text-xs font-bold text-slate-500">المدير / الكاشير</p>
                     <p className="font-bold text-slate-900 mt-0.5">{selectedInvoice.user?.fullName || selectedInvoice.user?.username || 'غير محدد'}</p>
                  </div>
                </div>

                <div>
                  <p className="font-black text-slate-900 mb-3">العناصر المبيعة</p>
                  <div className="border rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-right font-bold">المنتج</th>
                          <th className="px-4 py-2 text-center font-bold">الكمية</th>
                          <th className="px-4 py-2 text-left font-bold">المجموع</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedInvoice.items?.map((item,idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-slate-900 font-bold">{item.productName || 'عنصر فاتورة'}</td>
                            <td className="px-4 py-3 text-center font-black text-slate-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-left font-bold">{(item.quantity * item.unitPrice).toLocaleString()} ج.م</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                   <span className="font-black text-lg text-slate-900">الإجمالي النهائي</span>
                   <span className="font-black text-2xl text-emerald-600">{selectedInvoice.total.toLocaleString()} ج.م</span>
                </div>
             </div>

             <div className="p-4 bg-slate-50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="px-6 py-3 bg-white border rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  إغلاق
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-6 py-3 bg-brand-navy text-white rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                   <Printer className="w-4 h-4" />
                   طباعة الفاتورة
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
