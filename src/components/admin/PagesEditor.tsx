import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Plus, Trash2, Eye, EyeOff, Globe, X, Save, GripVertical,
  ArrowUpDown, ExternalLink,
} from "lucide-react";
import { useAdminStore, DynamicPage } from "../../store/adminStore";
import { createPublicPage, updatePublicPage, deletePublicPage } from "../../lib/apiService";

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

  const savePage = async () => {
    if (!editingPage) return;

    try {
      const existing = pages.find((p) => p.id === editingPage.id);
      let savedData;
      
      const payload = {
        slug: editingPage.slug,
        title: editingPage.title,
        content: editingPage.content,
        seoTitle: editingPage.heroTitle,
        seoDesc: editingPage.heroSubtitle,
        status: editingPage.isPublished ? "PUBLISHED" : "DRAFT"
      };

      if (existing && !editingPage.id.startsWith("page-")) {
        // Update existing page via API
        savedData = await updatePublicPage(editingPage.id, payload);
      } else {
        // Create new page via API
        savedData = await createPublicPage(payload);
      }

      // Re-initialize CMS to fetch fresh pages
      await useAdminStore.getState().initializeCMSData();

      setEditingPage(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err: any) {
      alert("Error saving page: " + (err.message || "Unknown error"));
    }
  };

  const deletePage = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الصفحة؟")) {
      try {
        if (!id.startsWith("page-")) {
          await deletePublicPage(id);
        }
        await useAdminStore.getState().initializeCMSData();
      } catch (err: any) {
        alert("Error deleting page: " + (err.message || "Unknown error"));
      }
    }
  };

  const toggleField = async (id: string, field: "isPublished" | "showInHeader" | "showInFooter") => {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    
    // We only map `isPublished` to API `status`
    // The others (header/footer) should be handled via the NavigationEditor.
    if (field === "isPublished") {
      try {
        const newStatus = page.status === "PUBLISHED" || page.isPublished ? "DRAFT" : "PUBLISHED";
        if (!id.startsWith("page-")) {
          await updatePublicPage(id, { status: newStatus });
        }
        await useAdminStore.getState().initializeCMSData();
      } catch (err) {
        console.error("Failed to toggle status", err);
      }
    } else {
      // For backwards compatibility in UI until NavEditor is fully wired
      const newPages = pages.map((p) =>
        p.id === id ? { ...p, [field]: !p[field] } : p
      );
      updateConfig((prev) => ({ ...prev, pages: newPages }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            <FileText className="inline-block w-7 h-7 text-indigo-600 ml-3" />
            إدارة الصفحات
          </h1>
          <p className="text-sm text-slate-500 font-medium">
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
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-500/30 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">لا توجد صفحات بعد</p>
            <p className="text-sm text-slate-500/60 mt-1">اضغط على "إضافة صفحة جديدة" للبدء</p>
          </div>
        )}

        {pages.map((page) => (
          <motion.div
            key={page.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-sm transition-all duration-300"
          >
            {/* Page Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-indigo-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-base truncate">
                  {page.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
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
                  page.status === 'PUBLISHED' || page.isPublished
                    ? "bg-brand-emerald/10 text-brand-emerald"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {page.status === 'PUBLISHED' || page.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {page.status === 'PUBLISHED' || page.isPublished ? "منشورة" : "مسودة"}
              </button>

              {/* Show in Header */}
              <button
                onClick={() => toggleField(page.id, "showInHeader")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  page.showInHeader
                    ? "bg-indigo-600 text-indigo-600"
                    : "bg-slate-100 text-slate-500"
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
                    ? "bg-indigo-600 text-indigo-600"
                    : "bg-slate-100 text-slate-500"
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
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setEditingPage({ ...page })}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => deletePage(page.id)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-brand-rose transition-colors"
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
              className="fixed inset-4 md:inset-8 lg:inset-y-8 lg:inset-x-[15%] z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 shrink-0">
                <h2 className="text-lg font-bold text-slate-900">
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
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900"
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
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      عنوان الصفحة
                    </label>
                    <input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, title: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      الرابط (Slug)
                    </label>
                    <input
                      type="text"
                      value={editingPage.slug}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, slug: e.target.value.replace(/\s/g, "-").toLowerCase() })
                      }
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary transition-colors text-left"
                      placeholder="about-us"
                    />
                  </div>
                </div>

                {/* Row 2: Hero Title & Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      عنوان الهيرو
                    </label>
                    <input
                      type="text"
                      value={editingPage.heroTitle || ""}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, heroTitle: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      وصف الهيرو
                    </label>
                    <input
                      type="text"
                      value={editingPage.heroSubtitle || ""}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, heroSubtitle: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.status === "PUBLISHED" || editingPage.isPublished}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, isPublished: e.target.checked, status: e.target.checked ? "PUBLISHED" : "DRAFT" })
                      }
                      className="w-4 h-4 rounded accent-brand-primary"
                    />
                    <span className="text-sm font-bold text-slate-900">منشورة</span>
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
                    <span className="text-sm font-bold text-slate-900">ظاهرة في الهيدر</span>
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
                    <span className="text-sm font-bold text-slate-900">ظاهرة في الفوتر</span>
                  </label>
                </div>

                {/* Order */}
                <div className="w-32">
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    value={editingPage.order}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, order: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    محتوى الصفحة
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    استخدم <code className="bg-slate-50 px-1 rounded">## عنوان</code> للعناوين، و <code className="bg-slate-50 px-1 rounded">- عنصر</code> للقوائم، و <code className="bg-slate-50 px-1 rounded">**نص**</code> للنص العريض
                  </p>
                  <textarea
                    value={editingPage.content}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, content: e.target.value })
                    }
                    rows={16}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand-primary transition-colors resize-y leading-relaxed"
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
