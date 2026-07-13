import React, { useState, useEffect } from 'react';
import { fetchPaymentRequests, approvePaymentRequest, rejectPaymentRequest } from '../../lib/apiService';
import { CheckCircle2, XCircle, Eye, X } from 'lucide-react';

export default function PaymentApprovals() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchPaymentRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
      alert('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: string) => {
    if (confirm('هل أنت متأكد من تفعيل الاشتراك لهذا العميل بناءً على الإيصال؟')) {
      try {
        await approvePaymentRequest(id);
        loadRequests();
      } catch (err) {
        alert('فشل تفعيل الاشتراك');
      }
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
      try {
        await rejectPaymentRequest(id);
        loadRequests();
      } catch (err) {
        alert('فشل رفض الطلب');
      }
    }
  };

  if (loading) return <div className="text-slate-500">جاري التحميل...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">موافقات الدفع اليدوية</h2>
        <p className="text-slate-500 mt-1">مراجعة وتفعيل الاشتراكات بناءً على التحويلات البنكية أو المحافظ الإلكترونية المرفوعة من العملاء.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold">
              <th className="py-3 px-4">تاريخ الطلب</th>
              <th className="py-3 px-4">الشركة</th>
              <th className="py-3 px-4">الخطة</th>
              <th className="py-3 px-4">المبلغ</th>
              <th className="py-3 px-4">وسيلة الدفع</th>
              <th className="py-3 px-4">الإيصال</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-600">{new Date(req.createdAt).toLocaleString('ar-EG')}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{req.company?.name}</div>
                  <div className="text-xs text-slate-500">{req.company?.phone || '-'}</div>
                </td>
                <td className="py-3 px-4"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">{req.planName}</span></td>
                <td className="py-3 px-4 font-bold text-slate-900">{req.amount} ج.م</td>
                <td className="py-3 px-4 text-slate-600">{req.method?.name || '-'}</td>
                <td className="py-3 px-4">
                  {req.receiptUrl ? (
                    <button 
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium" 
                      onClick={() => setSelectedReceipt(req.receiptUrl)}
                    >
                      <Eye className="w-4 h-4" /> عرض الإيصال
                    </button>
                  ) : '-'}
                </td>
                <td className="py-3 px-4">
                  {req.status === 'PENDING' && <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs font-bold border border-amber-200">قيد المراجعة</span>}
                  {req.status === 'APPROVED' && <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold border border-emerald-200">تم التفعيل</span>}
                  {req.status === 'REJECTED' && <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-xs font-bold border border-rose-200">مرفوض</span>}
                </td>
                <td className="py-3 px-4">
                  {req.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button 
                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-1.5 rounded-lg flex items-center gap-1 font-bold text-xs" 
                        onClick={() => handleApprove(req.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> تفعيل
                      </button>
                      <button 
                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-1.5 rounded-lg flex items-center gap-1 font-bold text-xs" 
                        onClick={() => handleReject(req.id)}
                      >
                        <XCircle className="w-4 h-4" /> رفض
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-slate-500 py-8 font-medium">لا توجد طلبات دفع حالياً</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-bold text-lg">صورة إيصال التحويل</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setSelectedReceipt(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex justify-center bg-slate-50">
              <img src={selectedReceipt} alt="Receipt" className="max-w-full max-h-[70vh] object-contain rounded shadow-sm border border-slate-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
