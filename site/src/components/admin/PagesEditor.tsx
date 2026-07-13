import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Plus, Trash2, Eye, EyeOff, Globe, X, Save, GripVertical,
  ArrowUpDown, ExternalLink,
} from "lucide-react";
import { useAdminStore, DynamicPage } from "../../store/adminStore";

export default function PagesEditor() {
  const { config, updateConfig } = useAdminStore();
  const pages = config.pages || [];
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [showToast, setShowToast] = useState(false);

  const generateId = () => `page-${Date.now()}`;

  const addPage = () => {
    const newPage: DynamicPage = {
      id: generateId(),
      title: "صفحة جديدة",
      slug: `new-page-${Date.now()}`,
      content: "محتوى الصفحة هنا...",
      heroTitle: "صفحة جديدة",
      heroSubtitle: "",
      isPublished: false,
      showInHeader: false,
      showInFooter: false,
      order: pages.length + 1,
    };
    setEditingPage(newPage);
  };

  const savePage = () => {
    if (!editingPage) return;

    const existing = pages.find((p) => p.id === editingPage.id);
    let newPages: DynamicPage[];

    if (existing) {
      newPages = pages.map((p) => (p.id === editingPage.id ? editingPage : p));
    } else {
      newPages = [...pages, editingPage];
    }

    updateConfig((prev) => ({ ...prev, pages: newPages }));
    setEditingPage(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const deletePage = (id: string) => {
    const newPages = pages.filter((p) => p.id !== id);
    updateConfig((prev) => ({ ...prev, pages: newPages }));
  };

  const toggleField = (id: string, field: "isPublished" | "showInHeader" | "showInFooter") => {
    const newPages = pages.map((p) =>
      p.id === id ? { ...p, [field]: !p[field] } : p
    );
    updateConfig((prev) => ({ ...prev, pages: newPages }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-[900] text-brand-navy mb-2">
            <FileText className="inline-block w-7 h-7 text-brand-primary ml-3" />
            إدارة الصفحات
          </h1>
          <p className="text-sm text-brand-muted font-medium">
            أنشئ صفحات ديناميكية وتحكم في ظهورها في الهيدر والفوتر
          </p>
        </div>
        <button
          onClick={addPage}
          className="btn-primary px-6 py-3 text-sm gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          إضافة صفحة جديدة
        </button>
      </div>

      {/* Pages List */}
      <div className="space-y-3">
        {pages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-brand-border/60">
            <FileText className="w-12 h-12 text-brand-muted/30 mx-auto mb-4" />
            <p className="text-brand-muted font-bold">لا توجد صفحات بعد</p>
            <p className="text-sm text-brand-muted/60 mt-1">اضغط على "إضافة صفحة جديدة" للبدء</p>
          </div>
        )}

        {pages.map((page) => (
          <motion.div
            key={page.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-brand-border/60 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-premium transition-all duration-300"
          >
            {/* Page Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[900] text-brand-navy text-base truncate">
                  {page.title}
                </h3>
                <p className="text-xs text-brand-muted font-medium mt-0.5">
                  /page/{page.slug}
                </p>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Published */}
              <button
                onClick={() => toggleField(page.id, "isPublished")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  page.isPublished
                    ? "bg-brand-emerald/10 text-brand-emerald"
                    : "bg-slate-100 text-brand-muted"
                }`}
              >
                {page.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {page.isPublished ? "منشورة" : "مسودة"}
              </button>

              {/* Show in Header */}
              <button
                onClick={() => toggleField(page.id, "showInHeader")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  page.showInHeader
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "bg-slate-100 text-brand-muted"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                هيدر
              </button>

              {/* Show in Footer */}
              <button
                onClick={() => toggleField(page.id, "showInFooter")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  page.showInFooter
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "bg-slate-100 text-brand-muted"
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                فوتر
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`/page/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-brand-bg text-brand-muted hover:text-brand-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setEditingPage({ ...page })}
                className="p-2.5 rounded-xl bg-brand-bg text-brand-muted hover:text-brand-primary transition-colors"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => deletePage(page.id)}
                className="p-2.5 rounded-xl bg-brand-bg text-brand-muted hover:text-brand-rose transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPage(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed inset-4 md:inset-8 lg:inset-y-8 lg:inset-x-[15%] z-50 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border shrink-0">
                <h2 className="text-lg font-[900] text-brand-navy">
                  {pages.find((p) => p.id === editingPage.id) ? "تعديل صفحة" : "صفحة جديدة"}
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={savePage}
                    className="btn-primary px-5 py-2.5 text-sm gap-2"
                  >
                    <Save className="w-4 h-4" />
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditingPage(null)}
                    className="p-2 rounded-xl text-brand-muted hover:text-brand-navy"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Row 1: Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2">
                      عنوان الصفحة
                    </label>
                    <input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, title: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2">
                      الرابط (Slug)
                    </label>
                    <input
                      type="text"
                      value={editingPage.slug}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, slug: e.target.value.replace(/\s/g, "-").toLowerCase() })
                      }
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-primary transition-colors text-left"
                      placeholder="about-us"
                    />
                  </div>
                </div>

                {/* Row 2: Hero Title & Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2">
                      عنوان الهيرو
                    </label>
                    <input
                      type="text"
                      value={editingPage.heroTitle || ""}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, heroTitle: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2">
                      وصف الهيرو
                    </label>
                    <input
                      type="text"
                      value={editingPage.heroSubtitle || ""}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, heroSubtitle: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.isPublished}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, isPublished: e.target.checked })
                      }
                      className="w-4 h-4 rounded accent-brand-primary"
                    />
                    <span className="text-sm font-bold text-brand-navy">منشورة</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.showInHeader}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, showInHeader: e.target.checked })
                      }
                      className="w-4 h-4 rounded accent-brand-primary"
                    />
                    <span className="text-sm font-bold text-brand-navy">ظاهرة في الهيدر</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.showInFooter}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, showInFooter: e.target.checked })
                      }
                      className="w-4 h-4 rounded accent-brand-primary"
                    />
                    <span className="text-sm font-bold text-brand-navy">ظاهرة في الفوتر</span>
                  </label>
                </div>

                {/* Order */}
                <div className="w-32">
                  <label className="block text-sm font-bold text-brand-navy mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    value={editingPage.order}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, order: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-2">
                    محتوى الصفحة
                  </label>
                  <p className="text-xs text-brand-muted mb-2">
                    استخدم <code className="bg-brand-bg px-1 rounded">## عنوان</code> للعناوين، و <code className="bg-brand-bg px-1 rounded">- عنصر</code> للقوائم، و <code className="bg-brand-bg px-1 rounded">**نص**</code> للنص العريض
                  </p>
                  <textarea
                    value={editingPage.content}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, content: e.target.value })
                    }
                    rows={16}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm font-medium text-brand-navy focus:outline-none focus:border-brand-primary transition-colors resize-y leading-relaxed"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-brand-navy text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold"
          >
            ✅ تم حفظ الصفحة بنجاح
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
