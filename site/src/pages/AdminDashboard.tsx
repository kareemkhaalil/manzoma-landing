import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Overview from "../components/admin/Overview";
import LandingEditor from "../components/admin/LandingEditor";
import PackagesEditor from "../components/admin/PackagesEditor";
import AcademyEditor from "../components/admin/AcademyEditor";
import SubscriptionsList from "../components/admin/SubscriptionsList";
import StatsPage from "../components/admin/StatsPage";
import SettingsPage from "../components/admin/SettingsPage";
import PagesEditor from "../components/admin/PagesEditor";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-brand-bg" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative scrollbar-hide">
        {/* Accent gradient */}
        <div className="absolute top-0 right-0 w-full h-80 bg-gradient-to-b from-brand-navy/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/landing" element={<LandingEditor />} />
            <Route path="/packages" element={<PackagesEditor />} />
            <Route path="/academy" element={<AcademyEditor />} />
            <Route path="/pages" element={<PagesEditor />} />
            <Route path="/subscriptions" element={<SubscriptionsList />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
