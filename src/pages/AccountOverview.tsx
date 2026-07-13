import React, { useState, useEffect } from 'react';
import { fetchClientOverview } from '../lib/apiService';
import { Building2, ShoppingCart, Users, Package } from 'lucide-react';

export default function AccountOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchClientOverview();
        setData(res.company);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-slate-500">جاري التحميل...</div>;
  if (!data) return <div className="text-rose-500">خطأ في تحميل البيانات</div>;

  const getStatusBadge = () => {
    if (data.status === 'ACTIVE') return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">نشط</span>;
    if (data.status === 'SUSPENDED') return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm font-bold border border-rose-200">موقوف</span>;
    return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold border border-slate-200">{data.status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مرحباً بك في بوابة {data.name}</h1>
          <p className="text-slate-500 mt-1">يمكنك متابعة حالة اشتراكك وإدارة فروعك من هنا.</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-sm">
            <Building2 className="w-5 h-5 text-indigo-500" />
            الفروع
          </div>
          <div className="text-3xl font-bold text-slate-900">{data._count?.branches || 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm border-t-4 border-t-fuchsia-500">
          <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-sm">
            <Users className="w-5 h-5 text-fuchsia-500" />
            المستخدمين
          </div>
          <div className="text-3xl font-bold text-slate-900">{data._count?.users || 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-sm">
            <Package className="w-5 h-5 text-amber-500" />
            المنتجات
          </div>
          <div className="text-3xl font-bold text-slate-900">{data._count?.products || 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-sm">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
            الطلبات
          </div>
          <div className="text-3xl font-bold text-slate-900">{data._count?.orders || 0}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">تفاصيل الاشتراك الحالي</h2>
        <div className="space-y-0">
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500 font-medium">الخطة:</span>
            <span className="font-bold text-slate-900">{data.planName}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500 font-medium">ينتهي في:</span>
            <span className="font-bold text-slate-900">{data.subscriptionEndsAt ? new Date(data.subscriptionEndsAt).toLocaleDateString('ar-EG') : 'غير محدد'}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-slate-500 font-medium">الحد الأقصى للفروع:</span>
            <span className="font-bold text-slate-900">{data.maxBranches}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
