import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Smartphone, Globe, CreditCard, Receipt } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import { useAdminStore } from "../store/adminStore";
import { translations } from "../lib/translations";
import { useSEO } from "../hooks/useSEO";

export default function IntegrationPage() {
  const { language } = useAdminStore();
  const t = translations[language];
  const isAr = language === "ar";

  useSEO({
    title: `${t.integrationTitle} | Manzoma`,
    description: t.integrationSubtitle,
    keywords: "integration, api, easy orders, paymob, fawry, shopify, manzoma",
  });

  const categories = [
    {
      id: "delivery",
      title: (t as any).integrationCategories?.delivery || (isAr ? "الطلبات والتوصيل" : "Delivery & Orders"),
      icon: Smartphone,
      color: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      integrations: [
        { name: "Easy Orders", desc: isAr ? "استقبال ومزامنة طلبات الأونلاين فوراً داخل نقطة البيع." : "Receive and sync online orders instantly inside POS.", badge: "New" },
        { name: "Talabat", desc: isAr ? "ربط فروع المطاعم مع طلبات لتجنب الإدخال اليدوي." : "Connect restaurant branches to avoid manual entry." }
      ]
    },
    {
      id: "tax",
      title: (t as any).integrationCategories?.tax || (isAr ? "الضرائب والفواتير" : "Tax & Compliance"),
      icon: Receipt,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      integrations: [
        { name: "ETA (مصلحة الضرائب)", desc: isAr ? "تكامل رسمي ومباشر لتسجيل الفاتورة الإلكترونية B2B و B2C." : "Direct integration for B2B and B2C e-Invoicing." }
      ]
    },
    {
      id: "payment",
      title: (t as any).integrationCategories?.payment || (isAr ? "بوابات الدفع" : "Payment Gateways"),
      icon: CreditCard,
      color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      integrations: [
        { name: "Paymob", desc: isAr ? "تحصيل المدفوعات بالبطاقات البنكية والمحافظ الإلكترونية." : "Collect payments via credit cards and e-wallets." },
        { name: "Fawry", desc: isAr ? "دعم شبكة فوري الأوسع في مصر للمدفوعات النقدية." : "Support Fawry network for offline cash payments." }
      ]
    },
    {
      id: "ecommerce",
      title: (t as any).integrationCategories?.ecommerce || (isAr ? "المتاجر الإلكترونية" : "E-Commerce"),
      icon: Globe,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      integrations: [
        { name: "Shopify", desc: isAr ? "مزامنة المخزون والأسعار بين الفرع والمتجر الإلكتروني." : "Sync inventory and prices between store and e-commerce." },
        { name: "Salla / Zid", desc: isAr ? "ربط متكامل مع أشهر منصات التجارة في السعودية والخليج." : "Full integration with top Saudi e-commerce platforms." }
      ]
    }
  ];

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen flex flex-col font-sans relative antialiased" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-1)" }} dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex-grow flex flex-col space-y-16">
        {/* Header Section */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-3xl mx-auto space-y-6 pt-10">
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-black" style={{ color: "var(--text-1)" }}>
            {t.integrationTitle}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm sm:text-lg font-bold leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-2)" }}>
            {t.integrationSubtitle}
          </motion.p>
          <motion.div variants={fadeUp} className="flex justify-center pt-4">
            <Link to="/docs" className="h-12 px-8 rounded-xl text-xs font-black inline-flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ backgroundColor: "var(--text-1)", color: "var(--bg-page)" }}>
              {isAr ? "استكشف API المطورين" : "Explore Developer API"}
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </motion.div>
        </motion.div>

        {/* Integration Grid */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categories.map(category => (
            <motion.div key={category.id} variants={fadeUp} className="flex flex-col space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${category.color}`}>
                  <category.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black" style={{ color: "var(--text-1)" }}>{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {category.integrations.map((item, idx) => (
                  <div key={idx} className="p-5 sm:p-6 rounded-2xl border shadow-sm transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black" style={{ color: "var(--text-1)" }}>{item.name}</h3>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: "var(--text-2)" }}>{item.desc}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
