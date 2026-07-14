import React from "react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../store/adminStore";

export default function Footer() {
  const { config, language } = useAdminStore();

  // Dynamic pages for footer
  const footerPages = (config.pages || []).filter(
    (p) => p.isPublished && p.showInFooter
  ).sort((a, b) => a.order - b.order);

  return (
    <footer className="bg-white border-t border-brand-border/50 relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={config.iconUrl || "/cdn/logo.png"}
                alt={config.siteName}
                className="w-10 h-10 rounded-xl object-contain"
              />
              <span className="text-xl font-[900] text-brand-navy tracking-tight">
                {config.siteName}
              </span>
            </div>
            <p className="text-sm font-medium text-brand-muted leading-relaxed max-w-xs mb-6">
              أسرع كاشير وأذكى نظام إدارة مبيعات في مصر. يعمل بدون إنترنت ويرسل فواتيرك عبر الواتساب.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {config.socialLinks?.filter((social) => social.url?.trim()).map((social, idx) => {
                let iconPath = "";
                switch (social.platform.toLowerCase()) {
                  case "facebook": iconPath = "M24 4.56c-.88.39-1.83.65-2.83.77a4.93 4.93 0 002.17-2.72 9.86 9.86 0 01-3.13 1.2 4.92 4.92 0 00-8.38 4.48A13.94 13.94 0 011.67 3.15a4.93 4.93 0 001.52 6.57 4.9 4.9 0 01-2.23-.62v.06a4.93 4.93 0 003.95 4.83 4.93 4.93 0 01-2.22.08 4.93 4.93 0 004.6 3.42A9.87 9.87 0 010 19.54a13.93 13.93 0 007.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.01-.63A10 10 0 0024 4.56z"; break;
                  case "instagram": iconPath = "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"; break;
                  case "linkedin": iconPath = "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"; break;
                  default: iconPath = "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"; break;
                }

                return (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-muted hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={iconPath}/></svg>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {config.footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-[900] text-brand-navy mb-5 tracking-tight">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  if (!link.url?.trim()) {
                    return <li key={link.id}><span className="text-sm font-medium text-brand-muted/50 cursor-not-allowed" aria-disabled="true">{link.label}</span></li>;
                  }
                  // Check if link is internal link
                  const isInternal = link.url.startsWith("/");
                  return (
                    <li key={link.id}>
                      {isInternal ? (
                        <Link
                          to={link.url}
                          className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.url}
                          className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  );
                })}
                {idx === 2 && (
                  <li>
                    <Link
                      to="/docs"
                      className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors"
                    >
                      {language === "ar" ? "للمطورين (API)" : "Developers (API)"}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-border/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-bold text-brand-muted">
            © {new Date().getFullYear()} {config.siteName}. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            {footerPages.slice(0, 3).map((page) => (
              <Link
                key={page.id}
                to={`/page/${page.slug}`}
                className="text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
