import React from "react";
import { useAdminStore } from "../../store/adminStore";

export default function PartnersBar() {
  const { config } = useAdminStore();
  const partners = config.partners;
  if (!partners.length) return null;

  // Duplicate for infinite scroll effect
  const doubled = [...partners, ...partners];

  return (
    <section className="py-14 md:py-16 bg-brand-bg border-y border-brand-border/30 overflow-hidden relative z-10">
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <p className="text-center text-xs font-[800] text-brand-muted uppercase tracking-[0.2em]">
          موثوق من قبل شركائنا
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-scroll-partners" style={{ width: "max-content" }}>
          {doubled.map((partner, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center"
            >
              <span className="text-lg md:text-xl font-[900] text-brand-navy/20 whitespace-nowrap tracking-tight select-none">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
