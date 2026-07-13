import React, { useState } from "react";
import { useAdminStore, SiteConfig } from "../../store/adminStore";
import { Save, Plus, Trash2, Video, Play, ExternalLink } from "lucide-react";

export default function AcademyEditor() {
  const { config, updateConfig } = useAdminStore();
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateConfig(() => localConfig);
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
          <h1 className="text-2xl font-[900] text-brand-navy">أكاديمية منظومة</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">إدارة دروس الفيديو والمحتوى التعليمي</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-7 py-3 rounded-2xl font-[900] text-sm transition-all flex items-center gap-2 ${
            saved ? "bg-emerald-500 text-white" : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
          }`}
        >
          {saved ? "✓ تم الحفظ" : (<><Save className="w-4 h-4" /> حفظ التغييرات</>)}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {localConfig.academyVideos.map((video, idx) => (
          <div key={video.id} className="bg-white rounded-3xl border border-brand-border/40 overflow-hidden shadow-premium">
            <div className="px-7 py-5 border-b border-brand-border/20 flex items-center justify-between bg-brand-bg/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="font-[900] text-brand-navy text-sm truncate max-w-[200px]">{video.title}</h3>
              </div>
              <button
                onClick={() => setLocalConfig({ ...localConfig, academyVideos: localConfig.academyVideos.filter((_, i) => i !== idx) })}
                className="p-1.5 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-7 space-y-5">
              <InputField label="عنوان الفيديو" value={video.title} onChange={(v: string) => { const nv = [...localConfig.academyVideos]; nv[idx] = { ...nv[idx], title: v }; setLocalConfig({ ...localConfig, academyVideos: nv }); }} />
              <InputField label="رابط التضمين (Embed URL)" value={video.url} onChange={(v: string) => { const nv = [...localConfig.academyVideos]; nv[idx] = { ...nv[idx], url: v }; setLocalConfig({ ...localConfig, academyVideos: nv }); }} dir="ltr" />
              
              <div className="space-y-2">
                <label className="text-xs font-[900] text-brand-muted px-1 flex items-center gap-2">
                  <Play className="w-3 h-3" /> معاينة
                </label>
                <div className="aspect-video bg-brand-bg/50 rounded-2xl overflow-hidden border border-brand-border/40 relative group">
                  {video.url ? (
                    <iframe src={video.url} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-brand-muted">
                      <Video className="w-10 h-10 opacity-20" />
                      <span className="text-[10px] font-[900] uppercase tracking-widest">No Video URL</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setLocalConfig({ ...localConfig, academyVideos: [...localConfig.academyVideos, { id: Date.now().toString(), title: "فيديو تعليمي جديد", url: "" }] })}
          className="border-2 border-dashed border-brand-border/40 rounded-3xl p-10 text-brand-muted font-[900] flex flex-col items-center justify-center gap-3 hover:border-brand-primary hover:text-brand-primary transition-all group bg-white/50"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
            <Plus className="w-7 h-7" />
          </div>
          إضافة فيديو تعليمي جديد
        </button>
      </div>
    </div>
  );
}
