import React, { useState } from "react";
import { useAdminStore, Package } from "../../store/adminStore";
import { Save, Plus, Trash2, Package as PackageIcon, CheckCircle2, Star } from "lucide-react";

export default function PackagesEditor() {
  const { packages, updatePackages } = useAdminStore();
  const [localPackages, setLocalPackages] = useState<Package[]>(packages);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updatePackages(localPackages);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const InputField = ({ label, value, onChange, dir = "rtl" }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-[900] text-brand-muted px-1">{label}</label>
      <input
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        dir={dir}
        className="w-full bg-brand-bg/50 border border-brand-border/40 rounded-2xl px-5 py-3.5 text-sm font-bold text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-brand-bg/80 backdrop-blur-md py-4 border-b border-brand-border/20 -mx-4 px-4 mb-6">
        <div>
          <h1 className="text-2xl font-[900] text-brand-navy">إدارة الباقات والأسعار</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">إضافة وتعديل باقات الاشتراك والمميزات</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-7 py-3 rounded-2xl font-[900] text-sm transition-all flex items-center gap-2 ${
            saved ? "bg-emerald-500 text-white" : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
          }`}
        >
          {saved ? "✓ تم الحفظ" : (<><Save className="w-4 h-4" /> حفظ الباقات</>)}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {localPackages.map((pkg, idx) => (
          <div key={pkg.id} className="bg-white rounded-3xl border border-brand-border/40 overflow-hidden shadow-premium">
            <div className="px-7 py-5 border-b border-brand-border/20 flex items-center justify-between bg-brand-bg/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm">
                  <PackageIcon className="w-4 h-4" />
                </div>
                <h3 className="font-[900] text-brand-navy text-sm">{pkg.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const np = [...localPackages]; np[idx] = { ...np[idx], isPopular: !np[idx].isPopular }; setLocalPackages(np); }}
                  className={`px-3 py-1 rounded-full text-[10px] font-[900] border transition-all flex items-center gap-1.5 ${
                    pkg.isPopular ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-white border-brand-border/40 text-brand-muted"
                  }`}
                >
                  <Star className={`w-3 h-3 ${pkg.isPopular ? "fill-current" : ""}`} />
                  {pkg.isPopular ? "مميزة" : "تمييز"}
                </button>
                <button
                  onClick={() => setLocalPackages(localPackages.filter((_, i) => i !== idx))}
                  className="p-1.5 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-7 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="اسم الباقة" value={pkg.name} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], name: v }; setLocalPackages(np); }} />
                <InputField label="السعر الشهري" value={pkg.price} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], price: v }; setLocalPackages(np); }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="السعر السنوي" value={pkg.yearlyPrice || ""} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], yearlyPrice: v }; setLocalPackages(np); }} />
                <InputField label="لاحقة السعر" value={pkg.priceSuffix} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], priceSuffix: v }; setLocalPackages(np); }} />
              </div>
              <InputField label="وصف الباقة" value={pkg.description} onChange={(v: string) => { const np = [...localPackages]; np[idx] = { ...np[idx], description: v }; setLocalPackages(np); }} />

              {/* Features */}
              <div className="pt-4 border-t border-brand-border/20">
                <p className="text-xs font-[900] text-brand-navy mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                  المميزات المشمولة
                </p>
                <div className="space-y-2">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex gap-2 group">
                      <input
                        value={feat}
                        onChange={(e) => { const np = [...localPackages]; np[idx] = { ...np[idx], features: [...np[idx].features] }; np[idx].features[fIdx] = e.target.value; setLocalPackages(np); }}
                        className="flex-1 bg-brand-bg/30 border border-brand-border/20 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                      />
                      <button
                        onClick={() => { const np = [...localPackages]; np[idx] = { ...np[idx], features: pkg.features.filter((_, i) => i !== fIdx) }; setLocalPackages(np); }}
                        className="p-1.5 text-brand-muted hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => { const np = [...localPackages]; np[idx] = { ...np[idx], features: [...np[idx].features, "ميزة جديدة..."] }; setLocalPackages(np); }}
                    className="w-full py-2.5 border-2 border-dashed border-brand-border/40 rounded-xl text-brand-muted text-xs font-[900] hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2"
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
          onClick={() => setLocalPackages([...localPackages, { id: Date.now().toString(), name: "باقة جديدة", price: "0", yearlyPrice: "0", description: "وصف...", features: ["ميزة 1"], priceSuffix: "جنيه / شهرياً" }])}
          className="border-2 border-dashed border-brand-border/40 rounded-3xl p-10 text-brand-muted font-[900] flex flex-col items-center justify-center gap-3 hover:border-brand-primary hover:text-brand-primary transition-all group bg-white/50"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
            <Plus className="w-7 h-7" />
          </div>
          إضافة باقة جديدة
        </button>
      </div>
    </div>
  );
}
