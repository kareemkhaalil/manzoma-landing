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
      case "/admin/notifications":
        return "مركز الإشعارات والبث الموحد";
      case "/admin/users":
        return "المديرين والصلاحيات";
      default:
        return "لوحة التحكم";
    }
  };

  return (
    <div className="w-full flex flex-col shrink-0 sticky top-0 z-30" dir="rtl">
      <header className="flex items-center justify-between py-4 px-8 bg-white border-b border-slate-200 w-full shadow-2xs">
        {/* Left (RTL Right) - Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm">
          <Link to="/admin" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span>لوحة الإدارة</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-black">{getPageTitle(location.pathname)}</span>
          </div>
        </div>

        {/* Right (RTL Left) - Actions */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="relative hidden md:block w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث في النظام..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <Link
              to="/admin/notifications"
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors relative"
              title="مركز الإشعارات والبث"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse"></span>
            </Link>
            <Link
              to="/admin/settings"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="الإعدادات العامة"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 border-r border-slate-200 pr-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
              {currentUser?.name?.charAt(0) || "M"}
            </div>
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-black text-slate-900 leading-tight">{currentUser?.name || "المدير العام"}</span>
              <span className="text-[10px] text-slate-400 font-bold">SUPER_ADMIN</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
