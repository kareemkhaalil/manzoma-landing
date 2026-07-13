import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  yearlyPrice?: string;
  priceSuffix: string;
  features: string[];
  isPopular?: boolean;
  visible?: boolean;
}

export interface Subscription {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  packageId: string;
  status: "active" | "trial" | "expired";
  startDate: string;
  expiryDate: string;
}

export interface Feature {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  heroTitle?: string;
  heroSubtitle?: string;
  isPublished: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  order: number;
}

export interface SiteConfig {
  siteName: string;
  logoUrl: string;
  iconUrl: string;
  patternUrl: string;
  primaryColor: string;
  navyColor: string;
  emeraldColor: string;
  trialDays: number;
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaText: string;
    ctaSecondaryText: string;
    badgeText: string;
    mockupImage: string;
  };
  headerLinks: { id: string; label: string; url: string; isNew?: boolean }[];
  footerSections: { title: string; links: { id: string; label: string; url: string }[] }[];
  partners: string[];
  academyVideos: { id: string; title: string; url: string; thumbnail?: string }[];
  designTokens: {
    heroGradient: string;
    showMeshBackground: boolean;
    primaryGlow: boolean;
  };
  features: Feature[];
  stats: {
    storesCount: string;
    terminalsCount: string;
    invoicesCount: string;
    uptime: string;
  };
  marqueeItems: string[];
  pages: DynamicPage[];
}

export interface DashboardStats {
  mrr: number;
  activeSubscriptions: number;
  totalTerminals: number;
  newTrials: number;
  mrrHistory: number[];
  subscriptionGrowth: number[];
}

interface AdminState {
  theme: "light" | "dark";
  config: SiteConfig;
  packages: Package[];
  subscriptions: Subscription[];
  stats: DashboardStats;
  setTheme: (theme: "light" | "dark") => void;
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  updatePackages: (packages: Package[]) => void;
  updateSubscriptions: (subscriptions: Subscription[]) => void;
  updateStats: (stats: Partial<DashboardStats>) => void;
}

const defaultPackages: Package[] = [
  {
    id: "p1",
    name: "الباقة الأساسية",
    description: "مثالية للمتاجر الصغيرة التي تبدأ رحلتها الرقمية.",
    price: "299",
    yearlyPrice: "249",
    priceSuffix: "جنيه / شهرياً",
    features: [
      "نقطة بيع واحدة",
      "فواتير إلكترونية غير محدودة",
      "إدارة المخزون الأساسية",
      "تقارير يومية",
      "دعم فني عبر الواتساب",
    ],
    visible: true,
  },
  {
    id: "p2",
    name: "الباقة الاحترافية",
    description: "كل ما تحتاجه للنمو والسيطرة التامة على تجارتك.",
    price: "599",
    yearlyPrice: "499",
    priceSuffix: "جنيه / شهرياً",
    features: [
      "حتى 3 نقاط بيع",
      "فواتير واتساب غير محدودة",
      "ربط متجر إلكتروني",
      "تقارير محاسبية متقدمة",
      "إدارة فروع متعددة",
      "التكويد الذكي للملابس",
      "تقرير Z-Report",
      "دعم فني أولوية",
    ],
    isPopular: true,
    visible: true,
  },
  {
    id: "p3",
    name: "باقة المؤسسات",
    description: "للسلاسل التجارية والمؤسسات الكبيرة التي تحتاج تحكم كامل.",
    price: "1,299",
    yearlyPrice: "999",
    priceSuffix: "جنيه / شهرياً",
    features: [
      "نقاط بيع غير محدودة",
      "كل مميزات الباقة الاحترافية",
      "API مفتوح للتكامل",
      "مدير حساب مخصص",
      "تدريب فريق العمل",
      "نسخ احتياطي متقدم",
      "تقارير مخصصة",
      "SLA مضمون 99.9%",
    ],
    visible: true,
  },
];

const defaultSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    storeName: "سوبر ماركت الراية",
    ownerName: "أحمد محمود",
    email: "ahmad@example.com",
    packageId: "p2",
    status: "active",
    startDate: "2026-01-15",
    expiryDate: "2027-01-15",
  },
  {
    id: "sub-2",
    storeName: "كافيه الأصدقاء",
    ownerName: "سارة خالد",
    email: "sara@example.com",
    packageId: "p1",
    status: "trial",
    startDate: "2026-04-20",
    expiryDate: "2026-05-04",
  },
  {
    id: "sub-3",
    storeName: "ملابس الأناقة",
    ownerName: "محمد إبراهيم",
    email: "mibrahim@example.com",
    packageId: "p2",
    status: "active",
    startDate: "2025-11-01",
    expiryDate: "2026-11-01",
  },
  {
    id: "sub-4",
    storeName: "صيدلية الشفاء",
    ownerName: "دينا عبدالله",
    email: "dina@example.com",
    packageId: "p3",
    status: "active",
    startDate: "2026-02-10",
    expiryDate: "2027-02-10",
  },
  {
    id: "sub-5",
    storeName: "مكتبة النور",
    ownerName: "يوسف حسن",
    email: "yousef@example.com",
    packageId: "p1",
    status: "expired",
    startDate: "2025-06-01",
    expiryDate: "2026-06-01",
  },
  {
    id: "sub-6",
    storeName: "معرض السيارات المتحدة",
    ownerName: "كريم عادل",
    email: "karim@example.com",
    packageId: "p3",
    status: "active",
    startDate: "2026-03-01",
    expiryDate: "2027-03-01",
  },
  {
    id: "sub-7",
    storeName: "مطعم الشرقاوي",
    ownerName: "حسام فؤاد",
    email: "hossam@example.com",
    packageId: "p2",
    status: "trial",
    startDate: "2026-05-01",
    expiryDate: "2026-05-15",
  },
  {
    id: "sub-8",
    storeName: "بوتيك ليالي",
    ownerName: "نورهان سمير",
    email: "nourhan@example.com",
    packageId: "p2",
    status: "active",
    startDate: "2025-12-20",
    expiryDate: "2026-12-20",
  },
];

const defaultConfig: SiteConfig = {
  siteName: "منظومة",
  logoUrl: "/cdn/Asset 1.png",
  iconUrl: "/cdn/logo.png",
  patternUrl: "/cdn/patternBlue.png",
  primaryColor: "#3B5BFF",
  navyColor: "#0D1B4A",
  emeraldColor: "#10B981",
  trialDays: 14,
  hero: {
    titleLine1: "منظومة.. أسرع كاشير،",
    titleLine2: "وأذكى فواتير.",
    subtitle:
      "النظام الوحيد في مصر الذي يربط محلك بموقعك، مع إصدار فواتير عبر الواتساب في ثوانٍ. سيطرة تامة على تجارتك من شاشة واحدة.",
    ctaText: "ابدأ تجربتك المجانية",
    ctaSecondaryText: "تواصل مع المبيعات",
    badgeText: "تحديث جديد: فواتير الواتساب أصبحت متاحة",
    mockupImage: "/cdn/logo.png",
  },
  headerLinks: [
    { id: "l1", label: "المميزات", url: "#features" },
    { id: "l2", label: "الأسعار", url: "#pricing" },
    { id: "l3", label: "الأكاديمية", url: "#academy", isNew: true },
  ],
  footerSections: [
    {
      title: "المنتج",
      links: [
        { id: "f1", label: "نقاط البيع", url: "#features" },
        { id: "f2", label: "إدارة المخزون", url: "#features" },
        { id: "f3", label: "الفواتير الإلكترونية", url: "#features" },
        { id: "f4", label: "التقارير المالية", url: "#features" },
      ],
    },
    {
      title: "الشركة",
      links: [
        { id: "f5", label: "عن منظومة", url: "/page/about" },
        { id: "f6", label: "تواصل معنا", url: "/page/contact" },
        { id: "f7", label: "الأسئلة الشائعة", url: "/page/faq" },
        { id: "f8", label: "الشروط والأحكام", url: "/page/terms" },
      ],
    },
    {
      title: "الدعم",
      links: [
        { id: "f9", label: "مركز المساعدة", url: "/page/faq" },
        { id: "f10", label: "الأكاديمية", url: "#academy" },
        { id: "f11", label: "حالة النظام", url: "#" },
      ],
    },
  ],
  partners: [
    "فودافون كاش",
    "اتصالات",
    "فوري",
    "أمان",
    "بنك مصر",
    "البنك الأهلي",
    "ميزة",
    "فيزا",
  ],
  academyVideos: [
    { id: "v1", title: "كيف تبدأ مع منظومة في 5 دقائق", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: "v2", title: "إدارة المخزون والباركود", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: "v3", title: "ربط الطابعة الحرارية وتخصيص الفاتورة", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ],
  designTokens: {
    heroGradient: "linear-gradient(135deg, #0D1B4A 0%, #3B5BFF 100%)",
    showMeshBackground: true,
    primaryGlow: true,
  },
  features: [
    {
      id: "f1",
      iconName: "WifiOff",
      title: "يعمل بدون إنترنت (Offline-First)",
      description:
        "يعمل النظام بسرعة فائقة محلياً، ويزامن مبيعاتك تلقائياً عند عودة الاتصال بخوادمنا. لن تتوقف تجارتك أبداً.",
    },
    {
      id: "f2",
      iconName: "MessageCircle",
      title: "فواتير واتساب فورية",
      description:
        "مع كل فاتورة بيع، يتم إرسال رسالة فورية على واتساب العميل تحتوي على تفاصيل الفاتورة وبيانات متجرك. تعزيز ثقة وهوية تجارية.",
    },
    {
      id: "f3",
      iconName: "Store",
      title: "ربط مع أي متجر إلكتروني",
      description:
        "ممكن تربط السيستم مع أي موقع خارجي أو متجر إلكتروني. مخزونك ومبيعاتك متزامنة بين المحل والموقع بشكل تلقائي.",
    },
    {
      id: "f4",
      iconName: "Cloud",
      title: "محلي أو سحابي — أنت تختار",
      description:
        "النظام متاح يشتغل بشكل محلي بالكامل (Offline) أو سحابي على الويب. تقدر تتحكم في بياناتك بالشكل اللي يناسبك.",
    },
    {
      id: "f5",
      iconName: "BarChart3",
      title: "تقارير متقدمة وتحليلات ذكية",
      description:
        "لوحة تحكم غنية بتقارير الأداء والأرباح والمخزون. تقارير يومية وأسبوعية وشهرية مع رسوم بيانية واضحة.",
    },
    {
      id: "f6",
      iconName: "Shirt",
      title: "التكويد الذكي للملابس",
      description:
        "توليد مصفوفة المقاسات والألوان وطباعة الباركود (Matrix) بضغطة زر واحدة. مصمم خصيصاً لمحلات الملابس.",
    },
    {
      id: "f7",
      iconName: "ShieldCheck",
      title: "رقابة مالية وZ-Report",
      description:
        "إغلاق ورديات دقيق بنظام العد الأعمى لضمان تطابق الخزينة ومنع التلاعب. حماية كاملة لأموالك.",
    },
    {
      id: "f8",
      iconName: "CreditCard",
      title: "مدفوعات متعددة",
      description:
        "دعم الدفع نقداً، فيزا، فوري، وأقساط. مرونة كاملة في طرق الدفع لتناسب جميع عملائك.",
    },
  ],
  stats: {
    storesCount: "412+",
    terminalsCount: "890+",
    invoicesCount: "125K+",
    uptime: "99.9%",
  },
  marqueeItems: [
    "فواتير واتساب فورية ⚡",
    "يعمل بدون إنترنت 📶",
    "ربط المتاجر الإلكترونية 🔗",
    "تقارير متقدمة 📊",
    "تكويد ذكي للملابس 👕",
    "Z-Report رقابة مالية 🛡️",
    "مدفوعات متعددة 💳",
    "محلي أو سحابي ☁️",
    "دعم فني 24/7 🎧",
    "إدارة فروع متعددة 🏪",
  ],
  pages: [
    {
      id: "page-1",
      title: "عن منظومة",
      slug: "about",
      heroTitle: "عن منظومة",
      heroSubtitle: "أسرع كاشير وأذكى نظام إدارة مبيعات في مصر",
      content: `منظومة هو نظام نقاط بيع (POS) وإدارة موارد المؤسسات (ERP) مصمم خصيصاً للسوق المصري. نحن نؤمن بأن كل تاجر يستحق أدوات تقنية متطورة تساعده على إدارة تجارته بكفاءة وسهولة.

تأسست منظومة عام 2024 بهدف تقديم حلول تقنية متكاملة للمتاجر والمحلات التجارية في مصر. نظامنا يعمل بدون إنترنت (Offline-First) مما يضمن استمرارية عملك في أي ظرف.

## مميزاتنا الفريدة

نظام منظومة يتميز بالعديد من الخصائص التي تجعله الخيار الأول للتجار في مصر:

- سرعة فائقة في إصدار الفواتير
- إرسال فواتير عبر الواتساب تلقائياً
- ربط مع المتاجر الإلكترونية
- تقارير مالية متقدمة وتحليلات ذكية
- دعم فني متواصل على مدار الساعة

## رؤيتنا

نسعى لأن نكون المنصة الأولى في مصر والشرق الأوسط لإدارة المبيعات ونقاط البيع، مع التركيز على البساطة والسرعة والأمان.`,
      isPublished: true,
      showInHeader: true,
      showInFooter: true,
      order: 1,
    },
    {
      id: "page-2",
      title: "تواصل معنا",
      slug: "contact",
      heroTitle: "تواصل معنا",
      heroSubtitle: "فريقنا جاهز لمساعدتك في أي وقت",
      content: `## طرق التواصل

يمكنك التواصل معنا عبر أي من القنوات التالية:

**الهاتف:** +20 100 123 4567

**واتساب:** +20 100 123 4567

**البريد الإلكتروني:** info@manzoma.online

**العنوان:** القاهرة، مصر

## ساعات العمل

- الأحد إلى الخميس: 9 صباحاً - 6 مساءً
- الجمعة والسبت: 10 صباحاً - 4 مساءً

## الدعم الفني

فريق الدعم الفني متاح على مدار الساعة عبر الواتساب لمساعدتك في أي استفسار أو مشكلة تقنية.`,
      isPublished: true,
      showInHeader: true,
      showInFooter: true,
      order: 2,
    },
    {
      id: "page-3",
      title: "الأسئلة الشائعة",
      slug: "faq",
      heroTitle: "الأسئلة الشائعة",
      heroSubtitle: "إجابات سريعة على أكثر الأسئلة شيوعاً",
      content: `## هل النظام يعمل بدون إنترنت؟

نعم! منظومة مصمم ليعمل بشكل كامل بدون اتصال بالإنترنت. جميع عمليات البيع والمخزون تتم محلياً، ويتم المزامنة تلقائياً عند عودة الاتصال.

## كم تبلغ مدة التجربة المجانية؟

نوفر فترة تجربة مجانية لمدة 14 يوم كاملة بجميع المميزات. لا نحتاج بيانات بطاقة ائتمان للبدء.

## هل يمكنني ربط النظام مع متجري الإلكتروني؟

بالتأكيد! منظومة يدعم الربط مع أي متجر إلكتروني بحيث يتم تحديث المخزون والأسعار بشكل تلقائي بين المحل والموقع.

## ما هي طرق الدفع المتاحة؟

ندعم جميع طرق الدفع: نقدي، فيزا، فوري، وأقساط. يمكنك تخصيص طرق الدفع حسب احتياجاتك.

## هل يوجد دعم فني؟

نعم، فريق الدعم الفني متاح على مدار الساعة عبر الواتساب. الباقات الاحترافية تحصل على أولوية في الدعم الفني.

## هل يمكنني تصدير التقارير؟

بالتأكيد! يمكنك تصدير جميع التقارير بصيغة Excel أو PDF في أي وقت.`,
      isPublished: true,
      showInHeader: false,
      showInFooter: true,
      order: 3,
    },
    {
      id: "page-4",
      title: "الشروط والأحكام",
      slug: "terms",
      heroTitle: "الشروط والأحكام",
      heroSubtitle: "شروط استخدام منصة منظومة",
      content: `## مقدمة

باستخدامك لمنصة منظومة، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية.

## استخدام الخدمة

- يُسمح باستخدام المنصة للأغراض التجارية المشروعة فقط.
- يجب الحفاظ على سرية بيانات الحساب وعدم مشاركتها مع أطراف أخرى.
- يحق لمنظومة تعليق الحسابات التي تنتهك شروط الاستخدام.

## الدفع والاشتراكات

- تُحتسب الاشتراكات بشكل شهري أو سنوي حسب الباقة المختارة.
- يتم التجديد التلقائي ما لم يتم إلغاء الاشتراك قبل موعد التجديد.
- لا يتم استرداد المبالغ المدفوعة بعد بدء فترة الاشتراك.

## حماية البيانات

- نلتزم بحماية بيانات عملائك وعدم مشاركتها مع أي طرف ثالث.
- يتم تشفير جميع البيانات أثناء النقل والتخزين.
- يحق لك طلب حذف بياناتك في أي وقت.`,
      isPublished: true,
      showInHeader: false,
      showInFooter: true,
      order: 4,
    },
  ],
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      theme: "light",
      config: defaultConfig,
      packages: defaultPackages,
      subscriptions: defaultSubscriptions,
      stats: {
        mrr: 125000,
        activeSubscriptions: 412,
        totalTerminals: 890,
        newTrials: 45,
        mrrHistory: [85000, 92000, 98000, 105000, 112000, 118000, 125000],
        subscriptionGrowth: [280, 310, 340, 355, 380, 398, 412],
      },
      setTheme: (theme) => set({ theme }),
      updateConfig: (updater) =>
        set((state) => ({ config: updater(state.config) })),
      updatePackages: (packages) => set({ packages }),
      updateSubscriptions: (subscriptions) => set({ subscriptions }),
      updateStats: (newStats) =>
        set((state) => ({ stats: { ...state.stats, ...newStats } })),
    }),
    {
      name: "manzoma-admin-storage",
    }
  )
);
