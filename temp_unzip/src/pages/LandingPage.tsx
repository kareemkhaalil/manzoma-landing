import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Zap,
  MessageCircle,
  TrendingUp,
  QrCode,
  AlertTriangle,
  Layers,
  Lock,
  ChevronLeft,
  Settings2,
  ShieldCheck,
  CreditCard,
  WifiOff,
  CheckCircle2,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Clock,
  DollarSign,
  Hexagon,
} from "lucide-react";

import { useAdminStore } from "../store/adminStore";

const MeshBackground = () => {
  const { config } = useAdminStore();
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#FDFDFD]">
      {/* Pattern Layer with Animation and Fade Mask */}
      <motion.div
        className="absolute inset-0 mix-blend-multiply"
        animate={{ backgroundPosition: ["0px 0px", "150px 150px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: (config.patternUrl || '/pattern.png')
            ? `url(${config.patternUrl || '/pattern.png'})`
            : "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          opacity: (config.patternUrl || '/pattern.png') ? 0.06 : 0.03,
          backgroundSize: (config.patternUrl || '/pattern.png') ? "150px" : "auto",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#FDFDFD_80%)] opacity-90" />

      {/* Dynamic Gradients */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={`absolute -top-[20%] right-[-10%] w-[80vw] h-[80vw] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-${config.primaryColor}-400/10 via-${config.primaryColor}-200/5 to-transparent mix-blend-multiply blur-3xl opacity-70`}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[10%] left-[-20%] w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-200/10 via-teal-100/5 to-transparent mix-blend-multiply blur-3xl opacity-60`}
      />

      {/* Structured Diagonal Shapes - Framing the Hero */}
      <motion.div
        animate={{ y: [-15, 15, -15], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[15%] right-[-10%] left-[20%] h-[120px] border-y border-${config.primaryColor}-300/20 bg-gradient-to-l from-transparent via-${config.primaryColor}-300/5 to-transparent origin-right transform-gpu mix-blend-overlay`}
        style={{ rotate: "-8deg" }}
      />
      <motion.div
        animate={{ y: [15, -15, 15], opacity: [0.2, 0.6, 0.2] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className={`absolute top-[65%] left-[-10%] right-[30%] h-[180px] border-y border-teal-300/20 bg-gradient-to-r from-transparent via-teal-300/5 to-transparent origin-left transform-gpu mix-blend-overlay`}
        style={{ rotate: "10deg" }}
      />
    </div>
  );
};

const Header = () => {
  const { config } = useAdminStore();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 pt-6 px-4 md:px-6 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-2xl px-4 py-3 rounded-2xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1),_inset_0_1px_0_rgba(255,255,255,0.5)] border border-white/60 transition-all duration-300">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              {(config.logoUrl || '/logo.png') ? (
                <img
                  src={config.logoUrl || '/logo.png'}
                  alt={config.siteName}
                  className="h-10 object-contain"
                />
              ) : (
                <>
                  {(config.iconUrl || '/icon.png') ? (
                    <img
                      src={config.iconUrl || '/icon.png'}
                      alt="Icon"
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 bg-gradient-to-br from-${config.primaryColor}-500 to-${config.primaryColor}-700 rounded-xl flex items-center justify-center text-white shadow-lg border border-${config.primaryColor}-400/50`}
                    >
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                  )}
                  <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-950">
                    {config.siteName}
                  </span>
                </>
              )}
            </div>
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
              {config.headerLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className={`relative hover:text-${config.primaryColor}-600 transition-colors`}
                >
                  {link.label}
                  {link.isNew && (
                    <span className="absolute -top-3 -left-4 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-bounce">
                      جديد
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className={`hidden sm:block text-sm font-bold text-slate-600 hover:text-${config.primaryColor}-600 transition-colors px-2`}
            >
              دخول التجار
            </a>
            <button
              className={`h-10 md:h-12 px-6 md:px-8 bg-slate-950 text-white rounded-xl font-black text-xs md:text-sm hover:scale-105 hover:bg-${config.primaryColor}-600 hover:shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] active:scale-95 transition-all outline-none`}
            >
              أنشئ نظامك مجاناً
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const Footer = () => {
  const { config } = useAdminStore();
  return (
    <footer className="relative bg-slate-950 pt-32 pb-12 overflow-hidden text-slate-400 mt-[-2rem] [clip-path:polygon(0_5%,_100%_0,_100%_100%,_0_100%)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] opacity-20 pointer-events-none">
        <div
          className={`absolute inset-0 bg-gradient-to-b from-${config.primaryColor}-600 to-transparent blur-[120px] rounded-[100%] scale-y-50 -translate-y-[60%]`}
        ></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="col-span-1 md:col-span-12 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              {(config.logoUrl || '/logo.png') ? (
                <img
                  src={config.logoUrl || '/logo.png'}
                  alt={config.siteName}
                  className="h-12 object-contain filter brightness-0 invert"
                />
              ) : (
                <>
                  {(config.iconUrl || '/icon.png') ? (
                    <img
                      src={config.iconUrl || '/icon.png'}
                      alt="Icon"
                      className="w-12 h-12 object-contain filter brightness-0 invert"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 bg-${config.primaryColor}-500 rounded-xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.4)]`}
                    >
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                  )}
                  <span className="text-3xl font-black tracking-tighter text-white">
                    {config.siteName}
                  </span>
                </>
              )}
            </div>
            <p className="font-bold leading-relaxed text-slate-400 max-w-sm mb-6 text-lg">
              أدوات مالية ذكية ومحاسبة لا تتوقف للشركات الطموحة في المملكة
              العربية السعودية والشرق الأوسط.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer">
                <Hexagon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
          {config.footerSections.map((section, idx) => (
            <div
              key={idx}
              className={`col-span-1 md:col-span-4 lg:col-span-2 ${idx === 0 ? "lg:col-start-7" : ""}`}
            >
              <h4 className="text-white font-black mb-6 text-lg">
                {section.title}
              </h4>
              <ul className="space-y-4 font-bold text-slate-400">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className={`hover:text-${config.primaryColor}-400 transition-colors flex items-center gap-2`}
                    >
                      {idx === 0 && (
                        <ArrowUpRight className="w-3 h-3 opacity-50" />
                      )}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h4 className="text-white font-black mb-6 text-lg">تواصل معنا</h4>
            <p className="font-bold text-slate-400 mb-4 line-clamp-2 leading-relaxed">
              الرياض، المملكة العربية السعودية
              <br />
              طريق الملك فهد
            </p>
            <a
              href="mailto:hi@manzoma.sa"
              className={`font-black text-white hover:text-${config.primaryColor}-400 transition-colors`}
            >
              hi@manzoma.sa
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold border-t border-slate-800 pt-8 pb-4">
          <p>© 2026 {config.siteName}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </a>
            <a href="#" className="hover:text-white transition-colors">
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const PartnersMarquee = () => {
  const partners = [
    "Shopify",
    "سلة (Salla)",
    "زد (Zid)",
    "Aramex",
    "SMSA",
    "Mada",
    "Apple Pay",
    "Google Pay",
    "STC Pay",
    "QuickPay",
    "Facebook Pixel",
    "Snapchat",
    "Google Analytics",
    "Xero",
    "Quickbooks",
  ];
  return (
    <div className="relative py-12 bg-transparent border-y border-slate-100 overflow-hidden flex whitespace-nowrap">
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>

      <motion.div
        animate={{ x: [0, 1035] }} // Adjust depending on width
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex gap-12 sm:gap-24 items-center pr-12 w-[max-content]"
        dir="ltr"
      >
        {[...partners, ...partners].map((p, i) => (
          <span
            key={i}
            className="text-xl sm:text-3xl font-black text-slate-300 opacity-60 hover:opacity-100 hover:text-indigo-400 transition-colors select-none tracking-tight"
          >
            {p}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] mix-blend-overlay transition-opacity duration-300"
        style={{
          background: useTransform(
            () =>
              `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
          ),
        }}
      />
      <div
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="h-full w-full rounded-[inherit]"
      >
        {children}
      </div>
    </motion.div>
  );
};

const FeaturesGrid = () => {
  const { config } = useAdminStore();
  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: "إدارة متكاملة",
      description:
        "تحكم كامل في مبيعاتك، مخزونك، وتقاريرك من لوحة تحكم واحدة مصممة خصيصاً لتسهيل عملك.",
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "فواتير رقمية معتمدة",
      description:
        "أصدر فواتير متوافقة مع هيئة الزكاة والضريبة والجمارك بضغطة زر وأرسلها لعملائك عبر الواتساب.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "تقارير ذكية",
      description:
        "احصل على رؤى دقيقة وسريعة لمبيعاتك وأرباحك للمساعدة في اتخاذ قرارات أفضل لنمو تجارتك.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "أمان متقدم",
      description:
        "بياناتك مشفرة ومحفوظة سحابياً في خوادم آمنة بنسبة 100% مع نسخ احتياطي تلقائي.",
    },
    {
      icon: <WifiOff className="w-6 h-6" />,
      title: "يعمل بدون إنترنت",
      description:
        "لا تقلق من انقطاع الاتصال، الكاشير يعمل بسلاسة وتتزامن البيانات فور عودة الإنترنت.",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "دفع متعدد",
      description:
        "ادعم طرق الدفع المختلفة (كاش، شبكة، تحويل، بطاقات ائتمانية) بسهولة تامة.",
    },
  ];

  return (
    <section className="relative z-30 pt-32 pb-48 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 leading-tight">
              أنت المتحكّم الأول والأخير، <br />
              في كل تفاصيل متجرك
            </h2>
            <p className="text-xl text-slate-500 font-bold leading-relaxed">
              لم تعد إدارة الأعمال معقدة. وفرنا لك كل الأدوات التي تحتاجها لتبدأ
              وتنمو بثبات، كل ذلك في منصة واحدة سهلة الاستخدام.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-${config.primaryColor}-200 transition-all hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] group`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-${config.primaryColor}-50 text-${config.primaryColor}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {item.title}
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "هل أحتاج إلى خبرة تقنية لاستخدام النظام؟",
      a: "إطلاقاً! صممنا النظام ليكون بديهياً وسهل الاستخدام لأي شخص، بالإضافة إلى أن فريق الدعم مستعد لتدريبك.",
    },
    {
      q: "ماذا لو انقطع الإنترنت أثناء العمل؟",
      a: "نظام نقاط البيع لدينا يدعم وضع الأوفلاين، مما يعني أنك ستستمر في إتمام عمليات البيع بدون مشاكل، وسيتم مزامنة البيانات تلقائياً عند عودة الاتصال.",
    },
    {
      q: "هل يمكنني ربط نظامي بالمتاجر الإلكترونية؟",
      a: "نعم، يدعم نظامنا الربط المباشر مع سلة، زد، شوبيفاي، وغيرها من المنصات لتوحيد المخزون والمبيعات.",
    },
    {
      q: "كيف يتم دعم الفوترة الإلكترونية؟",
      a: "نظامنا متوافق 100% مع متطلبات هيئة الزكاة والضريبة والجمارك (المرحلة الأولى والثانية)، ويصدر فواتير QR Code تلقائياً.",
    },
  ];

  return (
    <section className="relative z-30 py-32 bg-slate-50 border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6">
            أسئلة متكررة
          </h2>
          <p className="text-xl text-slate-500 font-bold">
            كل ما تريد معرفته عن نظامنا وتطبيق ومميزات منظومة
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center justify-between">
                {faq.q}
                <ChevronLeft className="w-5 h-5 text-slate-400 rotate-270" />
              </h4>
              <p className="text-slate-500 font-bold leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const { packages, config } = useAdminStore();

  return (
    <section className="relative z-50 bg-[#FDFDFD] pt-32 pb-32 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 line-clamp-2">
          <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight mb-6 mt-1">
            هل تعتقد أن إدارة مبيعاتك أمر معقد؟
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-bold max-w-3xl mx-auto leading-relaxed">
            صدقنا... الأمر أسهل مما تتوقع وعكس كل تجاربك السابقة. اختر الباقة
            التي تناسب طموحك اليوم وثق بأننا معك في كل خطوة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages
            .filter((p) => p.visible)
            .map((pkg) => (
              <div
                key={pkg.id}
                className={`${pkg.isPopular ? "bg-slate-950 text-white shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)]" : "bg-white border-slate-200 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"} rounded-[3rem] p-10 border transition-shadow relative overflow-hidden`}
              >
                {pkg.isPopular && (
                  <>
                    <div
                      className={`absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.4)_0%,_transparent_60%)] pointer-events-none`}
                    ></div>
                    <div
                      className={`absolute top-6 left-6 bg-${config.primaryColor}-500/20 text-${config.primaryColor}-300 text-xs font-black px-3 py-1.5 rounded-lg border border-${config.primaryColor}-500/30`}
                    >
                      الأكثر طلباً
                    </div>
                  </>
                )}
                <div className="mb-8 relative z-10">
                  <h3
                    className={`text-3xl font-black ${pkg.isPopular ? "" : "text-slate-950"} mb-2`}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className={`font-bold ${pkg.isPopular ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {pkg.description}
                  </p>
                </div>
                <div className="mb-8 flex items-baseline gap-2 relative z-10">
                  <span
                    className={`text-6xl font-black tracking-tighter ${pkg.isPopular ? "" : "text-slate-950"}`}
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className={`font-bold text-lg ${pkg.isPopular ? "text-slate-400" : "text-slate-500 border-b border-slate-300 pb-1"}`}
                  >
                    {pkg.priceSuffix}
                  </span>
                </div>
                <ul
                  className={`space-y-4 mb-10 font-bold relative z-10 ${pkg.isPopular ? "text-slate-300" : "text-slate-600"}`}
                >
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${pkg.isPopular ? `bg-${config.primaryColor}-500/20 text-${config.primaryColor}-400` : "bg-teal-50 text-teal-600"}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full h-16 rounded-2xl font-black transition-colors text-lg relative z-10 ${pkg.isPopular ? `bg-${config.primaryColor}-500 hover:bg-${config.primaryColor}-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] border border-${config.primaryColor}-400/50` : "border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white"}`}
                >
                  اشترك الآن
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { config } = useAdminStore();

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-transparent font-sans selection:bg-indigo-500/10 selection:text-indigo-600 overflow-x-hidden max-w-[100vw]"
      dir="rtl"
    >
      <MeshBackground />
      <Header />

      {/* 🎬 SCENE 1: THE HERO */}
      <section className="relative pt-40 md:pt-56 pb-32 px-6 z-10 w-full mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 text-center lg:text-right z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1
                style={{ fontFamily: "'Tajawal', sans-serif" }}
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-black leading-[1.05] tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-l from-${config.primaryColor}-700 via-${config.primaryColor}-600 to-teal-500 pb-2 drop-shadow-sm`}
              >
                {config.hero.titleLine1} <br className="hidden sm:block" />
                {config.hero.titleLine2}
              </h1>
              <p className="text-lg md:text-2xl text-slate-500 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                {config.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-6">
                <button
                  className={`h-16 px-10 bg-slate-950 text-white rounded-2xl font-black text-lg shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4),_0_10px_20px_-10px_rgba(79,70,229,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
                >
                  {config.hero.ctaText}
                  <ChevronLeft className="w-5 h-5 opacity-50" />
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6 relative h-[450px] sm:h-[500px] lg:h-[650px] w-full z-30 perspective-[1500px]">
            <TiltCard className="absolute top-0 sm:top-10 right-[calc(50%-140px)] sm:right-[10%] lg:right-auto lg:left-[45%] w-[280px] bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-[0_50px_100px_-20px_rgba(20,184,166,0.15),_0_30px_60px_-30px_rgba(20,184,166,0.3)] border border-white/60 z-20">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
                  <MessageCircle className="w-6 h-6 fill-current opacity-20" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-black text-slate-950">فاتورة رقمية</p>
                  <p className="text-xs font-bold text-slate-400">
                    عبر الواتساب
                  </p>
                </div>
              </div>
              <div className="bg-slate-50/50 rounded-xl p-3 flex justify-between items-center text-sm border border-slate-100">
                <span className="font-bold text-slate-500">الإجمالي</span>
                <span className="font-black text-slate-950">240.00 ر.س</span>
              </div>
            </TiltCard>

            <TiltCard className="absolute top-28 sm:top-32 lg:top-40 left-[calc(50%-160px)] sm:left-[5%] lg:left-auto lg:right-[15%] w-[320px] md:w-[350px] bg-slate-950/95 backdrop-blur-xl text-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_60px_120px_-20px_rgba(79,70,229,0.4),_0_30px_60px_-30px_rgba(0,0,0,0.6)] z-30 border border-slate-800">
              <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div className="text-right flex-1">
                  <p className="text-slate-400 font-bold mb-2 text-sm">
                    عملية بيع جديدة
                  </p>
                  <p
                    className="text-3xl font-black tracking-tight"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    1,850.50 ر.س
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 shadow-inner border border-indigo-500/30">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-3 mb-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5"
                  >
                    <span className="text-sm font-black">1x</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-300">
                        صنف متغير #{i}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-teal-500/20"></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full h-14 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-black flex items-center justify-center gap-3 transition-colors shadow-[0_15px_30px_-10px_rgba(99,102,241,0.5)] border border-indigo-400/50">
                تأكيد الدفع <CheckCircle2 className="w-5 h-5" />
              </button>
            </TiltCard>

            <TiltCard className="hidden lg:block absolute bottom-10 left-[0%] w-[260px] bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(16,185,129,0.15),_0_20px_40px_-20px_rgba(0,0,0,0.1)] border border-slate-100/50 z-40">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-emerald-50 text-emerald-600 font-black text-xs px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                  +40%
                </span>
                <span className="font-black text-slate-950 text-sm">
                  صافي الأرباح
                </span>
              </div>
              <div className="flex items-end gap-2 h-16 w-full">
                {[30, 45, 25, 60, 40, 80, 50].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-emerald-50 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className="bg-emerald-400 w-full rounded-t-sm shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                      style={{ height: "50%" }}
                    ></div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 🎬 SCENE 1.5: PARTNERS & STATS */}
      <section className="relative z-20 pb-20">
        <PartnersMarquee />
        <div className="max-w-7xl mx-auto px-6 mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {config.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  className={`text-4xl sm:text-5xl font-black tracking-tighter mb-2 text-${stat.color}`}
                >
                  {stat.q}
                </p>
                <p className="text-sm font-bold text-slate-500">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesGrid />

      {/* 🎬 SCENE 2: SMART POS (Clipped Diagonal Layout) */}
      <section className="relative z-30 bg-slate-50 pt-48 pb-48 [clip-path:polygon(0_5%,_100%_0,_100%_95%,_0_100%)] md:[clip-path:polygon(0_10%,_100%_0,_100%_90%,_0_100%)] -mt-24 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 perspective-[2000px] relative z-40">
              <motion.div
                whileHover={{ rotateY: 5, rotateX: 2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),_0_30px_60px_-30px_rgba(0,0,0,0.2)] p-6 z-20 relative"
                style={{ transform: "rotateY(-10deg) rotateX(5deg)" }}
              >
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-[2rem] aspect-[4/3] p-8 flex flex-col shadow-inner">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                    <div className="flex gap-2">
                      <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <QrCode className="w-5 h-5" />
                      </span>
                      <span className="w-10 h-10 rounded-xl bg-slate-200"></span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs bg-rose-50 px-4 py-2 rounded-full border border-rose-100 shadow-sm">
                      <WifiOff className="w-4 h-4" /> يعمل أوفلاين
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-end p-4"
                      >
                        <div className="w-full h-2.5 bg-slate-100 rounded-full mb-3"></div>
                        <div className="w-1/2 h-2.5 bg-slate-100 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <div className="absolute -right-8 top-16 bg-slate-950 text-white p-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-4 z-50 border border-slate-800 backdrop-blur-md animate-[bounce_4s_infinite]">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                  <Settings2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">
                    Hybrid Sync
                  </p>
                  <p className="font-black text-sm">محرك المزامنة الهجين</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 text-right relative z-30">
              <span className="text-indigo-600 font-black uppercase tracking-widest text-xs mb-4 block">
                Smart POS & Speed
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mb-6 leading-tight tracking-tight px-2">
                شاشة بيع
                <br />{" "}
                <span className="text-slate-400 italic">لا تتوقف أبداً.</span>
              </h2>
              <p className="text-lg text-slate-500 font-bold leading-relaxed mb-10 px-2">
                صممنا نقطة البيع لتعمل بسرعة البرق، حتى في أسوأ ظروف الإنترنت.
                يحفظ النظام عملياتك محلياً ويزامنها فور عودة الاتصال.
              </p>
              <ul className="space-y-8 px-2">
                {[
                  {
                    icon: QrCode,
                    title: "متغيرات وباركود فريد",
                    desc: "أدخل الأصناف بألوان ومقاسات مختلفة فورياً عبر جهاز الباركود.",
                  },
                  {
                    icon: Settings2,
                    title: "نظام عروض صلب",
                    desc: "طبق عروض (اشترِ X واحصل على Y) مع فحص أمني يمنع تلاعب الكاشير.",
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex flex-row-reverse items-start gap-5 group"
                  >
                    <div className="w-16 h-16 bg-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] border border-slate-200 rounded-2xl shrink-0 flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-300">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-950 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🎬 SCENE 3: CONNECTIVITY (Overlapping dark section) */}
      <section className="relative z-40 bg-slate-950 text-white pt-40 pb-48 px-6 -mt-32 [clip-path:polygon(0_0,_100%_8%,_100%_100%,_0_100%)] md:[clip-path:polygon(0_0,_100%_12%,_100%_100%,_0_100%)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[0%] left-[-20%] w-[80vw] h-[80vw] bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.15)_0%,_transparent_50%)] mix-blend-screen"></div>
          <div className="absolute bottom-[0%] right-[-20%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.1)_0%,_transparent_50%)] mix-blend-screen"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-24 mt-16">
          <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em] bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8 inline-block shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            Connectivity
          </span>
          <h2
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight"
          >
            مربوط، متزامن،{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-400 to-indigo-400">
              وآلي بالكامل.
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
            النظام ليس جزيرة معزولة. أرسل فواتيرك عبر واتساب واربط متجرك
            الإلكتروني في ثوانٍ.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between hover:bg-white/10 transition-colors relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-t-white/20">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
            <div className="text-right z-10 mb-12">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 ml-auto border border-emerald-500/30">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">
                الفاتورة عبر الواتساب
              </h3>
              <p className="text-slate-400 font-bold leading-relaxed">
                انسَ الورق. بضغطة زر، تصل الفاتورة شاملة التفاصيل لعميلك عبر
                الواتساب فور إتمام البيع، مما يعزز هوية متجرك.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between hover:bg-white/10 transition-colors relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-t-white/20">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none"></div>
            <div className="text-right z-10 mb-12">
              <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-8 ml-auto border border-indigo-500/30">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">
                مزامنة المتجر الإلكتروني
              </h3>
              <p className="text-slate-400 font-bold leading-relaxed">
                اربط مع (Shopify، سلة، زد). تحديث المخزون إلكترونياً لحظة بلحظة
                لتجنب بيع الوهم للعملاء.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎬 SCENE 4: THE BENTO BOX (Inventory & BOM) - Stripe Style Cleanliness */}
      <section className="relative z-50 bg-[#FDFDFD] pt-32 pb-40 px-6 -mt-20 [clip-path:polygon(0_5%,_100%_0,_100%_100%,_0_100%)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-right mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight mb-6">
              رقابة دقيقة
              <br />
              على كل <span className="text-teal-500 italic">قطعة.</span>
            </h2>
            <p className="text-2xl text-slate-500 font-bold max-w-2xl ml-auto">
              إدارة مخازن متطورة تليق بالمؤسسات الكبرى، مصممة في واجهات بسيطة
              ونظيفة بأسلوب البينتو.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[300px]">
            {/* Box 1: BOM */}
            <div className="md:col-span-8 bg-[#F7F9FC] rounded-[3rem] p-12 flex flex-col md:flex-row gap-12 items-center border border-slate-100/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              <div className="flex-1 text-right z-10 w-full order-2 md:order-1">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-8 ml-auto text-slate-900">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-950 mb-4">
                  نظام التصنيع والورش (BOM)
                </h3>
                <p className="text-slate-500 font-bold text-base leading-relaxed">
                  عرّف "قائمة مواد" للمنتج التام. عند بيع قطعة مصنعة، يخصم
                  النظام الخامات المستهلكة تلقائياً ويحسب تكلفة الإنتاج
                  الحقيقية.
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-4 relative z-10 w-full order-1 md:order-2">
                <div className="bg-white p-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex justify-between items-center transform md:translate-x-6">
                  <span className="font-bold text-slate-400 text-sm">
                    زرار قميص (4x)
                  </span>
                  <span className="font-black text-slate-900">-1.20 ر.س</span>
                </div>
                <div className="bg-slate-950 text-white p-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] flex justify-between items-center transform md:-translate-x-6 mt-2 relative z-20">
                  <span className="font-bold text-slate-400 text-sm">
                    منتج نهائي مقفل
                  </span>
                  <span className="font-black text-emerald-400 border-b border-emerald-400/30 pb-0.5">
                    16.20 ر.س
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Stock Alerts */}
            <div className="md:col-span-4 bg-white rounded-[3rem] p-12 flex flex-col justify-between border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="text-right">
                <div className="flex justify-end mb-8">
                  <AlertTriangle className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-950 mb-4">
                  تنبيهات نفاذ الكمية
                </h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">
                  نظام إنذار مبكر للأصناف لضمان استمرارية البيع.
                </p>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center justify-between">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-black text-rose-600 text-sm">
                  3 قطع متبقية (عطر A)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎬 SCENE 5: CONTROL & VAULT */}
      <section className="relative z-50 bg-slate-50 py-40 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 text-right">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 ml-auto shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-5xl font-black mb-6 leading-tight text-slate-950">
                الخزنة المحصنة <br />
                <span className="text-slate-400">واليومية الموحدة.</span>
              </h2>
              <p className="text-xl text-slate-500 font-bold leading-relaxed mb-8">
                ميزة أمنية عالية المستوى تمنع الكاشير من إيداع المبالغ في الخزنة
                الكبيرة. النظام يقارن الفعلي بالدفتري (Z-Report) لكشف الزيادة
                والعجز.
              </p>
            </div>
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="bg-white p-3 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1),_0_30px_60px_-30px_rgba(0,0,0,0.05)] border border-slate-200/60 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-full h-[200px] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none"></div>
                <div className="bg-[#FDFDFD] rounded-[2rem] border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">
                      shift closure
                    </span>
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-slate-400" />
                      <span className="font-black text-slate-900 text-base">
                        وردية رقم #902
                      </span>
                    </div>
                  </div>
                  <div className="p-8 text-right overflow-x-auto">
                    <table className="w-full text-right min-w-[500px]">
                      <thead>
                        <tr className="text-slate-400 text-xs font-black uppercase tracking-wider">
                          <th className="py-4">الحركة</th>
                          <th className="py-4">الرصيد الدفتري</th>
                          <th className="py-4">الفعلي</th>
                          <th className="py-4">العجز / الزيادة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-bold">
                        <tr className="hover:bg-slate-50">
                          <td className="py-5 text-slate-950">مبيعات نقدية</td>
                          <td className="py-5 text-slate-500">1,200.00 ر.س</td>
                          <td className="py-5 text-slate-950">1,200.00 ر.س</td>
                          <td className="py-5 text-slate-400">0.00</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-5 text-slate-950">شبكة (POS)</td>
                          <td className="py-5 text-slate-500">850.00 ر.س</td>
                          <td className="py-5 text-slate-950">840.00 ر.س</td>
                          <td className="py-5 text-rose-500 font-black bg-rose-50/50 px-3 rounded-lg inline-block my-2">
                            -10.00 ر.س
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      <FAQSection />

      {/* 🎬 SCENE 6: CTA (Centered High Impact) */}
      <section className="relative z-50 bg-slate-50 pt-32 pb-48">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight">
              يقلل الهالك والسرقات بنسبة تصل إلى{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">
                40%.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 font-bold mb-12 leading-relaxed max-w-2xl mx-auto">
              منظومة ليس مجرد برنامج كاشير عادي، بل هو مديرك المالي والمخزني
              الذي يحمي كل قرش ويزيد من إنتاجيتك بشكل غير مسبوق.
            </p>
            <button className="h-20 px-16 bg-slate-950 text-white rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-slate-800 flex items-center justify-center gap-4 mx-auto group">
              <Sparkles className="w-6 h-6 text-teal-400 group-hover:animate-pulse" />
              احصل على نسخة تجريبية
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
