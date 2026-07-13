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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../store/adminStore";

export default function AdminSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { config } = useAdminStore();

  const isActive = (path: string) => location.pathname === path;

  const navSections = [
    {
      title: "الرئيسية",
      items: [
        { href: "/admin", icon: LayoutDashboard, label: "لوحة التحكم" },
      ],
    },
    {
      title: "إدارة المحتوى",
      items: [
        { href: "/admin/landing", icon: Globe, label: "الصفحة الرئيسية" },
        { href: "/admin/packages", icon: Package, label: "الباقات والأسعار" },
        { href: "/admin/academy", icon: Play, label: "الأكاديمية" },
        { href: "/admin/pages", icon: FileText, label: "الصفحات" },
      ],
    },
    {
      title: "النظام والمالية",
      items: [
        { href: "/admin/subscriptions", icon: Users, label: "المشتركين" },
        { href: "/admin/stats", icon: TrendingUp, label: "الإحصائيات" },
        { href: "/admin/settings", icon: Settings, label: "الإعدادات العامة" },
      ],
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full admin-sidebar-bg border-l border-white/5" dir="rtl">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-7 border-b border-white/5 shrink-0">
        <Link to="/admin" className="flex items-center gap-3">
          <img
            src={config.iconUrl || "/cdn/logo.png"}
            alt={config.siteName}
            className="w-11 h-11 rounded-2xl object-contain bg-white/10 p-1.5"
          />
          <div>
            <p className="text-white font-[900] text-lg leading-tight">{config.siteName}</p>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-wider mt-0.5">
              Admin Portal
            </p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-white/40 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-7 px-4 space-y-8 scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="text-white/20 text-[10px] font-[900] uppercase tracking-[0.2em] px-4">
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
                    className={`flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                      active
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        : "text-white/45 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        active ? "text-white" : "text-white/30 group-hover:text-brand-primary-light"
                      }`}
                    />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="mr-auto w-1.5 h-1.5 bg-white rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-white/5 space-y-1.5 shrink-0 bg-white/[0.02]">
        <Link
          to="/"
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-[800] text-white/50 hover:bg-white/5 hover:text-white transition-all"
        >
          <Home className="w-[18px] h-[18px]" />
          عرض الموقع
        </Link>
        <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-[800] text-white/50 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-right">
          <LogOut className="w-[18px] h-[18px]" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between admin-sidebar-bg text-white px-6 py-4 shrink-0 border-b border-white/5 sticky top-0 z-30 shadow-xl">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img src={config.iconUrl || "/cdn/logo.png"} alt="" className="w-8 h-8 rounded-xl" />
          <span className="font-[900] text-white text-lg">{config.siteName}</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10"
        >
          <Menu className="w-5 h-5 text-brand-primary-light" />
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
              className="fixed inset-y-0 right-0 z-50 w-80 admin-sidebar-bg md:hidden"
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
