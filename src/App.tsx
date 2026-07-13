import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { useAdminStore } from "./store/adminStore";
import FloatingWhatsApp from "./components/landing/FloatingWhatsApp";

const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const DynamicPage = React.lazy(() => import("./pages/DynamicPage"));
const AcademyPage = React.lazy(() => import("./pages/AcademyPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const BlogPostPage = React.lazy(() => import("./pages/BlogPostPage"));
const IntegrationPage = React.lazy(() => import("./pages/IntegrationPage"));
const DocsPage = React.lazy(() => import("./pages/DocsPage"));
const ClientLogin = React.lazy(() => import("./pages/ClientLogin"));
const ClientPortalLayout = React.lazy(() => import("./components/portal/ClientPortalLayout"));
const AccountOverview = React.lazy(() => import("./pages/AccountOverview"));
const AccountSubscription = React.lazy(() => import("./pages/AccountSubscription"));

function RouteLoader() {
  return <div className="min-h-screen grid place-items-center text-sm font-bold text-slate-500">Loading…</div>;
}

function NotFoundPage() {
  const { language } = useAdminStore();
  const isAr = language === "ar";
  return (
    <main className="min-h-screen grid place-items-center px-6 text-center" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#0D0C14]">
        <p className="text-sm font-black tracking-[0.25em] text-indigo-600">404</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{isAr ? "الصفحة غير موجودة" : "Page not found"}</h1>
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-300">{isAr ? "الرابط غير صحيح أو أن الصفحة نُقلت." : "This link is incorrect or the page has moved."}</p>
        <a href="/" className="mt-7 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-500">{isAr ? "العودة للرئيسية" : "Back to home"}</a>
      </div>
    </main>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/integration" element={<IntegrationPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/page/:slug" element={<DynamicPage />} />

        {/* Client Portal */}
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/account" element={<ClientPortalLayout />}>
          <Route index element={<AccountOverview />} />
          <Route path="subscription" element={<AccountSubscription />} />
        </Route>

        {/* Admin (SuperAdmin only) */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      {!isAdminRoute && <FloatingWhatsApp />}
    </>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      // Scroll to top when switching pages without a hash
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { config, initializeCMSData, theme } = useAdminStore();

  useEffect(() => {
    initializeCMSData();
  }, []);

  useEffect(() => {
    // Favicon
    const iconToUse = config.iconUrl || "/icon.png";
    if (iconToUse) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = iconToUse;
    }

    // Keep the CDN pattern available to every public template. Pages use this
    // CSS variable instead of embedding a separate, non-editable background.
    const pattern = config.patternUrl || "/cdn/patternBlue.png";
    document.documentElement.style.setProperty("--brand-pattern-url", `url("${pattern}")`);

    // 🛡️ Security: Disable console methods in production to prevent injection
    if (import.meta.env.PROD) {
      const noop = () => {};
      const warn = console.warn;
      Object.defineProperty(window, 'console', {
        value: { ...console, log: noop, debug: noop, info: noop, warn, error: console.error },
        writable: false,
        configurable: false
      });
    }
  }, [config.iconUrl, config.patternUrl]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Router>
      <ScrollToHash />
      <AppContent />
    </Router>
  );
}
