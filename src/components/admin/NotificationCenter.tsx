import React, { useState, useEffect } from "react";
import {
  Bell, Send, Trash2, Eye, RefreshCw, Smartphone, Laptop, Globe,
  Upload, Sparkles, CheckCircle2, AlertCircle, Info, ExternalLink,
  Layers, Layout, Image, Check, ToggleLeft, ToggleRight, X, Calendar, Clock
} from "lucide-react";
import {
  fetchAdminNotifications, createAdminNotification, toggleAdminNotification,
  deleteAdminNotification, fetchCompanies, fetchTargetUsers,
  type NotificationItem, type CompanyFromAPI
} from "../../lib/apiService";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; username: string; companyName?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"MODAL" | "BANNER" | "TOAST" | "POPUP">("MODAL");
  const [targetType, setTargetType] = useState<"ALL" | "COMPANIES" | "USERS">("ALL");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [targetPlatform, setTargetPlatform] = useState<"ALL" | "WEB" | "DESKTOP">("ALL");
  const [priority, setPriority] = useState<"NORMAL" | "URGENT" | "INFO">("NORMAL");
  const [expiresAt, setExpiresAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePlacement, setImagePlacement] = useState<"TOP" | "SIDE" | "IMAGE_ONLY" | "OVERLAY">("TOP");
  const [actionLabel, setActionLabel] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [autoDismissSeconds, setAutoDismissSeconds] = useState(0);

  // Style State
  const [theme, setTheme] = useState<"indigo" | "dark" | "emerald" | "amber" | "rose">("indigo");

  const showToast = (msg: string, toastType: 'success' | 'error' = 'success') => {
    setToast({ msg, type: toastType });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [notifs, comps, usrs] = await Promise.all([
        fetchAdminNotifications().catch(() => []),
        fetchCompanies().catch(() => []),
        fetchTargetUsers().catch(() => [])
      ]);
      setNotifications(Array.isArray(notifs) ? notifs : []);
      setCompanies(Array.isArray(comps) ? comps : []);
      setUsers(Array.isArray(usrs) ? usrs : []);
    } catch (err: any) {
      showToast(err.message || "فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Google Drive link converter
  const handleImageUrlChange = (url: string) => {
    let cleanUrl = url.trim();
    if (cleanUrl.includes('drive.google.com/file/d/')) {
      const match = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        cleanUrl = `https://lh3.googleusercontent.com/d/${match[1]}`;
        showToast("✨ تم تحويل رابط Google Drive لرابط صورة مباشر وسريع بنجاح!");
      }
    } else if (cleanUrl.includes('drive.google.com/open?id=')) {
      const match = cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        cleanUrl = `https://lh3.googleusercontent.com/d/${match[1]}`;
        showToast("✨ تم تحويل رابط Google Drive لرابط صورة مباشر وسريع بنجاح!");
      }
    }
    setImageUrl(cleanUrl);
  };

  // Local image file picker -> base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("حجم الصورة كبير جداً، يفضل أقل من 2 ميجابايت", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        showToast("تم رفع الصورة وتجهيزها بنجاح!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && imagePlacement !== 'IMAGE_ONLY') {
      showToast("يرجى إدخال عنوان الإشعار على الأقل", "error");
      return;
    }

    setSubmitting(true);
    try {
      const styleConfig = {
        theme,
        width: type === 'MODAL' ? '600px' : 'auto',
        borderRadius: '24px',
        targetPlatform,
      };

      await createAdminNotification({
        title: title || 'إعلان مهم',
        message,
        type,
        targetType,
        targetCompanyIds: targetType === 'COMPANIES' ? selectedCompanies : null,
        targetUserIds: targetType === 'USERS' ? selectedUsers : [],
        targetPlatform,
        priority,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        imageUrl: imageUrl || null,
        imagePlacement,
        actionLabel: actionLabel || null,
        actionUrl: actionUrl || null,
        styleConfig
      });

      showToast("🚀 تم إرسال وبث الإشعار بنجاح لجميع الأجهزة المستهدفة!");
      
      // Reset form
      setTitle("");
      setMessage("");
      setImageUrl("");
      setActionLabel("");
      setActionUrl("");
      setExpiresAt("");
      
      await loadData();
    } catch (err: any) {
      showToast(err.message || "فشل إرسال الإشعار", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleAdminNotification(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n));
      showToast("تم تحديث حالة الإشعار");
    } catch (err: any) {
      showToast("فشل تعديل الحالة", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإشعار نهائياً؟")) return;
    try {
      await deleteAdminNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast("تم حذف الإشعار بنجاح");
    } catch (err: any) {
      showToast("فشل حذف الإشعار", "error");
    }
  };

  // Preview helper
  const getThemeGradient = () => {
    switch (theme) {
      case "dark": return "from-slate-900 via-slate-800 to-slate-950 text-white";
      case "emerald": return "from-emerald-900 via-teal-900 to-slate-900 text-white";
      case "amber": return "from-amber-900 via-orange-900 to-slate-900 text-white";
      case "rose": return "from-rose-900 via-pink-900 to-slate-900 text-white";
      default: return "from-indigo-950 via-slate-900 to-indigo-900 text-white";
    }
  };

  return (
    <div className="space-y-8 pb-20 font-['Cairo']" dir="rtl">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 left-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-5 text-white ${
          toast.type === 'success' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-600 shadow-rose-500/20'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">مركز الإشعارات والبث الموحد</h1>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                إرسال الإعلانات، التنبيهات، وبوسترات العروض التفاعلية لتطبيقات الويب وسطح المكتب والموقع العام
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          تحديث القائمة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creation Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSend} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              إنشاء إشعار أو بوستر جديد
            </h2>

            {/* 1. المنصة المستهدفة */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                المنصة المستهدفة (Platform Targeting)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "ALL", label: "الكل (ويب وديسكتوب)", icon: Globe, desc: "لجميع المستخدمين" },
                  { id: "WEB", label: "الويب فقط", icon: Laptop, desc: "المتصفح والموقع" },
                  { id: "DESKTOP", label: "سطح المكتب فقط", icon: Smartphone, desc: "برنامج الكاشير" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = targetPlatform === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTargetPlatform(item.id as any)}
                      className={`p-3 rounded-xl border text-right transition flex flex-col gap-1 ${
                        isSelected
                          ? "bg-indigo-50/70 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/10 shadow-sm"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <span className="text-xs font-black mt-1">{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. نوع العرض والتخطيط */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">شكل الظهور (Presentation Type)</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
                >
                  <option value="MODAL">نافذة منبثقة تفاعلية (Modal Box)</option>
                  <option value="BANNER">شريط علوي دائم (Top Banner)</option>
                  <option value="TOAST">إشعار جانبي منزلق (Toast)</option>
                  <option value="POPUP">تنبيه عائم أنيق (Bottom Popup)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">الأولوية (Priority)</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
                >
                  <option value="NORMAL">عادي (Normal Notice)</option>
                  <option value="URGENT">عاجل وهام (Urgent Alert 🚨)</option>
                  <option value="INFO">معلوماتي / ترقية ميزة (Info)</option>
                </select>
              </div>
            </div>

            {/* 3. قوالب الصور والتخطيط البصري */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-indigo-600" />
                تخطيط الصورة والقالب (Visual Template)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {[
                  { id: "TOP", label: "صورة في الأعلى" },
                  { id: "SIDE", label: "صورة جانبية" },
                  { id: "IMAGE_ONLY", label: "بوستر كامل تفاعلي" },
                  { id: "OVERLAY", label: "صورة كخلفية متدرجة" }
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setImagePlacement(tmpl.id as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      imagePlacement === tmpl.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. إدخال الصورة أو رفعها */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-indigo-600" />
                  رابط الصورة أو رفع بوستر من جهازك
                </span>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    مسح الصورة
                  </button>
                )}
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ضع رابط الصورة أو رابط Google Drive هنا..."
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  dir="ltr"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
                <label className="cursor-pointer px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 transition">
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  رفع من جهازك
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              <p className="text-[10px] text-slate-400">
                💡 يدعم روابط Google Drive ومواقع الرفع ورفع ملفات الصور مباشرة (PNG, JPG, WebP)
              </p>
            </div>

            {/* 5. العنوان والرسالة */}
            <div className="space-y-4">
              {imagePlacement !== 'IMAGE_ONLY' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">عنوان الإشعار *</label>
                  <input
                    type="text"
                    required={imagePlacement !== 'IMAGE_ONLY'}
                    placeholder="مثال: تحديث أمني جديد متاح، خصومات نهاية الأسبوع..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
                  />
                </div>
              )}

              {imagePlacement !== 'IMAGE_ONLY' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">تفاصيل الرسالة</label>
                  <textarea
                    rows={3}
                    placeholder="اكتب تفاصيل التنبيه أو محتوى العرض هنا..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition resize-none"
                  />
                </div>
              )}
            </div>

            {/* 6. الأزرار التفاعلية والروابط */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">نص الزر التفاعلي (Call to Action)</label>
                <input
                  type="text"
                  placeholder="مثال: ترقية الآن، تحميل التحديث، تفاصيل أكثر"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">رابط الزر (URL)</label>
                <input
                  type="text"
                  placeholder="مثال: https://manzoma.online/download"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* 7. الجمهور المستهدف وتاريخ الانتهاء */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">الجمهور المستهدف (Audience)</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
                >
                  <option value="ALL">جميع المستخدمين والشركات (عام)</option>
                  <option value="COMPANIES">شركات / فروع محددة</option>
                  <option value="USERS">مستخدمين محددين بالاسم</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">تاريخ وساعة الانتهاء (اختياري)</label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* اختيار شركات محددة */}
            {targetType === 'COMPANIES' && (
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700">حدد الشركات المستهدفة:</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {companies.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCompanies(prev => [...prev, c.id]);
                          else setSelectedCompanies(prev => prev.filter(id => id !== c.id));
                        }}
                        className="rounded accent-indigo-600"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* اختيار مستخدمين محددين */}
            {targetType === 'USERS' && (
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700">حدد المستخدمين:</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {users.map(u => (
                    <label key={u.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(u.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedUsers(prev => [...prev, u.id]);
                          else setSelectedUsers(prev => prev.filter(id => id !== u.id));
                        }}
                        className="rounded accent-indigo-600"
                      />
                      <span>{u.name} ({u.username})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-sm font-black transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري البث والتعميم...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  بث الإشعار فوراً لجميع الأجهزة
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                معاينة الإشعار المباشرة (Live Preview)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                {type}
              </span>
            </div>

            {/* Preview Box Container */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              {/* Background ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />

              {/* TEMPLATE 1: IMAGE_ONLY */}
              {imagePlacement === 'IMAGE_ONLY' && (
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Poster" className="w-full h-auto object-cover max-h-[360px]" />
                  ) : (
                    <div className="w-full h-48 bg-slate-800 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Image className="w-8 h-8 opacity-40" />
                      <span className="text-xs font-bold">ضع رابط صورة البوستر لمعاينتها</span>
                    </div>
                  )}
                  {actionLabel && (
                    <div className="absolute bottom-3 inset-x-3">
                      <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg">
                        {actionLabel}
                      </button>
                    </div>
                  )}
                  <button className="absolute top-2 left-2 p-1.5 bg-black/60 rounded-full text-white/80 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* TEMPLATE 2: OVERLAY */}
              {imagePlacement === 'OVERLAY' && (
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 min-h-[220px] flex flex-col justify-end p-5">
                  {imageUrl && (
                    <img src={imageUrl} alt="Backdrop" className="absolute inset-0 w-full h-full object-cover -z-10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 -z-10" />
                  <div className="text-white space-y-2">
                    <h4 className="text-base font-black leading-snug">{title || "عنوان الإشعار يظهر هنا"}</h4>
                    <p className="text-xs text-white/80 leading-relaxed line-clamp-3">{message || "تفاصيل الرسالة تظهر هنا بوضوح فوق الخلفية المتدرجة."}</p>
                    {actionLabel && (
                      <button className="mt-3 px-4 py-2 bg-white text-slate-950 rounded-xl text-xs font-black shadow-lg">
                        {actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TEMPLATE 3 & 4: TOP / SIDE */}
              {(imagePlacement === 'TOP' || imagePlacement === 'SIDE') && (
                <div className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br ${getThemeGradient()} p-5 space-y-4`}>
                  {/* Top Close */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/80 font-bold">
                      {priority === 'URGENT' ? '🚨 عاجل' : priority === 'INFO' ? 'ℹ️ معلومة' : '🔔 تنبيه'}
                    </span>
                    <button className="text-white/60 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body based on Placement */}
                  {imagePlacement === 'TOP' ? (
                    <div className="space-y-3">
                      {imageUrl && (
                        <div className="rounded-xl overflow-hidden max-h-36 border border-white/10">
                          <img src={imageUrl} alt="Header" className="w-full h-auto object-cover" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-black text-white">{title || "عنوان الإشعار"}</h4>
                        <p className="text-xs text-white/75 mt-1 leading-relaxed">{message || "نص الإشعار والمعلومات الخاصة بالعرض أو النظام."}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {imageUrl && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <img src={imageUrl} alt="Side" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-xs font-black text-white">{title || "عنوان الإشعار"}</h4>
                        <p className="text-[11px] text-white/75 mt-0.5 line-clamp-2">{message || "نص الإشعار يظهر بجانب الصورة بشكل مدمج."}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {actionLabel && (
                    <button className="w-full py-2 bg-white text-slate-900 rounded-xl text-xs font-black shadow-lg hover:bg-slate-100 transition">
                      {actionLabel}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Platform targeting summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between text-slate-600 font-bold">
              <span>المنصة المختارة:</span>
              <span className="text-indigo-600 font-black">
                {targetPlatform === 'ALL' ? 'الكل (ويب وديسكتوب)' : targetPlatform === 'WEB' ? 'الويب فقط' : 'سطح المكتب فقط'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900">سجل الإشعارات السابقة والنشطة</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">يمكنك تعطيل أي إشعار أو حذفه فوراً من جميع الأجهزة</p>
          </div>
          <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            العدد: {notifications.length}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            جاري تحميل السجل...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">
            لا توجد إشعارات مسجلة حالياً
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold">
                  <th className="py-3 px-3">العنوان والرسالة</th>
                  <th className="py-3 px-3">المنصة</th>
                  <th className="py-3 px-3">النوع</th>
                  <th className="py-3 px-3">الجمهور</th>
                  <th className="py-3 px-3">الحالة</th>
                  <th className="py-3 px-3">تاريخ الإنشاء</th>
                  <th className="py-3 px-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="font-black text-slate-900 truncate">{n.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{n.message || '—'}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        n.targetPlatform === 'DESKTOP'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : n.targetPlatform === 'WEB'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {n.targetPlatform === 'DESKTOP' ? '💻 ديسكتوب' : n.targetPlatform === 'WEB' ? '🌐 ويب' : '✨ الكل'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold">{n.type}</td>
                    <td className="py-3.5 px-3">
                      {n.targetType === 'ALL' ? 'العامة (الكل)' : n.targetType === 'COMPANIES' ? 'شركات محددة' : 'مستخدمين'}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggle(n.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black transition flex items-center gap-1.5 ${
                          n.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {n.isActive ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />}
                        {n.isActive ? 'نشط ومفعل' : 'معطل'}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(n.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="حذف الإشعار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
