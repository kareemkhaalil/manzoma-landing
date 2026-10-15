import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
  Layers,
  Play,
  TrendingUp,
  Package,
  Users,
  Globe,
  FileText,
  Palette,
  Link as LinkIcon,
  Building2,
  Terminal,
  Receipt,
  CreditCard,
  CheckSquare,
  Bell,
  Sparkles,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../store/adminStore";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { config, logout, currentUser } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navSections = [
    {
      title: "الرئيسية والتحكم المباشر",
      items: [
        { href: "/admin", icon: LayoutDashboard, label: "لوحة التحكم" },
        { href: "/admin/notifications", icon: Bell, label: "مركز الإشعارات والبث", badge: "جديد" },
      ],
    },
    {
      title: "إدارة المحتوى والمظهر",
      items: [
        { href: "/admin/landing", icon: Globe, label: "الصفحة الرئيسية" },
        { href: "/admin/appearance", icon: Palette, label: "المظهر والعروض" },
        { href: "/admin/navigation", icon: LinkIcon, label: "القوائم والتنقل" },
        { href: "/admin/packages", icon: Package, label: "الباقات والأسعار" },
        { href: "/admin/academy", icon: Play, label: "الأكاديمية" },
        { href: "/admin/pages", icon: FileText, label: "الصفحات" },
      ],
    },
    {
      title: "إدارة العملاء والنظام",
      items: [
        { href: "/admin/clients", icon: Building2, label: "إدارة العملاء والميزات", badge: "تحكم الميزات" },
        { href: "/admin/payment-methods", icon: CreditCard, label: "حسابات الاستلام" },
        { href: "/admin/payment-approvals", icon: CheckSquare, label: "موافقات الدفع" },
        { href: "/admin/invoices", icon: Receipt, label: "متصفح الفواتير" },
        { href: "/admin/releases", icon: RefreshCw, label: "التحديثات والإصدارات (OTA)" },
        { href: "/admin/logs", icon: Terminal, label: "سجلات النظام" },
        { href: "/admin/stats", icon: TrendingUp, label: "التقارير المالية" },
        { href: "/admin/settings", icon: Settings, label: "الإعدادات العامة" },
      ],
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-l border-slate-200" dir="rtl">
      {/* Brand */}
      <div className="flex flex-col px-6 py-5 border-b border-slate-200 shrink-0 gap-3">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="h-10 px-2 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            <img
              src="/logo-main.png"
              alt="منظومة"
              className="h-7 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/cdn/logo.png';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-[900] text-lg leading-tight">منظومة ERP</span>
            <span className="text-[10px] text-slate-400 font-bold">لوحة التحكم المركزية HQ</span>
          </div>
        </Link>

        {/* Live Cloud Status Badge */}
        <div className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-blue-50/50 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-700">السيرفر السحابي متصل</span>
          </div>
          <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded-md border border-indigo-200/60 text-indigo-700 shadow-2xs">
            SUPER_ADMIN
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-slate-400 hover:text-slate-700 transition-colors self-end"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active
                        ? "bg-indigo-50 text-indigo-600 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="mr-auto px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-md shadow-xs animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {/* Mock Notification Badge for specific items */}
                    {!item.badge && (item.label === "الطلبات" || item.label === "إدارة العملاء") && (
                      <span className="mr-auto w-5 h-5 flex items-center justify-center bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                        2
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-200 shrink-0 bg-white">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all mb-1"
        >
          <Home className="w-5 h-5 text-slate-400" />
          عرض الموقع
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all text-right"
        >
          <LogOut className="w-5 h-5 text-slate-400" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white text-slate-900 px-6 py-4 shrink-0 border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="h-8 px-1.5 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
            <img
              src="/logo-main.png"
              alt="منظومة"
              className="h-5 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/cdn/logo.png';
              }}
            />
          </div>
          <span className="font-[900] text-slate-900 text-base">منظومة ERP</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-72 bg-white md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 shrink-0 z-40">
        <SidebarContent />
      </aside>
    </>
  );
}
