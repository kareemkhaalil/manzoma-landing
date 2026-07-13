import React, { useState } from "react";
import { useAdminStore, AdminUser } from "../../store/adminStore";
import { Save, Plus, Trash2, Users, ShieldAlert, Key } from "lucide-react";

export default function AdminsEditor() {
  const { adminUsers, addAdmin, removeAdmin, updateAdmin, currentUser } = useAdminStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState<Partial<AdminUser>>({ role: "admin", name: "", email: "", password: "" });

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;
    
    addAdmin({
      id: `admin-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role as "admin" | "super_admin"
    });
    setNewUser({ role: "admin", name: "", email: "", password: "" });
    setShowAddForm(false);
  };

  const Card = ({ title, icon: Icon, children, action }: any) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-7 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-7 space-y-5">{children}</div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المديرين والمستخدمين</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">التحكم في صلاحيات الوصول للوحة التحكم</p>
        </div>
        {currentUser?.role === "super_admin" && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-7 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" /> إضافة مدير جديد
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="المديرين الحاليين" icon={Users}>
            <div className="space-y-3">
              {adminUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-slate-50/30 border border-slate-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-indigo-600">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {user.name}
                        {user.id === currentUser?.id && (
                          <span className="text-[10px] bg-indigo-600 text-indigo-600 px-2 py-0.5 rounded-full">أنت</span>
                        )}
                        {user.role === "super_admin" && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> مدير عام
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 mt-1" dir="ltr">{user.email}</p>
                    </div>
                  </div>
                  
                  {currentUser?.role === "super_admin" && user.id !== currentUser.id && (
                    <button
                      onClick={() => removeAdmin(user.id)}
                      className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف المدير"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Add User Form - Only visible if super_admin */}
        {showAddForm && currentUser?.role === "super_admin" && (
          <div className="lg:col-span-1">
            <Card title="تفاصيل المدير الجديد" icon={Key}>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 px-1">اسم المدير</label>
                  <input
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 px-1">البريد الإلكتروني</label>
                  <input
                    required
                    type="email"
                    dir="ltr"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-brand-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 px-1">كلمة المرور</label>
                  <input
                    required
                    type="text"
                    dir="ltr"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 px-1">الصلاحية</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-primary outline-none transition-all"
                  >
                    <option value="admin">مدير (إدارة المحتوى والإعدادات)</option>
                    <option value="super_admin">مدير عام (إدارة النظام والمستخدمين)</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-brand-navy text-white font-bold text-sm py-3 rounded-xl hover:bg-brand-navy/90 transition-colors mt-2"
                >
                  حفظ المستخدم
                </button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
