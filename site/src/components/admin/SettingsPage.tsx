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
    <div className="bg-white rounded-3xl border border-brand-border/40 overflow-hidden shadow-premium">
      <div className="px-7 py-5 border-b border-brand-border/20 flex items-center gap-3 bg-brand-bg/30">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-[900] text-brand-navy text-sm">{title}</h3>
      </div>
      <div className="p-7 space-y-5">{children}</div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", dir = "rtl" }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-[900] text-brand-muted px-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full bg-brand-bg/50 border border-brand-border/40 rounded-2xl px-5 py-3.5 text-sm font-bold text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-[900] text-brand-navy">الإعدادات العامة</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">تكوين إعدادات المنصة الأساسية</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-7 py-3 rounded-2xl font-[900] text-sm transition-all flex items-center gap-2 ${
            saved
              ? "bg-emerald-500 text-white shadow-lg"
              : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
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
                <span className="text-sm font-bold text-brand-navy">{item.label}</span>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${item.checked ? "bg-brand-primary" : "bg-slate-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.checked ? "left-1" : "right-1"}`} />
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Trial Settings */}
        <Card title="إعدادات الفترة التجريبية" icon={Key}>
          <InputField label="عدد أيام الفترة التجريبية" value={trialDays} onChange={setTrialDays} type="number" dir="ltr" />
          <p className="text-xs font-medium text-brand-muted">
            سيتم تطبيق هذا الإعداد على جميع المشتركين الجدد تلقائياً.
          </p>
        </Card>

        {/* Danger Zone */}
        <Card title="منطقة الخطر" icon={AlertTriangle}>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-rose-800 mb-4">
              العمليات في هذا القسم لا يمكن التراجع عنها. يرجى التأكد قبل المتابعة.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-[900] hover:bg-rose-100 transition-all">
                حذف جميع البيانات التجريبية
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-[900] hover:bg-rose-100 transition-all">
                إعادة تعيين الإعدادات
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
