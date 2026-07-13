import React, { useState, useRef, useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Search, Filter, ExternalLink, MoreVertical, Calendar, User, Store, ChevronDown, Copy, RefreshCw, PowerOff, Key, MonitorSmartphone } from "lucide-react";

export default function SubscriptionsList() {
  const { subscriptions, packages, generateLicenseKey, revokeHWID, suspendSubscription } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getPackageName = (id: string) => packages.find((p) => p.id === id)?.name || "غير معروفة";

  const filtered = subscriptions.filter((sub) => {
    const searchLower = search.toLowerCase();
    const matchSearch = search === "" || 
      sub.storeName.includes(searchLower) || 
      sub.ownerName.includes(searchLower) || 
      sub.email.toLowerCase().includes(searchLower) ||
      (sub.phone && sub.phone.includes(searchLower)) ||
      (sub.licenseKey && sub.licenseKey.toLowerCase().includes(searchLower));
    
    const matchStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string; dot: string }> = {
      active: { label: "نشط", cls: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" },
      trial: { label: "تجريبي", cls: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500" },
      past_due: { label: "متأخر الدفع", cls: "bg-orange-50 text-orange-600 border-orange-100", dot: "bg-orange-500" },
      suspended: { label: "موقوف", cls: "bg-rose-50 text-rose-600 border-rose-100", dot: "bg-rose-500" },
      expired: { label: "منتهي", cls: "bg-slate-50 text-slate-600 border-slate-200", dot: "bg-slate-500" },
    };
    const s = map[status] || map.expired;
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 border ${s.cls}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المشتركين</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">قائمة المتاجر والعملاء المسجلين في المنصة</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم، الجوال، أو الترخيص..."
              className="bg-white border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-primary/10 outline-none w-72 transition-all"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3 pr-10 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-primary/10 cursor-pointer"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="trial">تجريبي</option>
              <option value="past_due">متأخر الدفع</option>
              <option value="suspended">موقوف</option>
              <option value="expired">منتهي</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results info */}
      <p className="text-xs font-bold text-slate-500">
        عرض {filtered.length} من {subscriptions.length} مشترك
      </p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">المتجر والمالك</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الباقة</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الترخيص والأجهزة</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة والتاريخ</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/15">
              {filtered.map((sub) => (
                <tr key={sub.id} className={`transition-colors group ${sub.status === 'suspended' ? 'bg-rose-50/30' : 'hover:bg-slate-50/30'}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-indigo-600 border border-brand-primary/10">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{sub.storeName}</p>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" />
                          {sub.ownerName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                      {getPackageName(sub.packageId)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      {sub.licenseKey ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900">
                          <Key className="w-3.5 h-3.5 text-slate-500" />
                          {sub.licenseKey}
                        </div>
                      ) : (
                        <button onClick={() => generateLicenseKey(sub.id)} className="text-[10px] font-bold text-indigo-600 bg-indigo-600 px-2 py-0.5 rounded-full w-max">
                          إصدار ترخيص
                        </button>
                      )}
                      
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <MonitorSmartphone className="w-3.5 h-3.5 text-slate-500" />
                        {sub.hwid ? (
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            مربوط بجهاز
                          </span>
                        ) : (
                          <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">غير مربوط</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      {statusBadge(sub.status)}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {sub.expiryDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-left relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-600 rounded-xl transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === sub.id ? null : sub.id);
                          }}
                          className={`p-2 rounded-xl transition-all ${openDropdownId === sub.id ? 'bg-brand-navy text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Shadcn-like DropdownMenu */}
                        {openDropdownId === sub.id && (
                          <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-sm border border-slate-200 z-50 py-1 flex flex-col text-right">
                            {sub.licenseKey && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(sub.licenseKey);
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center justify-end gap-2 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50 w-full"
                              >
                                نسخ مفتاح التفعيل
                                <Copy className="w-4 h-4 text-slate-500" />
                              </button>
                            )}
                            
                            {sub.hwid && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  revokeHWID(sub.id);
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center justify-end gap-2 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50 w-full"
                              >
                                تصفير قفل الجهاز
                                <RefreshCw className="w-4 h-4 text-slate-500" />
                              </button>
                            )}

                            {sub.status !== 'suspended' && (
                              <>
                                <div className="h-px bg-brand-border/40 my-1 mx-2" />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    suspendSubscription(sub.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center justify-end gap-2 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 w-full"
                                >
                                  إيقاف الخدمة مؤقتاً
                                  <PowerOff className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-slate-500 font-bold">لا توجد نتائج مطابقة للبحث</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
