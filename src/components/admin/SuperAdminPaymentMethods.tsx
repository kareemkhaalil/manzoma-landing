import React, { useState, useEffect } from 'react';
import { fetchPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../../lib/apiService';
import { Plus, Trash2, Edit2, Upload, X } from 'lucide-react';

export default function SuperAdminPaymentMethods() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<any>({ name: '', provider: 'VODAFONE_CASH', details: '', instructions: '', iconUrl: '', isActive: true });

  const loadMethods = async () => {
    try {
      setLoading(true);
      const data = await fetchPaymentMethods();
      setMethods(data);
    } catch (err) {
      console.error(err);
      alert('فشل تحميل طرق الدفع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMethod({ ...currentMethod, iconUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (currentMethod.id) {
        await updatePaymentMethod(currentMethod.id, currentMethod);
      } else {
        await createPaymentMethod(currentMethod);
      }
      setIsEditing(false);
      loadMethods();
    } catch (err) {
      console.error(err);
      alert('فشل الحفظ');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف طريقة الدفع؟')) {
      try {
        await deletePaymentMethod(id);
        loadMethods();
      } catch (err) {
        alert('لا يمكن الحذف، قد تكون هناك طلبات دفع مرتبطة بهذه الطريقة');
      }
    }
  };

  if (loading && !isEditing) return <div className="text-slate-500">جاري التحميل...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">طرق الدفع (الاشتراكات)</h2>
          <p className="text-slate-500 mt-1">إدارة حسابات الدفع التي سيحول عليها العملاء (فودافون كاش، إنستا باي، بنك)</p>
        </div>
        {!isEditing && (
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            onClick={() => { setCurrentMethod({ name: '', provider: 'VODAFONE_CASH', details: '', instructions: '', iconUrl: '', isActive: true }); setIsEditing(true); }}
          >
            <Plus className="w-4 h-4" /> إضافة طريقة دفع
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">اسم الطريقة (مثال: محفظة فودافون كاش كذا)</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={currentMethod.name} 
                onChange={(e) => setCurrentMethod({ ...currentMethod, name: e.target.value })} 
                placeholder="الاسم" 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">النوع</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={currentMethod.provider} 
                onChange={(e) => setCurrentMethod({ ...currentMethod, provider: e.target.value })}
              >
                <option value="VODAFONE_CASH">Vodafone Cash</option>
                <option value="INSTAPAY">InstaPay</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">التفاصيل (رقم المحفظة / رابط انستا باي)</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={currentMethod.details} 
                onChange={(e) => setCurrentMethod({ ...currentMethod, details: e.target.value })} 
                placeholder="التفاصيل" 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">تعليمات إضافية للعميل</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={currentMethod.instructions || ''} 
                onChange={(e) => setCurrentMethod({ ...currentMethod, instructions: e.target.value })} 
                placeholder="مثال: يرجى تحويل المبلغ بالكامل ورفع صورة الإيصال" 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-1 block">شعار الدفع (اختياري)</label>
            <div className="flex items-center gap-4">
              {currentMethod.iconUrl && <img src={currentMethod.iconUrl} alt="Icon" className="w-12 h-12 rounded object-contain border bg-white" />}
              <label className="cursor-pointer border border-dashed border-indigo-300 bg-indigo-50 text-indigo-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <Upload className="w-4 h-4" />
                رفع صورة
              </label>
              {currentMethod.iconUrl && (
                <button 
                  className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                  onClick={() => setCurrentMethod({ ...currentMethod, iconUrl: '' })}
                >
                  <X className="w-4 h-4" /> إزالة الصورة
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="isActive" 
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              checked={currentMethod.isActive} 
              onChange={(e) => setCurrentMethod({ ...currentMethod, isActive: e.target.checked })} 
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">مفعلة (متاحة للعملاء)</label>
          </div>

          <div className="flex gap-2 mt-6">
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              onClick={handleSave}
            >
              حفظ
            </button>
            <button 
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-6 rounded-lg transition-colors"
              onClick={() => setIsEditing(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">الشعار</th>
                <th className="py-3 px-4">الاسم</th>
                <th className="py-3 px-4">النوع</th>
                <th className="py-3 px-4">التفاصيل</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {methods.map((method) => (
                <tr key={method.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    {method.iconUrl ? <img src={method.iconUrl} alt="Logo" className="w-8 h-8 rounded object-contain bg-white border border-slate-200 p-0.5" /> : '-'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{method.name}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold font-mono border border-slate-200">{method.provider}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{method.details}</td>
                  <td className="py-3 px-4">
                    {method.isActive ? (
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold border border-emerald-200">مفعل</span>
                    ) : (
                      <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-xs font-bold border border-rose-200">معطل</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setCurrentMethod(method); setIsEditing(true); }} className="text-indigo-600 hover:bg-indigo-100 p-1.5 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(method.id)} className="text-rose-500 hover:bg-rose-100 p-1.5 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {methods.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-slate-500 py-8 font-medium">لا توجد طرق دفع مضافة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
