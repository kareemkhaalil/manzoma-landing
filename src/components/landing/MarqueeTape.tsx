import React from "react";

export default function MarqueeTape() {
  const row1Items = [
    "نظام كاشير هجين يعمل بدون إنترنت",
    "فواتير إلكترونية فورية مرسلة عبر الواتساب",
    "تأمين الخزينة وحمايتها عبر نظام العد الأعمى",
    "بيع المقاسات والألوان المختلفة بضغطة واحدة",
    "مزامنة سحابية لحظية لجميع الفروع",
    "تتبع استهلاك الخامات وتكلفة الإنتاج تلقائياً",
    "تقارير محاسبية مبسطة وجرد سريع لمنع العجز"
  ];

  const row2Items = [
    "لوحة تحكم سهلة لإدارة المبيعات والتجزئة",
    "إغلاق الورديات ومطابقة الحسابات بدقة",
    "دعم كامل لأجهزة الباركود والموازين الإلكترونية",
    "تنبيهات ذكية للنواقص وكميات المخزون الحرجة",
    "متوافق مع معايير مصلحة الضرائب المصرية",
    "تقارير الأرباح وتحليلات الأداء اللحظية",
    "إدارة الموظفين والصلاحيات المتعددة للفروع"
  ];

  const separator = (
    <div className="tape-separator-icon mx-6 shrink-0 inline-flex items-center justify-center">
      <svg width="24px" height="24px" className="text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.53 11.23l-5.18 3.59c-.76.53-1.2.22-.98-.67l.95-3.84-1.65-.41c-.75-.18-.84-.7-.21-1.14l5.18-3.59c.76-.53 1.2-.22.98.67l-.95 3.84 1.65.41c.75.19.84.7.21 1.14z"></path>
      </svg>
    </div>
  );

  return (
    <div className="links-and-titles-slider-2-rows-section position-relative taps-with-rotate py-16 flex flex-col gap-6 overflow-hidden w-full relative z-20">
      
      {/* Row 1: Primary Tape - Slides Left */}
      <div className="marquee-row primary-tape-bg flex overflow-hidden relative w-full" dir="ltr">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Track wrapper containing two identical tracks for flawless looping */}
        <div className="marquee-row__track-wrapper animate-marquee-slow">
          {[1, 2].map((trackNum) => (
            <div
              key={`row1-track-${trackNum}`}
              className="marquee-row__track flex items-center shrink-0"
              aria-hidden={trackNum === 2}
              dir="rtl"
            >
              {row1Items.map((item, idx) => (
                <div key={`row1-item-${idx}`} className="flex items-center shrink-0 font-sans">
                  <span className="marquee-item text-white text-lg md:text-xl font-black tracking-wide select-none">
                    {item}
                  </span>
                  {separator}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Secondary Tape - Slides Right */}
      <div className="marquee-row secondary-tape-bg flex overflow-hidden relative w-full" dir="ltr">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Track wrapper moving right */}
        <div className="marquee-row__track-wrapper marquee-row__track-wrapper--reverse animate-marquee-slow">
          {[1, 2].map((trackNum) => (
            <div
              key={`row2-track-${trackNum}`}
              className="marquee-row__track flex items-center shrink-0"
              aria-hidden={trackNum === 2}
              dir="rtl"
            >
              {row2Items.map((item, idx) => (
                <div key={`row2-item-${idx}`} className="flex items-center shrink-0 font-sans">
                  <span className="marquee-item text-white text-lg md:text-xl font-black tracking-wide select-none">
                    {item}
                  </span>
                  {separator}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
