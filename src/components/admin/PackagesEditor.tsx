import React, { useState, useEffect } from "react";
import { useAdminStore, Package } from "../../store/adminStore";
import { 
  Save, Plus, Trash2, Package as PackageIcon, CheckCircle2, Star, 
  Store, Boxes, Users, MonitorSmartphone, Sliders
} from "lucide-react";

export default function PackagesEditor() {
  const { packages, updatePackages } = useAdminStore();
  const [localPackages, setLocalPackages] = useState<Package[]>(packages);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (packages && packages.length > 0) {
      setLocalPackages(packages);
    }
  }, [packages]);

  const handleSave = () => {
    updatePackages(localPackages);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const InputField = ({ label, value, onChange, type = "text", dir = "rtl" }: any) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 px-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        dir={dir}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الباقات والأسعار والحصص</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">تحديد أسعار الباقات وحصص الفروع والمخازن ونقاط البيع المخصصة لكل باقة</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-7 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
            saved ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
          }`}
        >
          {saved ? "✓ تم الحفظ" : (<><Save className="w-4 h-4" /> حفظ الباقات</>)}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {localPackages.map((pkg, idx) => (
          <div key={pkg.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="px-7 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <PackageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{pkg.name}</h3>
                  <span className="text-[11px] font-bold text-slate-400">كود الباقة: {pkg.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const np = [...localPackages]; np[idx] = { ...np[idx], isPopular: !np[idx].isPopular }; setLocalPackages(np); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    pkg.isPopular ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm" : "bg-white border-slate-200 text-slate-500"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${pkg.isPopular ? "fill-current" : ""}`} />
                  {pkg.isPopular ? "الباقة الأكثر طلباً" : "تمييز كأفضل باقة"}
                </button>
                <button
                  onClick={() => setLocalPackages(localPackages.filter((_, i) => i !== idx))}
                  className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="حذف الباقة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-7 space-y-6">
              {/* Pricing & Info */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="اسم الباقة" value={pkg.name} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], name: v }; setLocalPackages(np); }} />
                <InputField label="السعر الشهري" value={pkg.price} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], price: v }; setLocalPackages(np); }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="السعر السنوي" value={pkg.yearlyPrice || ""} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], yearlyPrice: v }; setLocalPackages(np); }} />
                <InputField label="لاحقة السعر" value={pkg.priceSuffix} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], priceSuffix: v }; setLocalPackages(np); }} />
              </div>
              <InputField label="وصف الباقة" value={pkg.description} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], description: v }; setLocalPackages(np); }} />

              {/* 🎯 QUOTAS & RESOURCE LIMITS */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    تحديد الحصص الرقمية (Quotas) للباقة
                  </p>
                  <span className="text-[11px] font-bold text-slate-400">999 = غير محدود</span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/70">
                  {/* Max Branches */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-indigo-600" />
                      عدد الفروع (maxBranches)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={pkg.maxBranches ?? 1}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                        const np = [...localPackages];
                        np[idx] = { ...np[idx], maxBranches: val };
                        setLocalPackages(np);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                    />
                    <p className="text-[10px] font-bold text-slate-400 text-center">
                      {(pkg.maxBranches ?? 1) > 1 ? "🏢 سلسلة فروع" : "🟢 متجر فردي (1)"}
                    </p>
                  </div>

                  {/* Max Warehouses */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-amber-600" />
                      عدد المخازن (maxWarehouses)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={pkg.maxWarehouses ?? 1}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                        const np = [...localPackages];
                        np[idx] = { ...np[idx], maxWarehouses: val };
                        setLocalPackages(np);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                    />
                    <p className="text-[10px] font-bold text-slate-400 text-center">
                      مستودعات التخزين
                    </p>
                  </div>

                  {/* Max POS Terminals */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MonitorSmartphone className="w-3.5 h-3.5 text-emerald-600" />
                      نقاط البيع / كاشير (maxPos)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={pkg.maxPosTerminals ?? 1}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                        const np = [...localPackages];
                        np[idx] = { ...np[idx], maxPosTerminals: val };
                        setLocalPackages(np);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                    />
                    <p className="text-[10px] font-bold text-slate-400 text-center">
                      أجهزة الكاشير المرخصة
                    </p>
                  </div>

                  {/* Max Users */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      عدد المستخدمين (maxUsers)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={pkg.maxUsers ?? 5}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                        const np = [...localPackages];
                        np[idx] = { ...np[idx], maxUsers: val };
                        setLocalPackages(np);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                    />
                    <p className="text-[10px] font-bold text-slate-400 text-center">
                      حسابات الموظفين
                    </p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-black text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  المميزات التسويقية المشمولة
                </p>
                <div className="space-y-2">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex gap-2 group">
                      <input
                        value={feat}
                        onChange={(e) => { const np = [...localPackages]; np[idx] = { ...np[idx], features: [...np[idx].features] }; np[idx].features[fIdx] = e.target.value; setLocalPackages(np); }}
                        className="flex-1 bg-slate-50/30 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                      />
                      <button
                        onClick={() => { const np = [...localPackages]; np[idx] = { ...np[idx], features: pkg.features.filter((_, i) => i !== fIdx) }; setLocalPackages(np); }}
                        className="p-1.5 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => { const np = [...localPackages]; np[idx] = { ...np[idx], features: [...np[idx].features, "ميزة جديدة..."] }; setLocalPackages(np); }}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-xs font-bold hover:border-brand-primary hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة ميزة
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Package Button */}
        <button
          onClick={() => setLocalPackages([...localPackages, { 
            id: Date.now().toString(), 
            name: "باقة جديدة", 
            price: "499", 
            yearlyPrice: "399", 
            description: "وصف الباقة ومزاياها التجارية...", 
            features: ["نقطة بيع سحابية", "فواتير إلكترونية"], 
            priceSuffix: "جنيه / شهرياً",
            maxBranches: 1,
            maxWarehouses: 1,
            maxPosTerminals: 1,
            maxUsers: 5,
            hasWhatsApp: true,
            hasOfflineSync: true,
            visible: true
          }])}
          className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-slate-500 font-bold flex flex-col items-center justify-center gap-3 hover:border-brand-primary hover:text-indigo-600 transition-all group bg-white/50"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Plus className="w-7 h-7" />
          </div>
          إضافة باقة جديدة
        </button>
      </div>
    </div>
  );
}
