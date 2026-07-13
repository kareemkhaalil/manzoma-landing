import React from "react";
import { MessageCircle } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";
import { translations } from "../../lib/translations";

export default function FloatingWhatsApp() {
  const { config, language } = useAdminStore();
  const t = translations[language];
  
  // Safeguard: fallback to the new number if the store has the old default placeholder
  const rawNumber = config.whatsappNumber === "201001234567" ? "201099600048" : (config.whatsappNumber || "201099600048");

  // Format number for WhatsApp link
  const formattedNumber = rawNumber.replace(/\D/g, '');
  const waLink = `https://wa.me/${formattedNumber}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 left-6 md:bottom-6 md:right-6 md:left-auto z-[90] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-300 group"
      aria-label={t.floatingSupport}
    >
      <MessageCircle className="w-7 h-7" />
      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75" style={{ animationDuration: '2s' }} />
      
      {/* Tooltip */}
      <span className="absolute left-full ml-4 md:left-auto md:right-full md:mr-4 bg-white text-brand-navy px-3 py-1.5 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {t.floatingSupport}
      </span>
    </a>
  );
}
