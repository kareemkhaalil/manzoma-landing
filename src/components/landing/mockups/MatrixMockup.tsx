import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Check, Barcode, Printer } from "lucide-react";

export default function MatrixMockup() {
  const [productName, setProductName] = useState("قميص أكسفورد كلاسيك");
  const [skuPrefix, setSkuPrefix] = useState("OXF-SHIRT");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["أحمر", "كحلي"]);
  const [variants, setVariants] = useState<Array<{ size: string; color: string; sku: string; barcode: string; price: number }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [barcodePrinted, setBarcodePrinted] = useState(false);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "أحمر", code: "RED", hex: "#EF4444" },
    { name: "كحلي", code: "NAVY", hex: "#1E3A8A" },
    { name: "أخضر", code: "GRN", hex: "#10B981" },
    { name: "أسود", code: "BLK", hex: "#111827" },
  ];

  const generateMatrix = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: typeof variants = [];
      selectedSizes.forEach((size) => {
        selectedColors.forEach((colorName) => {
          const colorObj = colors.find((c) => c.name === colorName);
          const colorCode = colorObj ? colorObj.code : "COL";
          const variantSku = `${skuPrefix}-${size}-${colorCode}`.toUpperCase();
          const variantBarcode = "8900" + Math.floor(1000 + Math.random() * 9000);
          generated.push({
            size,
            color: colorName,
            sku: variantSku,
            barcode: variantBarcode,
            price: 450,
          });
        });
      });
      setVariants(generated);
      setIsGenerating(false);
    }, 400);
  };

  useEffect(() => {
    generateMatrix();
  }, [selectedSizes, selectedColors, skuPrefix]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const printBarcodes = () => {
    setBarcodePrinted(true);
    setTimeout(() => setBarcodePrinted(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border shadow-xl relative select-none font-sans text-right min-h-[500px] flex flex-col"
         style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border)" }}
         dir="rtl">
      
      {/* Coder Header */}
      <header className="px-4 py-3 border-b flex items-center justify-between shrink-0"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-black" style={{ color: "var(--text-1)" }}>محرك التكويد الذكي (Matrix Engine)</span>
        </div>
        <div className="text-[9px] font-black px-2 py-0.5 rounded-full"
             style={{ backgroundColor: "var(--bg-elevated)", color: "var(--brand)" }}>
          مصفوفة التوليد الرياضي
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-h-[500px]">
        {/* Controls (Right/Top side) */}
        <div className="w-full md:w-80 border-l p-4 space-y-4 shrink-0 overflow-y-auto"
             style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          
          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black block mb-1" style={{ color: "var(--text-3)" }}>اسم الصنف الأساسي</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none"
                style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-1)" }}
              />
            </div>
            <div>
              <label className="text-[10px] font-black block mb-1" style={{ color: "var(--text-3)" }}>الرمز التعريفي (SKU Prefix)</label>
              <input
                type="text"
                value={skuPrefix}
                onChange={(e) => setSkuPrefix(e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none uppercase"
                style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-1)" }}
              />
            </div>
          </div>

          {/* Sizes Toggle */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black block" style={{ color: "var(--text-3)" }}>اختر المقاسات المتوفرة</span>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => {
                const isActive = selectedSizes.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className="px-3 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer"
                    style={{
                      backgroundColor: isActive ? "var(--brand)" : "var(--bg-elevated)",
                      borderColor: isActive ? "var(--brand)" : "var(--border)",
                      color: isActive ? "white" : "var(--text-2)"
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors Toggle */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black block" style={{ color: "var(--text-3)" }}>اختر الألوان المتوفرة</span>
            <div className="space-y-1">
              {colors.map((c) => {
                const isActive = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggleColor(c.name)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black border transition-all cursor-pointer"
                    style={{
                      backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                      borderColor: isActive ? "var(--brand)" : "var(--border)",
                      color: isActive ? "var(--brand)" : "var(--text-2)"
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm animate-pulse" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Matrix Result Table */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[500px]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black block" style={{ color: "var(--text-3)" }}>الاحتمالات المولدة آلياً</span>
              <span className="text-xs font-black" style={{ color: "var(--text-1)" }}>
                تم توليد {variants.length} صنف فرعي فريد
              </span>
            </div>
            <button
              onClick={printBarcodes}
              disabled={variants.length === 0}
              className="px-3 py-1.5 text-white rounded-xl text-[10px] font-black hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none shadow-sm transition-all cursor-pointer"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{barcodePrinted ? "تم طباعة الاستيكرات! ⚡" : "طباعة باركود الأصناف"}</span>
            </button>
          </div>

          <div className="rounded-xl border overflow-hidden shadow-sm"
               style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-[10px]">
                <thead>
                  <tr className="border-b text-center font-bold tracking-wider"
                      style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-3)" }}>
                    <th className="px-4 py-2.5 text-right font-black">اسم المنتج الفرعي</th>
                    <th className="px-3 py-2.5 font-black">الرمز الفريد SKU</th>
                    <th className="px-3 py-2.5 font-black">الباركود</th>
                    <th className="px-3 py-2.5 font-black">سعر التجزئة</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono" style={{ borderColor: "var(--border)" }}>
                  <AnimatePresence>
                    {variants.map((v, i) => (
                      <motion.tr
                        key={v.sku}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] text-center"
                        style={{ borderBottomColor: "var(--border)" }}
                      >
                        <td className="px-4 py-2 text-right font-sans font-black" style={{ color: "var(--text-1)" }}>
                          {productName} ({v.size} / {v.color})
                        </td>
                        <td className="px-3 py-2 font-bold uppercase select-all" style={{ color: "var(--text-2)" }}>
                          {v.sku}
                        </td>
                        <td className="px-3 py-2 flex items-center justify-center gap-1.5 font-bold" style={{ color: "var(--text-3)" }}>
                          <Barcode className="w-4 h-4 opacity-50 shrink-0" />
                          <span>{v.barcode}</span>
                        </td>
                        <td className="px-3 py-2 font-black" style={{ color: "var(--brand)" }}>
                          {v.price} EGP
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {variants.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center font-sans" style={{ color: "var(--text-3)" }}>
                        يرجى اختيار مقاس ولون واحد على الأقل لتوليد الاحتمالات.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
