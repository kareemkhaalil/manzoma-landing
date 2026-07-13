import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Code, Key, Box, ShoppingCart, Users, Zap, Terminal } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";

export default function DocsPage() {
  const { language } = useAdminStore();
  const t = translations[language];
  const isAr = language === "ar";
  const [activeSection, setActiveSection] = useState("quickstart");

  useSEO({
    title: `${t.docsTitle} | Manzoma`,
    description: t.docsSubtitle,
    keywords: "api, documentation, developers, manzoma, integration, rest api",
  });

  const sidebarLinks = [
    { id: "quickstart", label: isAr ? "البدء السريع" : "Quickstart", icon: Zap },
    { id: "auth", label: isAr ? "المصادقة (Auth)" : "Authentication", icon: Key },
    { id: "products", label: isAr ? "الأصناف (Products)" : "Products API", icon: Box },
    { id: "orders", label: isAr ? "الطلبات (Orders)" : "Orders API", icon: ShoppingCart },
    { id: "customers", label: isAr ? "العملاء (Customers)" : "Customers API", icon: Users }
  ];

  const codeSnippets = {
    auth: `// Node.js Example: Authentication
const response = await fetch('https://api.manzoma.online/v1/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = await response.json();
console.log(data.token);`,
    products: `// Python Example: Fetch Products
import requests

url = "https://api.manzoma.online/v1/products"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

response = requests.get(url, headers=headers)
print(response.json())`
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <main className="w-full max-w-7xl mx-auto flex-grow flex flex-col lg:flex-row pt-20">
        
        {/* Sidebar */}
        <aside className={`lg:w-64 shrink-0 border-${isAr ? 'l' : 'r'} p-6 overflow-y-auto hidden lg:block`} style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
          <div className="space-y-6 sticky top-24">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: "var(--text-3)" }}>
                {isAr ? "دليل المطورين" : "Developer Guide"}
              </h4>
              {sidebarLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setActiveSection(link.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeSection === link.id ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
                  style={{ color: activeSection === link.id ? "" : "var(--text-2)" }}
                >
                  <link.icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Nav Select */}
        <div className="lg:hidden p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <select 
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full h-11 px-4 rounded-xl text-xs font-bold bg-transparent border focus:outline-none"
            style={{ borderColor: "var(--border)", color: "var(--text-1)" }}
          >
            {sidebarLinks.map(link => (
              <option key={link.id} value={link.id}>{link.label}</option>
            ))}
          </select>
        </div>

        {/* Content Area */}
        <section className="flex-grow p-6 lg:p-12 space-y-10 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black" style={{ color: "var(--text-1)" }}>
              {t.docsTitle}
            </h1>
            <p className="text-sm sm:text-base font-medium leading-relaxed" style={{ color: "var(--text-2)" }}>
              {t.docsSubtitle}
            </p>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert">
            {activeSection === "quickstart" && (
              <div className="space-y-6">
                <h2 className="text-xl font-black" style={{ color: "var(--text-1)" }}>{isAr ? "مرحباً بك في API منظومة" : "Welcome to Manzoma API"}</h2>
                <p style={{ color: "var(--text-2)" }}>
                  {isAr 
                    ? "يتيح لك الـ API الخاص بنا ربط المتاجر الإلكترونية، تطبيقات التوصيل، وبرامج الـ ERP الخاصة بك بكل سهولة." 
                    : "Our REST API enables you to connect e-commerce platforms, delivery apps, and custom ERP systems easily."}
                </p>
                <div className="p-4 rounded-xl border flex items-start gap-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <Terminal className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold" style={{ color: "var(--text-1)" }}>Base URL</h4>
                    <code className="text-xs font-mono px-2 py-1 rounded bg-black/5 dark:bg-white/5" style={{ color: "var(--brand)" }}>
                      https://api.manzoma.online/v1
                    </code>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "auth" && (
              <div className="space-y-6">
                <h2 className="text-xl font-black" style={{ color: "var(--text-1)" }}>{isAr ? "المصادقة باستخدام API Key" : "Authentication using API Key"}</h2>
                <p style={{ color: "var(--text-2)" }}>
                  {isAr 
                    ? "يجب إرسال مفتاح الـ API في كل طلب (Request) في الـ Header (Authorization: Bearer)." 
                    : "You must send your API key with every request in the Authorization header."}
                </p>
                
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                  <div className="px-4 py-2 border-b flex items-center gap-2" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                    <Code className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-mono text-slate-500">auth.js</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono bg-[#0f172a] text-slate-300 m-0" dir="ltr">
                    {codeSnippets.auth}
                  </pre>
                </div>
              </div>
            )}

            {activeSection === "products" && (
              <div className="space-y-6">
                <h2 className="text-xl font-black" style={{ color: "var(--text-1)" }}>{isAr ? "استرجاع الأصناف والمخزون" : "Fetching Products & Inventory"}</h2>
                <p style={{ color: "var(--text-2)" }}>
                  {isAr 
                    ? "استخدم هذا الـ Endpoint للحصول على المنتجات، الألوان، والمقاسات." 
                    : "Use this endpoint to retrieve products, colors, and sizes."}
                </p>
                
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                  <div className="px-4 py-2 border-b flex items-center gap-2" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                    <Code className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-mono text-slate-500">products.py</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono bg-[#0f172a] text-slate-300 m-0" dir="ltr">
                    {codeSnippets.products}
                  </pre>
                </div>
              </div>
            )}

            {(activeSection === "orders" || activeSection === "customers") && (
              <div className="text-center py-20 space-y-4">
                <Box className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                <h2 className="text-xl font-black" style={{ color: "var(--text-1)" }}>
                  {isAr ? "قريباً (Coming Soon)" : "Coming Soon"}
                </h2>
                <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                  {isAr ? "جاري توثيق هذه النقاط البرمجية." : "We are currently documenting these endpoints."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
