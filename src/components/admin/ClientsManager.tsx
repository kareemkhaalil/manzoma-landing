import React, { useState, useEffect } from "react";
import {
  Search, Plus, Store, User, Key, MonitorSmartphone, MoreVertical,
  RefreshCw, PowerOff, ChevronDown, Copy, Eye, Shield, X, Loader2,
  Building2, Package, ShoppingCart, Users as UsersIcon, AlertTriangle, Database, Calendar
} from "lucide-react";
import {
  fetchCompanies, createCompany, updateCompanyStatus,
  generateLicense, revokeLicense, impersonateCompany,
  downloadCompanyBackup, updateSubscriptionAdvanced,
  type CompanyFromAPI
} from "../../lib/apiService";

type ModalState = null | "create" | "license" | "editSubscription";

export default function ClientsManager() {
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [subForm, setSubForm] = useState({ planName: "", endsAt: "" });

  // Form state for creating new client
  const [form, setForm] = useState({
    name: "", adminEmail: "", phone: "", planName: "BASIC",
    adminFullName: "", adminUsername: "", adminPassword: ""
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
    const handleClick = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !search || c.name.toLowerCase().includes(q) ||
      (c.adminEmail && c.adminEmail.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q));
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "active" && c.isActive) ||
      (statusFilter === "suspended" && !c.isActive);
    return matchSearch && matchStatus;
  });

  const handleCreate = async () => {
    if (!form.name || !form.adminUsername || !form.adminPassword) return;
    setActionLoading(true);
    try {
      await createCompany(form);
      showToast(`تم إنشاء "${form.name}" بنجاح ✅`);
      setModal(null);
      setForm({ name: "", adminEmail: "", phone: "", planName: "BASIC", adminFullName: "", adminUsername: "", adminPassword: "" });
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (company: CompanyFromAPI) => {
    const newStatus = company.isActive ? "SUSPENDED" : "ACTIVE";
    setActionLoading(true);
    try {
      await updateCompanyStatus(company.id, newStatus);
      showToast(`تم ${newStatus === "ACTIVE" ? "تفعيل" : "تعليق"} "${company.name}" ✅`);
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleGenerateLicense = async () => {
    if (!selectedCompanyId) return;
    const company = companies.find(c => c.id === selectedCompanyId);
    if (!company) return;
    setActionLoading(true);
    try {
      const result = await generateLicense(selectedCompanyId, company.planName);
      showToast(`تم توليد ترخيص: ${result.serialKey} ✅`);
      setModal(null);
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeLicense = async (licenseId: string) => {
    setActionLoading(true);
    try {
      await revokeLicense(licenseId);
      showToast("تم إلغاء الترخيص ✅");
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleDownloadBackup = async (companyId: string, companyName: string) => {
    setActionLoading(true);
    try {
      showToast("جاري تجهيز وتحميل النسخة الاحتياطية...");
      await downloadCompanyBackup(companyId, companyName);
      showToast("تم تنزيل نسخة الاحتياط ✅");
    } catch (err: any) {
      showToast(`فشل التحميل: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleImpersonate = async (companyId: string) => {
    setActionLoading(true);
    try {
      const result = await impersonateCompany(companyId);
      // Open the ERP app in a new tab with the impersonation token
      const appUrl = `https://app.manzoma.online/#/login?impersonate=${result.token}`;
      window.open(appUrl, "_blank");
      showToast(`تم فتح حساب "${result.companyName}" في تبويب جديد`);
    } catch (err: any) {
      showToast(`خطأ في المحاكاة: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedCompanyId) return;
    setActionLoading(true);
    try {
      await updateSubscriptionAdvanced(selectedCompanyId, {
        planName: subForm.planName,
        subscriptionEndsAt: subForm.endsAt
      });
      showToast("تم تحديث مدة الاشتراك بنجاح ✅");
      setModal(null);
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditSubModal = (company: CompanyFromAPI) => {
    setSelectedCompanyId(company.id);
    setSubForm({
      planName: company.planName || "BASIC",
      endsAt: company.subscriptionEndsAt ? new Date(company.subscriptionEndsAt).toISOString().slice(0,16) : ""
    });
    setModal("editSubscription");
    setOpenDropdownId(null);
  };

  const statusBadge = (isActive: boolean, status: string) => {
    const active = isActive && status === "ACTIVE";
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 border ${
        active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
        {active ? "نشط" : "موقوف"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4" dir="rtl">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold">جاري تحميل بيانات العملاء...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4" dir="rtl">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-slate-900 font-bold">فشل الاتصال بالسيرفر</p>
        <p className="text-slate-500 text-sm font-bold">{error}</p>
        <button onClick={loadCompanies} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-brand-navy text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة العملاء</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {companies.length} عميل مسجل — {companies.filter(c => c.isActive).length} نشط
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadCompanies} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-brand-primary/30 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20">
            <Plus className="w-4 h-4" />
            إضافة عميل جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم، البريد، أو الجوال..."
            className="bg-white border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-primary/10 outline-none w-full transition-all" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3 pr-10 text-sm font-bold text-slate-900 outline-none cursor-pointer">
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="suspended">موقوف</option>
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الشركة</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الإحصائيات</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الترخيص</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/15">
              {filtered.map((company) => {
                const license = company.licenses?.[0];
                return (
                  <tr key={company.id} className={`transition-colors group ${!company.isActive ? "bg-rose-50/30" : "hover:bg-slate-50/30"}`}>
                    {/* Company Info */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-indigo-600 border border-brand-primary/10">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{company.name}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{company.adminEmail || company.phone || "—"}</p>
                          <p className="text-[10px] font-bold text-indigo-600/60 mt-0.5">{company.planName}</p>
                        </div>
                      </div>
                    </td>
                    {/* Stats */}
                    <td className="px-6 py-5">
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />{company._count.users} مستخدم</span>
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" />{company._count.products} منتج</span>
                        <span className="flex items-center gap-1"><Store className="w-3 h-3" />{company._count.branches} فرع</span>
                        <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" />{company._count.orders} فاتورة</span>
                      </div>
                    </td>
                    {/* License */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        {license ? (
                          <>
                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900">
                              <Key className="w-3.5 h-3.5 text-slate-500" />
                              {license.serialKey}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                              <MonitorSmartphone className="w-3.5 h-3.5 text-slate-500" />
                              {license.hwid ? (
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />مربوط
                                </span>
                              ) : (
                                <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">غير مربوط</span>
                              )}
                            </div>
                          </>
                        ) : (
                          <button onClick={() => { setSelectedCompanyId(company.id); setModal("license"); }}
                            className="text-[10px] font-bold text-indigo-600 bg-indigo-600 px-3 py-1 rounded-full w-max hover:bg-indigo-600 transition-all">
                            إصدار ترخيص
                          </button>
                        )}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-5">
                      {statusBadge(company.isActive, company.status)}
                      {company.subscriptionEndsAt && (
                        <p className="text-[10px] font-bold text-slate-500 mt-1.5">
                          ينتهي: {new Date(company.subscriptionEndsAt).toLocaleDateString("ar-EG")}
                        </p>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-5 text-left relative">
                      <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === company.id ? null : company.id); }}
                          className={`p-2 rounded-xl transition-all ${openDropdownId === company.id ? "bg-brand-navy text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}>
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openDropdownId === company.id && (
                          <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-sm border border-slate-200 z-50 py-1 flex flex-col text-right">
                            <button onClick={(e) => { e.stopPropagation(); handleImpersonate(company.id); }}
                              className="flex items-center justify-end gap-2 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 w-full">
                              محاكاة الدخول <Eye className="w-4 h-4 text-slate-500" />
                            </button>
                             <button onClick={(e) => { e.stopPropagation(); handleDownloadBackup(company.id, company.name); }}
                              className="flex items-center justify-end gap-2 px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-600 w-full">
                              نسخة احتياطية للعميل <Database className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); openEditSubModal(company); }}
                              className="flex items-center justify-end gap-2 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 w-full">
                              تعديل مدة الاشتراك <Calendar className="w-4 h-4 text-slate-500" />
                            </button>
                            {license && (
                              <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(license.serialKey); showToast("تم نسخ مفتاح التفعيل"); setOpenDropdownId(null); }}
                                className="flex items-center justify-end gap-2 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 w-full">
                                نسخ مفتاح التفعيل <Copy className="w-4 h-4 text-slate-500" />
                              </button>
                            )}
                            {!license && (
                              <button onClick={(e) => { e.stopPropagation(); setSelectedCompanyId(company.id); setModal("license"); setOpenDropdownId(null); }}
                                className="flex items-center justify-end gap-2 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 w-full">
                                إصدار ترخيص <Key className="w-4 h-4 text-slate-500" />
                              </button>
                            )}
                            {license && license.hwid && (
                              <button onClick={(e) => { e.stopPropagation(); handleRevokeLicense(license.id); }}
                                className="flex items-center justify-end gap-2 px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 w-full">
                                تصفير الجهاز (HWID) <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <div className="h-px bg-brand-border/40 my-1 mx-2" />
                            <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(company); }}
                              className={`flex items-center justify-end gap-2 px-4 py-2.5 text-sm font-bold w-full ${
                                company.isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                              }`}>
                              {company.isActive ? "إيقاف الخدمة" : "إعادة التفعيل"}
                              {company.isActive ? <PowerOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-16 text-center">
                  <p className="text-slate-500 font-bold">لا توجد نتائج</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Client Modal */}
      {modal === "create" && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-4 left-4 p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">إضافة عميل جديد</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">اسم الشركة *</label>
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="مثال: سوبر ماركت النور" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">اسم المدير</label>
                  <input value={form.adminFullName} onChange={(e) => setForm(f => ({ ...f, adminFullName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="أحمد محمد" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">البريد الإلكتروني</label>
                  <input value={form.adminEmail} onChange={(e) => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">رقم الجوال</label>
                  <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="01001234567" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">الباقة</label>
                  <select value={form.planName} onChange={(e) => setForm(f => ({ ...f, planName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none cursor-pointer">
                    <option value="BASIC">أساسية</option>
                    <option value="PREMIUM">احترافية</option>
                    <option value="ENTERPRISE">مؤسسات</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4 mt-2">
                <p className="text-xs font-bold text-slate-900 mb-3">بيانات تسجيل الدخول للعميل</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">اسم المستخدم *</label>
                    <input value={form.adminUsername} onChange={(e) => setForm(f => ({ ...f, adminUsername: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="admin-store" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">كلمة المرور *</label>
                    <input type="password" value={form.adminPassword} onChange={(e) => setForm(f => ({ ...f, adminPassword: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="••••••" />
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleCreate} disabled={actionLoading || !form.name || !form.adminUsername || !form.adminPassword}
              className="w-full mt-6 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {actionLoading ? "جاري الإنشاء..." : "إنشاء العميل"}
            </button>
          </div>
        </div>
      )}

      {/* License Generation Modal */}
      {modal === "license" && selectedCompanyId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative text-center" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <Key className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-900 mb-2">إصدار ترخيص جديد</h2>
            <p className="text-sm text-slate-500 font-bold mb-6">سيتم توليد مفتاح تفعيل لمدة 12 شهر</p>
            <button onClick={handleGenerateLicense} disabled={actionLoading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              {actionLoading ? "جاري التوليد..." : "توليد المفتاح"}
            </button>
          </div>
        </div>
      )}

      {/* Advanced Subscription Edit Modal */}
      {modal === "editSubscription" && selectedCompanyId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">تعديل تفاصيل الاشتراك</h2>
            
            <div className="space-y-4 mb-8">
               <div>
                 <label className="block text-sm font-bold text-slate-500 mb-2">الباقة الحالية</label>
                 <select 
                   value={subForm.planName}
                   onChange={(e) => setSubForm({ ...subForm, planName: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-50 border rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20"
                 >
                   <option value="BASIC">الباقة الأساسية</option>
                   <option value="PREMIUM">الباقة الاحترافية</option>
                   <option value="ENTERPRISE">باقة المؤسسات</option>
                   <option value="TRIAL">فترة تجريبية</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-500 mb-2">تاريخ ووقت انتهاء الاشتراك</label>
                 <input 
                   type="datetime-local"
                   value={subForm.endsAt}
                   onChange={(e) => setSubForm({ ...subForm, endsAt: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-50 border rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/20 text-right"
                 />
               </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setModal(null)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                إلغاء
              </button>
              <button onClick={handleUpdateSubscription} disabled={actionLoading}
                className="flex-1 bg-brand-navy text-white py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {actionLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
