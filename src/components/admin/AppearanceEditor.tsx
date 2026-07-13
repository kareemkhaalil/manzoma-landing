import React, { useState } from "react";
import { useAdminStore, SiteConfig } from "../../store/adminStore";
import { Save, Sparkles, Megaphone, Tag } from "lucide-react";

export default function AppearanceEditor() {
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

  const Card = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-7 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        </div>
      </div>
      <div className="p-7 space-y-5">{children}</div>
    </div>
  );

  const InputField = ({ label, value, onChange, dir = "rtl", type = "text" }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 px-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        dir={dir}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
      />
    </div>
  );

  const Switch = ({ label, checked, onChange }: any) => (
    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border border-slate-200 hover:bg-slate-50/50 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded-lg accent-brand-primary"
      />
      <span className="text-sm font-bold text-slate-900">{label}</span>
    </label>
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المظهر والعناصر الترويجية</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">التحكم في الأشرطة المتحركة والعروض والشارات الجانبية</p>
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
        {/* Marquee Tape Configuration */}
        <Card title="شريط الكلمات المتحرك (Marquee)" icon={Sparkles}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              label="السرعة بالثواني (أقل يعني أسرع)"
              value={localConfig.marqueeConfig.speed}
              onChange={(v: string) => setLocalConfig({ ...localConfig, marqueeConfig: { ...localConfig.marqueeConfig, speed: Number(v) } })}
              dir="ltr"
            />
            <InputField
              label="السماكة (كلاس Tailwind)"
              value={localConfig.marqueeConfig.thickness}
              onChange={(v: string) => setLocalConfig({ ...localConfig, marqueeConfig: { ...localConfig.marqueeConfig, thickness: v } })}
              dir="ltr"
            />
            <InputField
              type="color"
              label="لون الشريط الأول"
              value={localConfig.marqueeConfig.row1Color}
              onChange={(v: string) => setLocalConfig({ ...localConfig, marqueeConfig: { ...localConfig.marqueeConfig, row1Color: v } })}
              dir="ltr"
            />
            <InputField
              type="color"
              label="لون الشريط الثاني"
              value={localConfig.marqueeConfig.row2Color}
              onChange={(v: string) => setLocalConfig({ ...localConfig, marqueeConfig: { ...localConfig.marqueeConfig, row2Color: v } })}
              dir="ltr"
            />
          </div>
          <Switch
            label="الظهور في الأمام دائماً (Z-Index Forward)"
            checked={localConfig.marqueeConfig.zIndexForward}
            onChange={(checked: boolean) => setLocalConfig({ ...localConfig, marqueeConfig: { ...localConfig.marqueeConfig, zIndexForward: checked } })}
          />
        </Card>

        {/* Promo Bar Configuration */}
        <Card title="شريط العروض (Promo Bar)" icon={Megaphone}>
          <Switch
            label="تفعيل شريط العروض أسفل الهيدر"
            checked={localConfig.promoBar.enabled}
            onChange={(checked: boolean) => setLocalConfig({ ...localConfig, promoBar: { ...localConfig.promoBar, enabled: checked } })}
          />
          <InputField
            label="نص العرض"
            value={localConfig.promoBar.text}
            onChange={(v: string) => setLocalConfig({ ...localConfig, promoBar: { ...localConfig.promoBar, text: v } })}
          />
          <InputField
            label="رابط العرض (اختياري)"
            value={localConfig.promoBar.linkUrl || ""}
            onChange={(v: string) => setLocalConfig({ ...localConfig, promoBar: { ...localConfig.promoBar, linkUrl: v } })}
            dir="ltr"
          />
          <InputField
            type="color"
            label="لون الشريط"
            value={localConfig.promoBar.backgroundColor}
            onChange={(v: string) => setLocalConfig({ ...localConfig, promoBar: { ...localConfig.promoBar, backgroundColor: v } })}
            dir="ltr"
          />
        </Card>

        {/* Side Badge Configuration */}
        <Card title="الشارة الجانبية (Side Badge)" icon={Tag}>
          <Switch
            label="تفعيل الشارة العائمة الجانبية"
            checked={localConfig.sideBadge.enabled}
            onChange={(checked: boolean) => setLocalConfig({ ...localConfig, sideBadge: { ...localConfig.sideBadge, enabled: checked } })}
          />
          <InputField
            label="نص الشارة (مثال: SALE)"
            value={localConfig.sideBadge.text}
            onChange={(v: string) => setLocalConfig({ ...localConfig, sideBadge: { ...localConfig.sideBadge, text: v } })}
          />
          <InputField
            type="color"
            label="لون الشارة"
            value={localConfig.sideBadge.backgroundColor}
            onChange={(v: string) => setLocalConfig({ ...localConfig, sideBadge: { ...localConfig.sideBadge, backgroundColor: v } })}
            dir="ltr"
          />
        </Card>
      </div>
    </div>
  );
}
