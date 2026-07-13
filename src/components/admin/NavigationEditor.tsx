import React, { useState } from "react";
import { useAdminStore, SiteConfig } from "../../store/adminStore";
import { Save, Plus, Trash2, Link as LinkIcon, AlignVerticalJustifyStart, LayoutTemplate, MessageCircle, Share2 } from "lucide-react";

export default function NavigationEditor() {
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

  const InputField = ({ value, onChange, placeholder, dir = "rtl", type = "text" }: any) => (
    <input
      type={type}
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      dir={dir}
      placeholder={placeholder}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
    />
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">القوائم والتنقل (Navigation)</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">إدارة قوائم الهيدر والفوتر والروابط الداخلية</p>
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
        {/* Header Links */}
        <div className="lg:col-span-2">
          <Card 
            title="روابط الهيدر (القائمة العلوية)" 
            icon={AlignVerticalJustifyStart}
            action={
              <button
                onClick={() => setLocalConfig({ 
                  ...localConfig, 
                  headerLinks: [...localConfig.headerLinks, { id: `hl-${Date.now()}`, label: "رابط جديد", url: "/" }] 
                })}
                className="bg-white border border-slate-200 text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> إضافة رابط
              </button>
            }
          >
            <div className="space-y-3">
              {localConfig.headerLinks.map((link, idx) => (
                <div key={link.id} className="flex items-center gap-3 bg-slate-50/30 border border-slate-200 p-3 rounded-2xl">
                  <div className="cursor-move text-slate-500 hover:text-slate-900 p-2">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <InputField 
                      placeholder="اسم الرابط (مثال: الأسعار)"
                      value={link.label}
                      onChange={(v: string) => {
                        const newLinks = [...localConfig.headerLinks];
                        newLinks[idx].label = v;
                        setLocalConfig({ ...localConfig, headerLinks: newLinks });
                      }}
                    />
                    <InputField 
                      placeholder="المسار (مثال: /pricing أو #pricing)"
                      value={link.url}
                      dir="ltr"
                      onChange={(v: string) => {
                        const newLinks = [...localConfig.headerLinks];
                        newLinks[idx].url = v;
                        setLocalConfig({ ...localConfig, headerLinks: newLinks });
                      }}
                    />
                  </div>
                  <label className="flex items-center gap-2 px-3">
                    <input 
                      type="checkbox" 
                      checked={link.isNew || false}
                      onChange={(e) => {
                        const newLinks = [...localConfig.headerLinks];
                        newLinks[idx].isNew = e.target.checked;
                        setLocalConfig({ ...localConfig, headerLinks: newLinks });
                      }}
                      className="w-4 h-4 rounded text-indigo-600 accent-brand-primary"
                    />
                    <span className="text-xs font-bold text-slate-500">علامة (جديد)</span>
                  </label>
                  <button 
                    onClick={() => {
                      setLocalConfig({
                        ...localConfig,
                        headerLinks: localConfig.headerLinks.filter((_, i) => i !== idx)
                      });
                    }}
                    className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Footer Sections */}
        <div className="lg:col-span-2">
          <Card 
            title="أقسام الفوتر (الروابط السفلية)" 
            icon={LayoutTemplate}
            action={
              <button
                onClick={() => setLocalConfig({ 
                  ...localConfig, 
                  footerSections: [...localConfig.footerSections, { title: "قسم جديد", links: [] }] 
                })}
                className="bg-white border border-slate-200 text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> إضافة قسم
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {localConfig.footerSections.map((section, sIdx) => (
                <div key={sIdx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
                    <input
                      value={section.title}
                      onChange={(e) => {
                        const newSecs = [...localConfig.footerSections];
                        newSecs[sIdx].title = e.target.value;
                        setLocalConfig({ ...localConfig, footerSections: newSecs });
                      }}
                      className="font-bold text-slate-900 bg-transparent outline-none w-full"
                      placeholder="اسم القسم"
                    />
                    <button 
                      onClick={() => setLocalConfig({
                        ...localConfig,
                        footerSections: localConfig.footerSections.filter((_, i) => i !== sIdx)
                      })}
                      className="text-rose-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {section.links.map((link, lIdx) => (
                      <div key={link.id || lIdx} className="flex flex-col gap-2 relative group p-2 hover:bg-slate-50/30 rounded-xl transition-colors">
                        <input
                          value={link.label}
                          placeholder="اسم الرابط"
                          onChange={(e) => {
                            const newSecs = [...localConfig.footerSections];
                            newSecs[sIdx].links[lIdx].label = e.target.value;
                            setLocalConfig({ ...localConfig, footerSections: newSecs });
                          }}
                          className="text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-200 outline-none transition-all px-1"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            value={link.url}
                            dir="ltr"
                            placeholder="الرابط (/url)"
                            onChange={(e) => {
                              const newSecs = [...localConfig.footerSections];
                              newSecs[sIdx].links[lIdx].url = e.target.value;
                              setLocalConfig({ ...localConfig, footerSections: newSecs });
                            }}
                            className="text-xs text-slate-500 bg-transparent border-b border-transparent hover:border-slate-200 outline-none transition-all px-1 flex-1"
                          />
                          <button 
                            onClick={() => {
                              const newSecs = [...localConfig.footerSections];
                              newSecs[sIdx].links = newSecs[sIdx].links.filter((_, i) => i !== lIdx);
                              setLocalConfig({ ...localConfig, footerSections: newSecs });
                            }}
                            className="text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => {
                        const newSecs = [...localConfig.footerSections];
                        newSecs[sIdx].links.push({ id: `fl-${Date.now()}`, label: "رابط جديد", url: "/" });
                        setLocalConfig({ ...localConfig, footerSections: newSecs });
                      }}
                      className="w-full py-2 border border-dashed border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-brand-primary rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 mt-2"
                    >
                      <Plus className="w-3 h-3" /> إضافة رابط للقسم
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Social Links & WhatsApp */}
        <div className="lg:col-span-2">
          <Card title="روابط التواصل الاجتماعي وواتساب" icon={Share2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="bg-slate-50/30 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">رقم الواتساب للتواصل</h4>
                </div>
                <input
                  value={localConfig.whatsappNumber}
                  onChange={(e) => setLocalConfig({ ...localConfig, whatsappNumber: e.target.value })}
                  dir="ltr"
                  placeholder="مثال: 201001234567"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-[#25D366] outline-none transition-all"
                />
                <p className="text-xs font-bold text-slate-500">
                  هذا الرقم سيتم استخدامه في الزر العائم للتواصل عبر الواتساب.
                </p>
              </div>

              {/* Social Links */}
              <div className="bg-slate-50/30 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900">حسابات السوشيال ميديا</h4>
                  <button
                    onClick={() => setLocalConfig({
                      ...localConfig,
                      socialLinks: [...localConfig.socialLinks, { platform: "facebook", url: "" }]
                    })}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-600-light flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> إضافة
                  </button>
                </div>
                
                {localConfig.socialLinks?.map((social, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={social.platform}
                      onChange={(e) => {
                        const newSocials = [...localConfig.socialLinks];
                        newSocials[idx].platform = e.target.value;
                        setLocalConfig({ ...localConfig, socialLinks: newSocials });
                      }}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none w-28"
                    >
                      <option value="facebook">فيسبوك</option>
                      <option value="twitter">تويتر</option>
                      <option value="instagram">انستجرام</option>
                      <option value="linkedin">لينكد إن</option>
                      <option value="youtube">يوتيوب</option>
                    </select>
                    <input
                      value={social.url}
                      onChange={(e) => {
                        const newSocials = [...localConfig.socialLinks];
                        newSocials[idx].url = e.target.value;
                        setLocalConfig({ ...localConfig, socialLinks: newSocials });
                      }}
                      dir="ltr"
                      placeholder="https://..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-brand-primary"
                    />
                    <button
                      onClick={() => setLocalConfig({
                        ...localConfig,
                        socialLinks: localConfig.socialLinks.filter((_, i) => i !== idx)
                      })}
                      className="p-2 text-rose-300 hover:text-rose-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
