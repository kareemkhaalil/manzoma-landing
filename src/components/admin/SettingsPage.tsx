import React, { useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Save, Building2, Bell, Key, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { config, updateConfig } = useAdminStore();
  const [companyName, setCompanyName] = useState(config.siteName);
  const [trialDays, setTrialDays] = useState(config.trialDays.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateConfig((prev) => ({
      ...prev,
      siteName: companyName,
      trialDays: parseInt(trialDays) || 14,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Card = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", dir = "rtl" }: any) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 px-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
      />
    </div>
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">الإعدادات العامة</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">تكوين إعدادات المنصة الأساسية</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
          }`}
        >
          {saved ? "✓ تم الحفظ" : (
            <>
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <Card title="معلومات الشركة" icon={Building2}>
          <InputField label="اسم الشركة / المنصة" value={companyName} onChange={setCompanyName} />
          <InputField label="البريد الإلكتروني" value="admin@manzoma.online" onChange={() => {}} dir="ltr" />
          <InputField label="رقم الهاتف" value="+20 100 123 4567" onChange={() => {}} dir="ltr" />
        </Card>

        {/* Notifications */}
        <Card title="الإشعارات" icon={Bell}>
          <div className="space-y-4">
            {[
              { label: "إشعار عند تسجيل مشترك جديد", checked: true },
              { label: "إشعار عند انتهاء فترة تجريبية", checked: true },
              { label: "تقرير أسبوعي بالأداء عبر البريد", checked: false },
              { label: "إشعار عند فشل عملية دفع", checked: true },
            ].map((item, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer group py-1">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${item.checked ? "bg-indigo-500" : "bg-slate-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.checked ? "left-1" : "right-1"}`} />
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Trial Settings */}
        <Card title="إعدادات الفترة التجريبية" icon={Key}>
          <InputField label="عدد أيام الفترة التجريبية" value={trialDays} onChange={setTrialDays} type="number" dir="ltr" />
          <p className="text-xs font-medium text-slate-500">
            سيتم تطبيق هذا الإعداد على جميع المشتركين الجدد تلقائياً.
          </p>
        </Card>

        {/* Danger Zone */}
        <Card title="منطقة الخطر" icon={AlertTriangle}>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
            <p className="text-sm font-bold text-rose-800 mb-4">
              العمليات في هذا القسم لا يمكن التراجع عنها. يرجى التأكد قبل المتابعة.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all shadow-sm">
                حذف جميع البيانات التجريبية
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all shadow-sm">
                إعادة تعيين الإعدادات
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
