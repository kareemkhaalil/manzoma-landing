import React, { useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Search, Filter, ExternalLink, MoreVertical, Calendar, User, Store, ChevronDown } from "lucide-react";

export default function SubscriptionsList() {
  const { subscriptions, packages } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getPackageName = (id: string) => packages.find((p) => p.id === id)?.name || "غير معروفة";

  const filtered = subscriptions.filter((sub) => {
    const matchSearch = search === "" || sub.storeName.includes(search) || sub.ownerName.includes(search) || sub.email.includes(search);
    const matchStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string; dot: string }> = {
      active: { label: "نشط", cls: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" },
      trial: { label: "تجريبي", cls: "bg-blue-50 text-brand-primary border-blue-100", dot: "bg-brand-primary" },
      expired: { label: "منتهي", cls: "bg-rose-50 text-rose-600 border-rose-100", dot: "bg-rose-500" },
    };
    const s = map[status] || map.expired;
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-[900] inline-flex items-center gap-1.5 border ${s.cls}`}>
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
          <h1 className="text-2xl font-[900] text-brand-navy">إدارة المشتركين</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">قائمة المتاجر والعملاء المسجلين في المنصة</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث عن متجر أو عميل..."
              className="bg-white border border-brand-border/40 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-brand-navy focus:ring-2 focus:ring-brand-primary/10 outline-none w-64 transition-all"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-brand-border/40 rounded-2xl px-5 py-3 pr-10 text-sm font-bold text-brand-navy outline-none focus:ring-2 focus:ring-brand-primary/10 cursor-pointer"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="trial">تجريبي</option>
              <option value="expired">منتهي</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results info */}
      <p className="text-xs font-bold text-brand-muted">
        عرض {filtered.length} من {subscriptions.length} مشترك
      </p>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-brand-border/40 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/20">
                <th className="px-6 py-4 text-right text-xs font-[900] text-brand-muted uppercase tracking-wider">المتجر والمالك</th>
                <th className="px-6 py-4 text-right text-xs font-[900] text-brand-muted uppercase tracking-wider">الباقة</th>
                <th className="px-6 py-4 text-right text-xs font-[900] text-brand-muted uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4 text-right text-xs font-[900] text-brand-muted uppercase tracking-wider">تاريخ الانتهاء</th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-brand-muted uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/15">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-brand-bg/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary border border-brand-primary/10">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-[800] text-brand-navy text-sm">{sub.storeName}</p>
                        <p className="text-xs font-medium text-brand-muted flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" />
                          {sub.ownerName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-[800] bg-slate-50 text-slate-600 border border-slate-200">
                      {getPackageName(sub.packageId)}
                    </span>
                  </td>
                  <td className="px-6 py-5">{statusBadge(sub.status)}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-brand-navy/60 font-mono">
                      <Calendar className="w-4 h-4 text-brand-muted" />
                      {sub.expiryDate}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-left">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-brand-muted hover:text-brand-navy hover:bg-brand-bg rounded-xl transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-brand-muted font-bold">لا توجد نتائج مطابقة للبحث</p>
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
