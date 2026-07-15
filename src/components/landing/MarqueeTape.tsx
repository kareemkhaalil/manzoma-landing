import React from "react";
import { useAdminStore } from "../../store/adminStore";
import { translations } from "../../lib/translations";

export default function MarqueeTape() {
  const store = useAdminStore() || {};
  const config = store.config || {};
  const language = store.language || "ar";
  
  const langKey = language === "en" ? "en" : "ar";
  const t = translations[langKey] || translations["ar"];

  // Load items from store configuration (dashboard editable) or fallback to translation tapeItems
  const items = config?.marqueeItems && config.marqueeItems.length > 0
    ? config.marqueeItems
    : t.tapeItems || [];

  // Split items between Row 1 and Row 2 for variety
  const midPoint = Math.ceil(items.length / 2);
  let row1Items = items.slice(0, midPoint);
  let row2Items = items.slice(midPoint);

  // Fallbacks if arrays are empty
  if (row1Items.length === 0) row1Items = ["منظومة ERP"];
  if (row2Items.length === 0) row2Items = ["أسرع كاشير وأذكى فواتير"];

  // Ensure each track has enough elements (at least 8) to overflow the screen width, avoiding blank spaces on 4K/wide screens
  let row1 = [...row1Items];
  let row2 = [...row2Items];
  while (row1.length < 8) row1 = [...row1, ...row1Items];
  while (row2.length < 8) row2 = [...row2, ...row2Items];

  return (
    <div className="links-and-titles-slider-2-rows-section position-relative taps-with-rotate py-8 flex flex-col gap-6 overflow-hidden w-full relative z-20">
      
      {/* Row 1: Primary Tape - Slides Left */}
      <div className="marquee-row primary-tape-bg flex overflow-hidden relative w-full py-4" dir="ltr">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Track wrapper containing two identical tracks for flawless looping */}
        <div className="marquee-row__track-wrapper">
          {[1, 2].map((trackNum) => (
            <div
              key={`row1-track-${trackNum}`}
              className="marquee-row__track flex items-center shrink-0"
              aria-hidden={trackNum === 2}
              dir="rtl"
            >
              {row1.map((item, idx) => (
                <div key={`row1-item-${idx}`} className="flex items-center shrink-0 font-sans px-1">
                  <span className="marquee-item px-5 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm md:text-base font-black tracking-wide select-none shadow-sm hover:bg-white/20 transition-all text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Secondary Tape - Slides Right */}
      <div className="marquee-row secondary-tape-bg flex overflow-hidden relative w-full py-4" dir="ltr">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Track wrapper moving right */}
        <div className="marquee-row__track-wrapper marquee-row__track-wrapper--reverse">
          {[1, 2].map((trackNum) => (
            <div
              key={`row2-track-${trackNum}`}
              className="marquee-row__track flex items-center shrink-0"
              aria-hidden={trackNum === 2}
              dir="rtl"
            >
              {row2.map((item, idx) => (
                <div key={`row2-item-${idx}`} className="flex items-center shrink-0 font-sans px-1">
                  <span className="marquee-item px-5 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm md:text-base font-black tracking-wide select-none shadow-sm hover:bg-white/20 transition-all text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
