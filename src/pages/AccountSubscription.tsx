import React, { useState, useEffect } from 'react';
import { fetchClientPaymentMethods, fetchClientPaymentRequests, createClientPaymentRequest, fetchClientOverview } from '../lib/apiService';
import { Upload } from 'lucide-react';

export default function AccountSubscription() {
  const [methods, setMethods] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  
  const [uploading, setUploading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [planName, setPlanName] = useState('BASIC');

  const loadData = async () => {
    try {
      const [methodsData, requestsData, overviewData] = await Promise.all([
        fetchClientPaymentMethods(),
        fetchClientPaymentRequests(),
        fetchClientOverview()
      ]);
      setMethods(methodsData);
      setRequests(requestsData);
      setCompany(overviewData.company);
      if (overviewData.company?.planName) {
        setPlanName(overviewData.company.planName);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedMethod || !amount || !receiptUrl) {
      alert('يرجى تعبئة جميع الحقول ورفع الإيصال');
      return;
    }
    
    try {
      setUploading(true);
      await createClientPaymentRequest({
        methodId: selectedMethod,
        amount,
        planName,
        receiptUrl
      });
      alert('تم رفع الإيصال بنجاح. سيتم المراجعة وتفعيل اشتراكك قريباً.');
      setReceiptUrl('');
      setAmount('');
      loadData();
    } catch (err) {
      alert('فشل إرسال الطلب');
    } finally {
      setUploading(false);
    }
  };

  const activeMethod = methods.find(m => m.id === selectedMethod);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الاشتراك والدفع</h1>
        <p className="text-slate-500 mt-1">قم بتجديد اشتراكك أو ترقية خطتك من هنا.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">طرق الدفع المتاحة</h2>
        <p className="text-slate-500 mb-6 text-sm">اختر طريقة الدفع المناسبة لك وحول المبلغ المطلوب، ثم ارفع صورة الإيصال.</p>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">الطريقة</label>
            <select 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
              value={selectedMethod} 
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="">-- اختر طريقة الدفع --</option>
              {methods.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.provider}
                </option>
              ))}
            </select>
          </div>

          {activeMethod && (
            <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 flex items-start gap-4">
              {activeMethod.iconUrl && <img src={activeMethod.iconUrl} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-indigo-200" />}
              <div>
                <p className="font-bold text-lg mb-1">{activeMethod.details}</p>
                {activeMethod.instructions && <p className="text-sm text-indigo-700">{activeMethod.instructions}</p>}
              </div>
            </div>
          )}

          {activeMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">المبلغ المحول (جنيه)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="مثال: 500" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">الخطة المطلوبة</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
                  value={planName} 
                  onChange={(e) => setPlanName(e.target.value)}
                >
                  <option value="BASIC">BASIC</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 mb-2 block">صورة إيصال التحويل (Screenshot)</label>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  {receiptUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <img src={receiptUrl} alt="Receipt" className="w-32 h-32 rounded-lg object-cover border border-slate-200 shadow-sm" />
                      <label className="text-sm font-bold text-indigo-600 cursor-pointer hover:underline">
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        تغيير الصورة
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer w-full text-center">
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">اضغط هنا لرفع صورة الإيصال</span>
                      <span className="text-xs text-slate-500">صيغ الصور المدعومة: JPG, PNG</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 mt-2">
                <button 
                  onClick={handleSubmitRequest} 
                  disabled={uploading || !receiptUrl || !amount} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'جاري الإرسال...' : 'تأكيد إرسال الإيصال'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">تاريخ طلبات الدفع</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4">المبلغ</th>
                <th className="py-3 px-4">الطريقة</th>
                <th className="py-3 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-600">{new Date(r.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.amount} ج.م</td>
                  <td className="py-3 px-4 text-slate-600">{r.method?.name || '-'}</td>
                  <td className="py-3 px-4">
                    {r.status === 'PENDING' && <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs font-bold border border-amber-200">قيد المراجعة</span>}
                    {r.status === 'APPROVED' && <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold border border-emerald-200">تم التفعيل</span>}
                    {r.status === 'REJECTED' && <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-xs font-bold border border-rose-200">مرفوض</span>}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-slate-500 py-8 font-medium">لا توجد طلبات دفع سابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
