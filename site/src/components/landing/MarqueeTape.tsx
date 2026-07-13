import React from "react";
import { useAdminStore } from "../../store/adminStore";

export default function MarqueeTape() {
  const { config } = useAdminStore();
  const items = config.marqueeItems || [];

  if (items.length === 0) return null;

  // Double items for seamless loop
  const doubled = [...items, ...items];

  return (
    <section className="relative py-0 overflow-hidden z-20">
      {/* Row 1 — rotated -2deg, navy bg */}
      <div
        className="marquee-tape py-4 text-white relative"
        style={{
          backgroundColor: "#0D1B4A",
          transform: "rotate(-2deg) scale(1.05)",
          marginTop: "-16px",
          marginBottom: "-8px",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url(${config.patternUrl})`,
            backgroundSize: "200px",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="marquee-tape__track relative z-10">
          {doubled.map((item, idx) => (
            <React.Fragment key={`r1-${idx}`}>
              <span className="marquee-tape__item">{item}</span>
              <span className="marquee-tape__separator" />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Row 2 — rotated +2deg, blue bg */}
      <div
        className="marquee-tape py-4 text-white relative"
        style={{
          backgroundColor: "#3B5BFF",
          transform: "rotate(2deg) scale(1.05)",
          marginTop: "-8px",
          marginBottom: "-16px",
        }}
      >
        <div className="marquee-tape__track marquee-tape__track--reverse relative z-10">
          {doubled.map((item, idx) => (
            <React.Fragment key={`r2-${idx}`}>
              <span className="marquee-tape__item">{item}</span>
              <span className="marquee-tape__separator" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
