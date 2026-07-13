import React from "react";
import { useAdminStore } from "../../store/adminStore";
import { Tag } from "lucide-react";

export default function FloatingSideBadge() {
  const { config } = useAdminStore();
  const badge = config.sideBadge;

  if (!badge || !badge.enabled) return null;

  return (
    <div 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] group cursor-pointer"
      onClick={() => window.location.href = '#pricing'}
    >
      <div 
        className="flex items-center gap-2 px-4 py-2 text-white font-[900] text-sm tracking-widest shadow-brand-glow hover:pr-6 transition-all duration-300 origin-bottom-left"
        style={{ 
          backgroundColor: badge.backgroundColor,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        <Tag className="w-4 h-4 rotate-90 opacity-80" />
        {badge.text}
      </div>
    </div>
  );
}
