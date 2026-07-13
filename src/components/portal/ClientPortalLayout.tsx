import React from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, CreditCard, LayoutDashboard } from 'lucide-react';

export default function ClientPortalLayout() {
  const token = localStorage.getItem('manzoma_client_token');
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('manzoma_client_token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-l border-slate-200 shrink-0">
        <div className="p-6 border-b border-slate-200">
          <Link to="/" className="text-xl font-bold text-indigo-600">منظومة</Link>
          <p className="text-xs text-slate-500 mt-1">بوابة العملاء</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link 
            to="/account" 
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/account') ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            نظرة عامة
          </Link>
          <Link 
            to="/account/subscription" 
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/account/subscription') ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <CreditCard className="w-5 h-5" />
            الاشتراك والدفع
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-right text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
