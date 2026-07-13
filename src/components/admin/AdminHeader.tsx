import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Search, Bell, Settings, ChevronRight } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

export default function AdminHeader() {
  const location = useLocation();
  const { currentUser } = useAdminStore();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/admin":
        return "لوحة التحكم";
      case "/admin/landing":
        return "الصفحة الرئيسية";
      case "/admin/appearance":
        return "المظهر والعروض";
      case "/admin/navigation":
        return "القوائم والتنقل";
      case "/admin/packages":
        return "الباقات والأسعار";
      case "/admin/academy":
        return "الأكاديمية";
      case "/admin/pages":
        return "الصفحات";
      case "/admin/clients":
        return "إدارة العملاء";
      case "/admin/invoices":
        return "متصفح الفواتير";
      case "/admin/logs":
        return "سجلات النظام";
      case "/admin/stats":
        return "التقارير المالية";
      case "/admin/settings":
        return "الإعدادات العامة";
      case "/admin/users":
        return "المديرين والصلاحيات";
      default:
        return "لوحة التحكم";
    }
  };

  return (
    <header className="flex items-center justify-between py-4 px-8 bg-slate-50 border-b border-slate-200 shrink-0 sticky top-0 z-30" dir="rtl">
      {/* Left (RTL Right) - Breadcrumbs */}
      <div className="flex items-center gap-3 text-sm">
        <Link to="/admin" className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span>الصفحات</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">{getPageTitle(location.pathname)}</span>
        </div>
      </div>

      {/* Right (RTL Left) - Actions */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن عناصر، أقسام، والمزيد..."
            className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
          <Link to="/admin/settings" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 text-slate-600 font-bold overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all">
          {(currentUser as any)?.avatar ? (
            <img src={(currentUser as any).avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">{currentUser?.name?.charAt(0) || "M"}</span>
          )}
        </div>
      </div>
    </header>
  );
}
