import React, { useState } from "react";
import { useAdminStore } from "../store/adminStore";
import { Package, SiteConfig, Subscription } from "../store/adminStore";
import {
  Save,
  Plus,
  Settings,
  Edit2,
  CheckCircle2,
  UserCircle,
  Globe,
  Palette,
  Layout,
  CreditCard,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    config,
    packages,
    subscriptions,
    updateConfig,
    updatePackages,
    updateSubscriptions,
  } = useAdminStore();
  const [activeTab, setActiveTab] = useState<
    "content" | "packages" | "subscriptions"
  >("content");

  // Local state for editing
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [localPackages, setLocalPackages] = useState<Package[]>(packages);

  const handleSaveConfig = () => {
    updateConfig(() => localConfig);
    alert("تم حفظ إعدادات الموقع بنجاح");
  };

  const handleSavePackages = () => {
    updatePackages(localPackages);
    alert("تم حفظ إعدادات الباقات بنجاح");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-64 bg-slate-950 text-white p-6 z-50 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black">لوحة التحكم</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("content")}
            className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-3 ${activeTab === "content" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
          >
            <Globe className="w-5 h-5" /> هوية الموقع والنصوص
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-3 ${activeTab === "packages" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
          >
            <CreditCard className="w-5 h-5" /> إدارة الباقات
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-3 ${activeTab === "subscriptions" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
          >
            <UserCircle className="w-5 h-5" /> الاشتراكات
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="mr-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-950 mb-2">
                مرحباً بك في الإدارة
              </h1>
              <p className="text-slate-500 font-bold">
                تحكم في كل تفاصيل الموقع من مكان واحد.
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" /> عرض الموقع
            </a>
          </div>

          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Branding */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-500" /> الهوية المرئية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">
                      اسم الموقع
                    </label>
                    <input
                      type="text"
                      value={localConfig.siteName}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          siteName: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">
                      اللون الأساسي (Tailwind Color)
                    </label>
                    <select
                      value={localConfig.primaryColor}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="indigo">Indigo (أزرق غامق)</option>
                      <option value="blue">Blue (أزرق)</option>
                      <option value="teal">Teal (تركوازي)</option>
                      <option value="rose">Rose (وردي)</option>
                      <option value="emerald">Emerald (زمردي)</option>
                      <option value="violet">Violet (بنفسجي)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">
                      رابط الشعار العريض (Logo)
                    </label>
                    <input
                      type="text"
                      value={localConfig.logoUrl || ""}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          logoUrl: e.target.value,
                        })
                      }
                      placeholder="/logo.png أو رابط خارجي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                      dir="ltr"
                    />
                    {localConfig.logoUrl && (
                      <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-center">
                        <img
                          src={localConfig.logoUrl}
                          alt="Logo Preview"
                          className="h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">
                      رابط الأيقونة (Icon)
                    </label>
                    <input
                      type="text"
                      value={localConfig.iconUrl || ""}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          iconUrl: e.target.value,
                        })
                      }
                      placeholder="/icon.png أو رابط خارجي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                      dir="ltr"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      تُستخدم بجانب اسم الموقع وفي المتصفح.
                    </p>
                    {localConfig.iconUrl && (
                      <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-center">
                        <img
                          src={localConfig.iconUrl}
                          alt="Icon Preview"
                          className="h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">
                      رابط الخلفية (Pattern)
                    </label>
                    <input
                      type="text"
                      value={localConfig.patternUrl || ""}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          patternUrl: e.target.value,
                        })
                      }
                      placeholder="/pattern.png أو رابط خارجي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                      dir="ltr"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      خلفية شفافة تُستخدم في قسم Hero بدلاً من الخلفية
                      الافتراضية.
                    </p>
                    {localConfig.patternUrl && (
                      <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-center h-24 overflow-hidden relative">
                        <div
                          className="absolute inset-0 opacity-50"
                          style={{
                            backgroundImage: `url(${localConfig.patternUrl})`,
                            backgroundSize: "100px",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-500" /> النصوص
                  الافتتاحية (Hero)
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">
                        العنوان الرئيسي (السطر الأول)
                      </label>
                      <input
                        type="text"
                        value={localConfig.hero.titleLine1}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            hero: {
                              ...localConfig.hero,
                              titleLine1: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">
                        العنوان الرئيسي (السطر الثاني)
                      </label>
                      <input
                        type="text"
                        value={localConfig.hero.titleLine2}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            hero: {
                              ...localConfig.hero,
                              titleLine2: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">
                      النص الوصفي
                    </label>
                    <textarea
                      value={localConfig.hero.subtitle}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          hero: {
                            ...localConfig.hero,
                            subtitle: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">
                      نص زر الإجراء (CTA)
                    </label>
                    <input
                      type="text"
                      value={localConfig.hero.ctaText}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          hero: {
                            ...localConfig.hero,
                            ctaText: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Header Links */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-900 mb-6">
                  روابط القائمة العلوية
                </h2>
                <div className="space-y-4">
                  {localConfig.headerLinks.map((link, idx) => (
                    <div
                      key={link.id}
                      className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200"
                    >
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...localConfig.headerLinks];
                          newLinks[idx].label = e.target.value;
                          setLocalConfig({
                            ...localConfig,
                            headerLinks: newLinks,
                          });
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="العنوان"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...localConfig.headerLinks];
                          newLinks[idx].url = e.target.value;
                          setLocalConfig({
                            ...localConfig,
                            headerLinks: newLinks,
                          });
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="الرابط (URL)"
                        dir="ltr"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.isNew || false}
                          onChange={(e) => {
                            const newLinks = [...localConfig.headerLinks];
                            newLinks[idx].isNew = e.target.checked;
                            setLocalConfig({
                              ...localConfig,
                              headerLinks: newLinks,
                            });
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-bold text-slate-500">
                          علامة "جديد"
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveConfig}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-black shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] transition-all"
                >
                  حفظ إعدادات الموقع
                </button>
              </div>
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === "packages" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">
                  إدارة الباقات
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {localPackages.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 relative"
                  >
                    <div className="absolute top-8 left-8 flex gap-3">
                      <button
                        onClick={() => {
                          const newPkgs = [...localPackages];
                          newPkgs[idx].visible = !newPkgs[idx].visible;
                          setLocalPackages(newPkgs);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 ${pkg.visible ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {pkg.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                        {pkg.visible ? "مرئي" : "مخفي"}
                      </button>
                      <button
                        onClick={() => {
                          const newPkgs = [...localPackages];
                          newPkgs[idx].isPopular = !newPkgs[idx].isPopular;
                          setLocalPackages(newPkgs);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 ${pkg.isPopular ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        <Sparkles className="w-4 h-4" />{" "}
                        {pkg.isPopular ? "الأكثر طلباً" : "عادي"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                      <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">
                          اسم الباقة
                        </label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => {
                            const newPkgs = [...localPackages];
                            newPkgs[idx].name = e.target.value;
                            setLocalPackages(newPkgs);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">
                          الوصف
                        </label>
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) => {
                            const newPkgs = [...localPackages];
                            newPkgs[idx].description = e.target.value;
                            setLocalPackages(newPkgs);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">
                          السعر (الرقم)
                        </label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => {
                            const newPkgs = [...localPackages];
                            newPkgs[idx].price = e.target.value;
                            setLocalPackages(newPkgs);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">
                          لاحقة السعر (مثال: ر.س / شهرياً)
                        </label>
                        <input
                          type="text"
                          value={pkg.priceSuffix}
                          onChange={(e) => {
                            const newPkgs = [...localPackages];
                            newPkgs[idx].priceSuffix = e.target.value;
                            setLocalPackages(newPkgs);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-3">
                        المميزات (اكتب ميزة واضغط اضافة، أو أزل ميزة)
                      </label>
                      <div className="space-y-2 mb-3">
                        {pkg.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newPkgs = [...localPackages];
                                newPkgs[idx].features[fIdx] = e.target.value;
                                setLocalPackages(newPkgs);
                              }}
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => {
                                const newPkgs = [...localPackages];
                                newPkgs[idx].features.splice(fIdx, 1);
                                setLocalPackages(newPkgs);
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newPkgs = [...localPackages];
                          newPkgs[idx].features.push("ميزة جديدة");
                          setLocalPackages(newPkgs);
                        }}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit"
                      >
                        <Plus className="w-4 h-4" /> إضافة ميزة
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSavePackages}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-black shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] transition-all"
                >
                  حفظ الباقات
                </button>
              </div>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                الاشتراكات النشطة
              </h2>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">
                        رقم الاشتراك
                      </th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">
                        اسم المتجر / المالك
                      </th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">
                        الباقة
                      </th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">
                        الحالة
                      </th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">
                        تاريخ البدء
                      </th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500 uppercase">
                        إجراء
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscriptions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-sm text-slate-500">
                          {sub.id}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-black text-slate-900">
                            {sub.storeName}
                          </p>
                          <p className="text-xs font-bold text-slate-500">
                            {sub.ownerName}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {packages.find((p) => p.id === sub.packageId)?.name ||
                            "غير معروف"}
                        </td>
                        <td className="px-6 py-4">
                          {sub.status === "active" && (
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black">
                              نشط
                            </span>
                          )}
                          {sub.status === "trial" && (
                            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">
                              تجريبي
                            </span>
                          )}
                          {sub.status === "expired" && (
                            <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-black">
                              منتهي
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-500">
                          {sub.startDate}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <Edit2 className="w-4 h-4" /> تفاصيل
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sparkles icon import missing logic fallback
import { Sparkles } from "lucide-react";
