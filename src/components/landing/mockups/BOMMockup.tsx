import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Factory, Play, RefreshCw } from "lucide-react";

export default function BOMMockup() {
  const [completedShirts, setCompletedShirts] = useState(0);
  const [materials, setMaterials] = useState([
    { id: "m1", name: "قماش قطن تركي فاخر", qty: 20, unit: "متر", requiredPerUnit: 1.5, costPerQty: 80 },
    { id: "m2", name: "أزرار بلاستيك سوداء", qty: 120, unit: "قطعة", requiredPerUnit: 6, costPerQty: 2 },
    { id: "m3", name: "بكرة خيط خياطة متين", qty: 2, unit: "بكرة", requiredPerUnit: 0.1, costPerQty: 15 },
  ]);

  const costOfUnit = materials.reduce((sum, m) => sum + m.requiredPerUnit * m.costPerQty, 0); // 133.5 EGP

  const handleProduceOne = () => {
    let canProduce = true;
    materials.forEach((m) => {
      if (m.qty < m.requiredPerUnit) {
        canProduce = false;
      }
    });

    if (!canProduce) {
      alert("عفواً، المخزون الحالي للمواد الخام لا يكفي لإنتاج المزيد!");
      return;
    }

    setMaterials((prev) =>
      prev.map((m) => ({
        ...m,
        qty: Number((m.qty - m.requiredPerUnit).toFixed(2)),
      }))
    );

    setCompletedShirts((prev) => prev + 1);
  };

  const handleRestock = () => {
    setCompletedShirts(0);
    setMaterials([
      { id: "m1", name: "قماش قطن تركي فاخر", qty: 20, unit: "متر", requiredPerUnit: 1.5, costPerQty: 80 },
      { id: "m2", name: "أزرار بلاستيك سوداء", qty: 120, unit: "قطعة", requiredPerUnit: 6, costPerQty: 2 },
      { id: "m3", name: "بكرة خيط خياطة متين", qty: 2, unit: "بكرة", requiredPerUnit: 0.1, costPerQty: 15 },
    ]);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border shadow-xl relative select-none font-sans text-right min-h-[500px] flex flex-col"
         style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border)" }}
         dir="rtl">
      
      {/* BOM Header */}
      <header className="px-4 py-3 border-b flex items-center justify-between shrink-0"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Factory className="w-4 h-4" />
          </div>
          <span className="text-xs font-black" style={{ color: "var(--text-1)" }}>إدارة التصنيع وقائمة المواد (BOM & Ledger)</span>
        </div>
        <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
             style={{ backgroundColor: "var(--bg-elevated)", color: "var(--brand)" }}>
          استهلاك تلقائي للخامات
        </span>
      </header>

      {/* Main Grid split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-h-[500px]">
        {/* Finished Product Section (Right) */}
        <div className="w-full md:w-80 border-l p-4 flex flex-col justify-between shrink-0"
             style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black block mb-1" style={{ color: "var(--text-3)" }}>المنتج التام المراد تصنيعه</span>
              <div className="p-3 border rounded-xl flex items-center gap-3"
                   style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                <span className="text-2xl">👔</span>
                <div>
                  <h4 className="text-xs font-black" style={{ color: "var(--text-1)" }}>قميص رجالي كلاسيك</h4>
                  <span className="text-[10px] font-bold" style={{ color: "var(--text-3)" }}>تكلفة الإنتاج للقطعة: {costOfUnit} ج.م</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-xl text-center animate-pulse"
                 style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-strong)" }}>
              <span className="text-[9px] font-black block mb-1" style={{ color: "var(--brand)" }}>عدد القطع المصنعة حالياً</span>
              <span className="text-3xl font-black" style={{ color: "var(--brand)" }}>{completedShirts}</span>
              <span className="text-[9px] block mt-1" style={{ color: "var(--text-2)" }}>إجمالي التكلفة: {completedShirts * costOfUnit} ج.م</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={handleProduceOne}
              className="w-full h-11 text-white rounded-xl font-black text-xs hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: "var(--brand)", boxShadow: "0 10px 20px -5px rgba(37,99,235,0.2)" }}
            >
              <Play className="w-4 h-4 ml-1" />
              <span>بدء تصنيع قطعة واحدة</span>
            </button>
            <button
              onClick={handleRestock}
              className="w-full h-9 border rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-2)" }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تصفير وإعادة تعبئة الخام</span>
            </button>
          </div>
        </div>

        {/* Raw Materials Inventory (Left) */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[500px]">
          <div>
            <span className="text-[10px] font-black block uppercase tracking-wider" style={{ color: "var(--text-3)" }}>مستودع الخامات والمواد الأولية</span>
            <span className="text-xs font-black" style={{ color: "var(--text-1)" }}>يتناقص رصيد المخزون فورياً عند كل عملية تصنيع</span>
          </div>

          <div className="space-y-2.5">
            {materials.map((m) => {
              const depletionPercent = (m.qty / (m.id === "m1" ? 20 : m.id === "m2" ? 120 : 2)) * 100;
              return (
                <div key={m.id} className="p-4 rounded-xl border shadow-sm space-y-2"
                     style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-black" style={{ color: "var(--text-1)" }}>{m.name}</span>
                      <span className="text-[9px] font-bold block mt-0.5" style={{ color: "var(--text-3)" }}>معدل الاستهلاك: {m.requiredPerUnit} {m.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black" style={{ color: "var(--text-2)" }}>
                        {m.qty} {m.unit}
                      </span>
                      <span className="text-[9px] font-bold block mt-0.5" style={{ color: "var(--text-3)" }}>تكلفة الوحدة: {m.costPerQty} ج.م</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: `${depletionPercent}%` }}
                      transition={{ duration: 0.4 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: depletionPercent < 25 ? "#EF4444" : depletionPercent < 50 ? "#F59E0B" : "var(--brand)"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
