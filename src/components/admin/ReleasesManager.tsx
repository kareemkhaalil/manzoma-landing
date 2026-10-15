import React, { useState, useEffect } from 'react';
import { fetchReleases, publishRelease, toggleRelease } from '../../lib/apiService';
import { Loader2, Rocket, UploadCloud, RefreshCw, CheckCircle, Clock } from 'lucide-react';

export default function ReleasesManager() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    version: '',
    downloadUrl: '',
    sha512: '',
    releaseNotes: '',
    isMandatory: false,
    fileSize: ''
  });

  useEffect(() => {
    loadReleases();
  }, []);

  const loadReleases = async () => {
    try {
      setLoading(true);
      const data = await fetchReleases();
      setReleases(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load releases');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPublishing(true);
      setError(null);
      await publishRelease(formData);
      await loadReleases();
      setFormData({
        version: '',
        downloadUrl: '',
        sha512: '',
        releaseNotes: '',
        isMandatory: false,
        fileSize: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to publish release');
    } finally {
      setPublishing(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleRelease(id);
      await loadReleases();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle release');
    }
  };

  const activeRelease = releases.find(r => r.isActive);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">إدارة التحديثات والإصدارات (OTA)</h2>
          <p className="text-slate-500 mt-2">
            إدارة إصدارات تطبيق الديسكتوب، وإرسال التحديثات التلقائية للأجهزة.
          </p>
        </div>
        <button onClick={loadReleases} disabled={loading} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all font-semibold">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث البيانات
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-semibold flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-indigo-100/50 px-6 py-4 border-b border-indigo-100 flex items-center">
                <Rocket className="w-5 h-5 ml-2 text-indigo-600" />
                <h3 className="font-bold text-lg text-indigo-900">الإصدار النشط حالياً</h3>
            </div>
            <div className="p-6">
              {activeRelease ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-indigo-500 font-medium mb-1">رقم النسخة</div>
                    <div className="text-3xl font-bold font-mono text-indigo-700">v{activeRelease.version}</div>
                  </div>
                  <div>
                    <div className="text-sm text-indigo-500 font-medium mb-1">تاريخ الإصدار</div>
                    <div className="font-medium flex items-center text-indigo-900">
                      <Clock className="w-4 h-4 ml-1 opacity-70" />
                      {new Date(activeRelease.releaseDate).toLocaleString('ar-EG')}
                    </div>
                  </div>
                  {activeRelease.isMandatory && (
                    <div className="bg-rose-100 text-rose-700 p-2 rounded-lg text-sm font-bold flex items-center justify-center">
                      تحديث إجباري
                    </div>
                  )}
                  <div className="pt-2">
                     <a href={activeRelease.downloadUrl} target="_blank" rel="noreferrer" className="block w-full text-center bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold py-2.5 rounded-xl transition-all">
                        تحميل الملف التنفيذي
                     </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-indigo-400 font-medium">
                  لا يوجد إصدار نشط حالياً
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col">
              <div className="flex items-center">
                <UploadCloud className="w-5 h-5 ml-2 text-slate-700" />
                <h3 className="font-bold text-lg text-slate-900">نشر إصدار جديد</h3>
              </div>
              <p className="text-sm text-slate-500 mt-1">سيتم إشعار جميع الأجهزة فور النشر</p>
            </div>
            <div className="p-6">
              <form onSubmit={handlePublish} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم النسخة (مثال: 1.5.3)</label>
                  <input 
                    type="text"
                    value={formData.version} 
                    onChange={e => setFormData({...formData, version: e.target.value})} 
                    required 
                    placeholder="1.0.0" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">رابط التنزيل المباشر (.exe)</label>
                  <input 
                    type="url"
                    value={formData.downloadUrl} 
                    onChange={e => setFormData({...formData, downloadUrl: e.target.value})} 
                    required 
                    placeholder="https://..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 text-left" dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">تشفير SHA-512 (ضروري للأمان)</label>
                  <input 
                    type="text"
                    value={formData.sha512} 
                    onChange={e => setFormData({...formData, sha512: e.target.value})} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 font-mono text-xs text-left" dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">حجم الملف بالبايت (اختياري)</label>
                  <input 
                    type="number"
                    value={formData.fileSize} 
                    onChange={e => setFormData({...formData, fileSize: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 text-left" dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">ملاحظات التحديث</label>
                  <textarea 
                    value={formData.releaseNotes} 
                    onChange={e => setFormData({...formData, releaseNotes: e.target.value})} 
                    placeholder="أهم المميزات والإصلاحات..."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="isMandatory"
                    checked={formData.isMandatory} 
                    onChange={e => setFormData({...formData, isMandatory: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="isMandatory" className="text-sm font-bold text-slate-700 cursor-pointer">
                    تحديث إجباري؟
                  </label>
                </div>
                <button type="submit" disabled={publishing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                  {publishing ? 'جاري النشر...' : 'نشر الإصدار'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">سجل الإصدارات (History)</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-slate-300" /></div>
              ) : (
                <div className="space-y-4">
                  {releases.length === 0 ? (
                    <div className="text-center text-slate-400 py-12 font-medium">لم يتم نشر أي إصدارات سابقة</div>
                  ) : (
                    releases.map((release) => (
                      <div key={release.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${release.isActive ? 'border-indigo-200 bg-indigo-50/50' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`font-bold text-xl font-mono ${release.isActive ? 'text-indigo-700' : 'text-slate-700'}`}>v{release.version}</h3>
                            {release.isActive && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                            {release.isMandatory && <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md">إجباري</span>}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-2 font-medium">
                            <Clock className="w-4 h-4 opacity-70" />
                            {new Date(release.releaseDate).toLocaleString('ar-EG')}
                          </div>
                          {release.releaseNotes && (
                            <p className="text-sm mt-3 text-slate-600 line-clamp-2 bg-white/60 p-3 rounded-lg border border-slate-100/50">
                              {release.releaseNotes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <label className="flex items-center cursor-pointer">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={release.isActive} 
                                onChange={() => handleToggle(release.id)}
                                disabled={publishing}
                              />
                              <div className={`block w-14 h-8 rounded-full transition-colors ${release.isActive ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${release.isActive ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                            <span className="mr-3 text-sm font-bold text-slate-700">{release.isActive ? 'نشط' : 'معطل'}</span>
                          </label>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
