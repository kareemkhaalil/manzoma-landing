import React, { useState } from "react";
import { useAdminStore, SiteConfig } from "../../store/adminStore";
import { Save, Plus, Trash2, Layout, Image, Palette } from "lucide-react";

export default function LandingEditor() {
  const { config, updateConfig } = useAdminStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>(JSON.parse(JSON.stringify(config)));
  const [saved, setSaved] = useState(false);

  // Sync with store hydration or external changes
  React.useEffect(() => {
    setLocalConfig(JSON.parse(JSON.stringify(config)));
  }, [config]);

  const handleSave = () => {
    updateConfig(() => localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Card = ({ title, icon: Icon, children, action }: any) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-7 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-7 space-y-5">{children}</div>
    </div>
  );

  const InputField = ({ label, value, onChange, dir = "rtl" }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 px-1">{label}</label>
      <input
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        dir={dir}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">محرر الصفحة الرئيسية</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">تخصيص محتوى وهيكل الواجهة الأمامية</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-7 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
            saved ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
          }`}
        >
          {saved ? "✓ تم الحفظ" : (<><Save className="w-4 h-4" /> حفظ التغييرات</>)}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card title="قسم الهيرو (Hero)" icon={Layout}>
          <InputField label="العنوان (السطر الأول)" value={localConfig.hero.titleLine1} onChange={(v: string) => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, titleLine1: v } })} />
          <InputField label="العنوان (السطر الثاني)" value={localConfig.hero.titleLine2} onChange={(v: string) => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, titleLine2: v } })} />
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 px-1">الوصف الفرعي</label>
            <textarea
              rows={3}
              value={localConfig.hero.subtitle}
              onChange={(e) => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, subtitle: e.target.value } })}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all resize-none"
            />
          </div>
          <InputField label="نص زر CTA" value={localConfig.hero.ctaText} onChange={(v: string) => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, ctaText: v } })} />
          <InputField label="نص الشارة (Badge)" value={localConfig.hero.badgeText} onChange={(v: string) => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, badgeText: v } })} />
          <InputField label="رابط صورة الموك أب" value={localConfig.hero.mockupImage} onChange={(v: string) => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, mockupImage: v } })} dir="ltr" />
        </Card>

        {/* Branding */}
        <Card title="الهوية والنمط البصري" icon={Palette}>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="اسم الموقع" value={localConfig.siteName} onChange={(v: string) => setLocalConfig({ ...localConfig, siteName: v })} />
            <InputField label="لون الهوية (Primary)" value={localConfig.primaryColor} onChange={(v: string) => setLocalConfig({ ...localConfig, primaryColor: v })} dir="ltr" />
          </div>
          <InputField label="رابط الشعار (Logo URL)" value={localConfig.logoUrl} onChange={(v: string) => setLocalConfig({ ...localConfig, logoUrl: v })} dir="ltr" />
          <InputField label="تدرج الهيرو (Hero Gradient)" value={localConfig.designTokens.heroGradient} onChange={(v: string) => setLocalConfig({ ...localConfig, designTokens: { ...localConfig.designTokens, heroGradient: v } })} dir="ltr" />
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={localConfig.designTokens.showMeshBackground} onChange={(e) => setLocalConfig({ ...localConfig, designTokens: { ...localConfig.designTokens, showMeshBackground: e.target.checked } })} className="w-5 h-5 rounded-lg accent-brand-primary" />
              <span className="text-sm font-bold text-slate-900">خلفية Mesh</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={localConfig.designTokens.primaryGlow} onChange={(e) => setLocalConfig({ ...localConfig, designTokens: { ...localConfig.designTokens, primaryGlow: e.target.checked } })} className="w-5 h-5 rounded-lg accent-brand-primary" />
              <span className="text-sm font-bold text-slate-900">توهج (Glow)</span>
            </label>
          </div>
        </Card>

        {/* Features */}
        <div className="lg:col-span-2">
          <Card
            title="إدارة المميزات"
            icon={Plus}
            action={
              <button
                onClick={() => setLocalConfig({ ...localConfig, features: [...localConfig.features, { id: Date.now().toString(), iconName: "Layers", title: "ميزة جديدة", description: "وصف الميزة..." }] })}
                className="bg-white border border-slate-200 text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all"
              >
                + إضافة ميزة
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {localConfig.features.map((feat, idx) => (
                <div key={feat.id} className="bg-slate-50/30 border border-slate-200 rounded-2xl p-5 relative group">
                  <button
                    onClick={() => setLocalConfig({ ...localConfig, features: localConfig.features.filter((_, i) => i !== idx) })}
                    className="absolute top-3 left-3 p-1.5 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-3">
                    <InputField label="أيقونة (Lucide)" value={feat.iconName} onChange={(v: string) => { const nf = [...localConfig.features]; nf[idx] = { ...nf[idx], iconName: v }; setLocalConfig({ ...localConfig, features: nf }); }} dir="ltr" />
                    <InputField label="العنوان" value={feat.title} onChange={(v: string) => { const nf = [...localConfig.features]; nf[idx] = { ...nf[idx], title: v }; setLocalConfig({ ...localConfig, features: nf }); }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Partners */}
        <div className="lg:col-span-2">
          <Card title="شركاء النجاح" icon={Image}>
            <div className="flex flex-wrap gap-2">
              {localConfig.partners.map((partner, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                  <span className="text-sm font-bold text-slate-900">{partner}</span>
                  <button onClick={() => setLocalConfig({ ...localConfig, partners: localConfig.partners.filter((_, i) => i !== idx) })} className="text-slate-500 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <input
                placeholder="إضافة شريك + Enter"
                onKeyDown={(e: any) => { if (e.key === "Enter" && e.target.value) { setLocalConfig({ ...localConfig, partners: [...localConfig.partners, e.target.value] }); e.target.value = ""; } }}
                className="bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-1.5 text-sm font-bold text-slate-900 outline-none focus:bg-white w-40 transition-all"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
