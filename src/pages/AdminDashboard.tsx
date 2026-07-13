import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import Overview from "../components/admin/Overview";
import LandingEditor from "../components/admin/LandingEditor";
import PackagesEditor from "../components/admin/PackagesEditor";
import AcademyEditor from "../components/admin/AcademyEditor";
import ClientsManager from "../components/admin/ClientsManager";
import SystemLogs from "../components/admin/SystemLogs";
import StatsPage from "../components/admin/StatsPage";
import SettingsPage from "../components/admin/SettingsPage";
import PagesEditor from "../components/admin/PagesEditor";
import AppearanceEditor from "../components/admin/AppearanceEditor";
import NavigationEditor from "../components/admin/NavigationEditor";
import AdminsEditor from "../components/admin/AdminsEditor";
import GlobalInvoices from "../components/admin/GlobalInvoices";
import SuperAdminPaymentMethods from "../components/admin/SuperAdminPaymentMethods";
import PaymentApprovals from "../components/admin/PaymentApprovals";
import { useAdminStore } from "../store/adminStore";

export default function AdminDashboard() {
  const { isAuthenticated } = useAdminStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white text-slate-900" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative scrollbar-hide">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scrollbar-hide">
          <div className="max-w-[1400px] mx-auto w-full pb-10">
            <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/landing" element={<LandingEditor />} />
            <Route path="/packages" element={<PackagesEditor />} />
            <Route path="/academy" element={<AcademyEditor />} />
            <Route path="/pages" element={<PagesEditor />} />
            <Route path="/navigation" element={<NavigationEditor />} />
            <Route path="/clients" element={<ClientsManager />} />
            <Route path="/invoices" element={<GlobalInvoices />} />
            <Route path="/logs" element={<SystemLogs />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/appearance" element={<AppearanceEditor />} />
            <Route path="/users" element={<AdminsEditor />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/payment-methods" element={<SuperAdminPaymentMethods />} />
            <Route path="/payment-approvals" element={<PaymentApprovals />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

