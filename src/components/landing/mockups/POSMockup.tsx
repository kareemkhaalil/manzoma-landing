import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Tag,
  Wifi,
  WifiOff,
  Printer,
  ChevronRight,
  User,
  CreditCard,
  DollarSign,
  Smartphone,
  CheckCircle,
  X
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POSMockup() {
  const [cart, setCart] = useState<CartItem[]>([
    { id: "v1", name: "قميص صوف كلاسيك (L / أزرق)", price: 450, quantity: 1 }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"pos" | "payment" | "receipt">("pos");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "visa" | "instapay">("cash");
  const [showReceiptAnim, setShowReceiptAnim] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("MNZM-92301");

  const products = [
    { id: "v1", name: "قميص صوف كلاسيك (L / أزرق)", price: 450, stock: 12, category: "shirts" },
    { id: "v2", name: "بنطلون جينز كاجوال (32 / رمادي)", price: 600, stock: 8, category: "pants" },
    { id: "v3", name: "جاكيت جلد طبيعي (XL / أسود)", price: 1200, stock: 4, category: "jackets" },
    { id: "v4", name: "تيشيرت رياضي قطن (M / أبيض)", price: 250, stock: 25, category: "shirts" },
    { id: "v5", name: "حذاء ركض خفيف (43 / كحلي)", price: 800, stock: 15, category: "shoes" },
    { id: "v6", name: "سويت شيرت شتوي (L / زيتي)", price: 550, stock: 10, category: "shirts" },
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Computations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountVal = discountApplied ? subtotal * 0.1 : 0; // 10% discount
  const vat = (subtotal - discountVal) * 0.14; // 14% VAT
  const total = subtotal - discountVal + vat;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep("payment");
  };

  const completePayment = () => {
    setCheckoutStep("receipt");
    setReceiptNumber("MNZM-" + Math.floor(10000 + Math.random() * 90000));
    setShowReceiptAnim(true);
  };

  const resetPOS = () => {
    setCart([]);
    setDiscountApplied(false);
    setCheckoutStep("pos");
    setShowReceiptAnim(false);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border shadow-xl relative select-none font-sans text-right min-h-[500px] flex flex-col"
         style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border)" }}
         dir="rtl">
      
      {/* POS Header */}
      <header className="px-4 py-3 border-b flex items-center justify-between shrink-0"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
               style={{ backgroundColor: "var(--brand)" }}>
            K
          </div>
          <span className="text-xs font-black" style={{ color: "var(--text-1)" }}>منظومة كاشير POS</span>
        </div>

        {/* Offline Mode Indicator Switch */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
            isOffline
              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
              : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>أوفلاين (SQLite محلي)</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              <span>أونلاين (مزامنة سحابية نشطة)</span>
            </>
          )}
        </button>
      </header>

      {/* Workspace Panel */}
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {checkoutStep === "pos" && (
            <motion.div
              key="pos"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex"
            >
              {/* Product Catalog Grid */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[500px]">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم أو الباركود..."
                    className="w-full border rounded-xl pr-10 pl-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-600/5 transition-all text-right"
                    style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-strong)", color: "var(--text-1)" }}
                  />
                </div>

                {/* Catalog list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleAddToCart(p)}
                      className="p-3 rounded-xl border shadow-sm transition-all cursor-pointer text-center group"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--brand)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    >
                      <div className="w-9 h-9 rounded-lg font-black text-xs flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform"
                           style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-3)" }}>
                        👕
                      </div>
                      <div className="text-[10px] font-black truncate mb-1" style={{ color: "var(--text-1)" }}>
                        {p.name}
                      </div>
                      <div className="text-xs font-black" style={{ color: "var(--brand)" }}>
                        {p.price} ج.م
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Panel (Right side) */}
              <div className="w-64 sm:w-72 border-r p-4 flex flex-col justify-between shrink-0"
                   style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between pb-3 border-b mb-3 shrink-0"
                       style={{ borderColor: "var(--border)" }}>
                    <span className="text-[10px] font-black" style={{ color: "var(--text-3)" }}>فاتورة البيع</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "var(--bg-elevated)", color: "var(--brand)" }}>
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} قطع
                    </span>
                  </div>

                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 custom-scrollbar min-h-[160px]">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-1">
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-black truncate leading-tight" style={{ color: "var(--text-1)" }}>
                            {item.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <button
                              onClick={() => handleUpdateQty(item.id, -1)}
                              className="w-4.5 h-4.5 rounded flex items-center justify-center cursor-pointer hover:opacity-80"
                              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-2)" }}
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[10px] font-black w-4 text-center" style={{ color: "var(--text-1)" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.id, 1)}
                              className="w-4.5 h-4.5 rounded flex items-center justify-center cursor-pointer hover:opacity-80"
                              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-2)" }}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] font-black" style={{ color: "var(--text-1)" }}>
                            {item.price * item.quantity} ج.م
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-[8px] font-black text-rose-500 hover:underline mt-1 cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                    {cart.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2 py-8">
                        <ShoppingCart className="w-6 h-6 text-slate-300" />
                        <span className="text-[9px] font-black text-slate-300">السلة فارغة</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Computation / Checkout area */}
                <div className="border-t pt-3 mt-3 space-y-2 shrink-0"
                     style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center text-[9px] font-black" style={{ color: "var(--text-2)" }}>
                    <span>المجموع قبل الخصم</span>
                    <span style={{ color: "var(--text-1)" }}>{subtotal} ج.م</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between items-center text-[9px] font-black px-1.5 py-0.5 rounded"
                         style={{ backgroundColor: "var(--bg-elevated)", color: "var(--brand)" }}>
                      <span>خصم العرض (10%)</span>
                      <span>-{discountVal} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[9px] font-black" style={{ color: "var(--text-2)" }}>
                    <span>الضريبة (14%)</span>
                    <span style={{ color: "var(--text-1)" }}>{Math.round(vat)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t"
                       style={{ borderColor: "var(--border)" }}>
                    <span className="text-[10px] font-black" style={{ color: "var(--text-1)" }}>الإجمالي النهائي</span>
                    <span className="text-sm font-black" style={{ color: "var(--brand)" }}>{Math.round(total)} ج.م</span>
                  </div>

                  <div className="flex gap-1.5 pt-2">
                    <button
                      onClick={() => setDiscountApplied(!discountApplied)}
                      className={`flex-1 h-9 rounded-lg border border-dashed flex items-center justify-center text-[9px] font-black transition-all cursor-pointer`}
                      style={{
                        backgroundColor: discountApplied ? "var(--bg-elevated)" : "transparent",
                        borderColor: discountApplied ? "var(--brand)" : "var(--border-strong)",
                        color: discountApplied ? "var(--brand)" : "var(--text-2)"
                      }}
                    >
                      <Tag className="w-3 h-3 ml-1" />
                      {discountApplied ? "إزالة الخصم" : "تطبيق خصم 10%"}
                    </button>

                    <button
                      onClick={triggerCheckout}
                      disabled={cart.length === 0}
                      className="flex-1 h-9 text-white rounded-lg flex items-center justify-center text-[10px] font-black hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md cursor-pointer"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      إتمام الدفع
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {checkoutStep === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex flex-col items-center justify-center p-6 space-y-5"
            >
              <div className="max-w-md w-full p-6 rounded-2xl border shadow-md space-y-4"
                   style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between border-b pb-3"
                     style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-black text-sm" style={{ color: "var(--text-1)" }}>طريقة الدفع</h3>
                  <button onClick={() => setCheckoutStep("pos")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center p-4 rounded-xl border"
                     style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-bold block mb-1" style={{ color: "var(--text-3)" }}>المطلوب سداده</span>
                  <div className="text-2xl font-black" style={{ color: "var(--brand)" }}>{Math.round(total)} ج.م</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "cash", name: "نقدي", icon: DollarSign, color: "bg-emerald-500" },
                    { id: "visa", name: "فيزا / شبكة", icon: CreditCard, color: "bg-brand" },
                    { id: "instapay", name: "InstaPay", icon: Smartphone, color: "bg-pink-600" },
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer`}
                        style={{
                          borderColor: isSelected ? "var(--brand)" : "var(--border)",
                          backgroundColor: isSelected ? "var(--bg-elevated)" : "transparent",
                          color: isSelected ? "var(--brand)" : "var(--text-2)"
                        }}
                      >
                        <div className={`${method.id !== "visa" ? method.color : ""} w-8 h-8 rounded-lg flex items-center justify-center text-white`}
                             style={{ backgroundColor: method.id === "visa" ? "var(--brand)" : undefined }}>
                          <method.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black">{method.name}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={completePayment}
                  className="w-full h-11 text-white rounded-xl font-black text-xs hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>تأكيد استلام المبلغ وطباعة الفاتورة</span>
                </button>
              </div>
            </motion.div>
          )}

          {checkoutStep === "receipt" && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center p-6 space-y-6"
            >
              <div className="relative">
                {/* Print animation container */}
                {showReceiptAnim && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-[280px] w-64 border shadow-2xl p-4 font-mono text-[9px] rounded-t-none rounded-b-xl relative overflow-hidden"
                    style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-strong)", color: "var(--text-1)" }}
                  >
                    <div className="absolute top-0 inset-x-0 h-1 border-b border-dashed"
                         style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)" }} />
                    <div className="text-center pt-2 pb-1 border-b border-dashed space-y-0.5"
                         style={{ borderColor: "var(--border)" }}>
                      <div className="font-black text-xs" style={{ color: "var(--text-1)" }}>محل ملابس منظومة</div>
                      <div>فرع المهندسين - الجيزة</div>
                      <div>تاريخ: {new Date().toLocaleDateString("ar-EG")}</div>
                      <div className="font-bold">رقم الفاتورة: {receiptNumber}</div>
                    </div>
                    <div className="py-2 border-b border-dashed space-y-1.5"
                         style={{ borderColor: "var(--border)" }}>
                      {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <div>
                            <div>{item.name.split(" ")[0]} x{item.quantity}</div>
                          </div>
                          <span>{item.price * item.quantity} ج.م</span>
                        </div>
                      ))}
                    </div>
                    <div className="py-2 space-y-1 text-right">
                      <div className="flex justify-between">
                        <span>المجموع:</span>
                        <span>{subtotal} ج.م</span>
                      </div>
                      {discountApplied && (
                        <div className="flex justify-between text-rose-500 font-bold">
                          <span>خصم 10%:</span>
                          <span>-{discountVal} ج.م</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>الضريبة 14%:</span>
                        <span>{Math.round(vat)} ج.م</span>
                      </div>
                      <div className="flex justify-between text-xs font-black pt-1.5 border-t border-dashed"
                           style={{ borderColor: "var(--border)" }}>
                        <span>الإجمالي النهائي:</span>
                        <span style={{ color: "var(--brand)" }}>{Math.round(total)} ج.م</span>
                      </div>
                    </div>
                    <div className="text-center pt-3 border-t border-dashed space-y-1 text-[8px]"
                         style={{ borderColor: "var(--border)" }}>
                      <div className="font-bold">طريقة الدفع: {paymentMethod === "cash" ? "نقدي" : paymentMethod === "visa" ? "فيزا" : "InstaPay"}</div>
                      <div className="font-black text-[9px] mt-1 tracking-wider" style={{ color: "var(--text-1)" }}>شكراً لزيارتكم!</div>
                      <div style={{ color: "var(--text-3)" }}>نظام منظومة الذكي لإدارة نقاط البيع</div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={resetPOS}
                  className="px-6 py-2.5 text-white rounded-xl font-black text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
                  style={{ backgroundColor: "var(--brand)", boxShadow: "0 10px 20px -5px rgba(37,99,235,0.2)" }}
                >
                  بيع جديد (فاتورة جديدة)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
