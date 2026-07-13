import { create } from "zustand";
import { persist } from "zustand/middleware";
import { updatePublicConfig, fetchPublicConfig, fetchPublicPages } from "../lib/apiService";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored securely in a real app
  role: "super_admin" | "admin";
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  yearlyPrice?: string;
  priceSuffix: string;
  features: string[];
  maxUsers: number;
  maxBranches: number;
  hasWhatsApp: boolean;
  hasOfflineSync: boolean;
  isPopular?: boolean;
  visible?: boolean;
}

export type SubscriptionStatus = "trial" | "active" | "past_due" | "suspended" | "expired";
export type BillingCycle = "monthly" | "yearly";

export interface Subscription {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone?: string;
  packageId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  licenseKey: string;
  hwid: string | null;
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
  status?: string;
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
  socialLinks: { platform: string; url: string }[];
  whatsappNumber: string;
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
  marqueeConfig: {
    speed: number;
    thickness: string;
    row1Color: string;
    row2Color: string;
    zIndexForward: boolean;
  };
  promoBar: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    backgroundColor: string;
  };
  sideBadge: {
    enabled: boolean;
    text: string;
    backgroundColor: string;
  };
  pages: DynamicPage[];
}

export interface DashboardStats {
  totalCompanies: number;
  totalRevenue: number;
  totalOrders: number;
  mrrHistory: number[];
  averageOrderValue: number;
}

interface AdminState {
  theme: "light" | "dark";
  config: SiteConfig;
  packages: Package[];
  subscriptions: Subscription[];
  stats: DashboardStats;
  
  // Auth & Admins
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  adminUsers: AdminUser[];
  
  // Computed Properties (Getters)
  getCalculatedMRR: () => number;
  getCalculatedARR: () => number;
  getActiveLicensesCount: () => number;
  getChurnRate: () => number;
  
  language: "ar" | "en";
  
  // Actions
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addAdmin: (user: AdminUser) => void;
  removeAdmin: (id: string) => void;
  updateAdmin: (id: string, user: Partial<AdminUser>) => void;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: "ar" | "en") => void;
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  updatePackages: (packages: Package[]) => void;
  updateSubscriptions: (subscriptions: Subscription[]) => void;
  updateStats: (stats: Partial<DashboardStats>) => void;
  
  // Advanced Subscription Actions
  generateLicenseKey: (subscriptionId: string) => void;
  revokeHWID: (subscriptionId: string) => void;
  suspendSubscription: (subscriptionId: string) => void;
  
  // CMS Async Initialization
  initializeCMSData: () => Promise<void>;
}

// Generate a random secure-looking license key
const generateKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const block = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `MNZM-${block()}-${block()}-${block()}`;
};

const defaultPackages: Package[] = [
  {
    id: "p1",
    name: "الباقة الأساسية",
    description: "مثالية للمتاجر الصغيرة التي تبدأ رحلتها الرقمية.",
    price: "299",
    yearlyPrice: "249", // Per month if billed annually
    priceSuffix: "جنيه / شهرياً",
    maxUsers: 2,
    maxBranches: 1,
    hasWhatsApp: false,
    hasOfflineSync: true,
    features: [
      "نقطة بيع واحدة",
      "فواتير إلكترونية",
      "إدارة المخزون الأساسية",
      "تقارير يومية",
      "دعم فني عادي",
    ],
    visible: true,
  },
  {
    id: "p2",
    name: "الباقة الاحترافية",
    description: "كل ما تحتاجه للنمو والسيطرة التامة على تجارتك.",
    price: "599",
    yearlyPrice: "479",
    priceSuffix: "جنيه / شهرياً",
    maxUsers: 5,
    maxBranches: 3,
    hasWhatsApp: true,
    hasOfflineSync: true,
    features: [
      "حتى 3 نقاط بيع",
      "فواتير واتساب لا محدودة",
      "ربط متجر إلكتروني",
      "تقارير محاسبية متقدمة",
      "التكويد الذكي للملابس",
      "دعم فني أولوية",
    ],
    isPopular: true,
    visible: true,
  },
  {
    id: "p3",
    name: "باقة المؤسسات",
    description: "للسلاسل التجارية التي تحتاج تحكم كامل.",
    price: "1,299",
    yearlyPrice: "1039",
    priceSuffix: "جنيه / شهرياً",
    maxUsers: 999, // Unlimited
    maxBranches: 999, // Unlimited
    hasWhatsApp: true,
    hasOfflineSync: true,
    features: [
      "نقاط بيع لا محدودة",
      "كل مميزات الباقة الاحترافية",
      "API مفتوح للتكامل",
      "مدير حساب مخصص",
      "نسخ احتياطي متقدم",
      "SLA مضمون 99.9%",
    ],
    visible: true,
  },
];

// No more fake subscriptions — real data comes from the API (ClientsManager.tsx)
const defaultSubscriptions: Subscription[] = [];

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
      "ضاعف أرباحك، تحكم في مخزونك، وامنع أي تلاعب.. من شاشة واحدة. وفر 20 ساعة من الجرد أسبوعياً، وابدأ البيع في 5 دقائق.",
    ctaText: "ابدأ تجربتك المجانية",
    ctaSecondaryText: "تواصل مع المبيعات",
    badgeText: "تحديث جديد: فواتير الواتساب أصبحت متاحة",
    mockupImage: "/cdn/logo.png",
  },
  headerLinks: [
    { id: "l1", label: "المميزات", url: "#features" },
    { id: "l2", label: "الأسعار", url: "#pricing" },
    { id: "l3", label: "الأكاديمية", url: "/academy", isNew: true },
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
        { id: "f10", label: "الأكاديمية", url: "/academy" },
        { id: "f11", label: "المدونة المعرفية", url: "/blog" },
      ],
    },
  ],
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
  ],
  whatsappNumber: "201099600048",
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
  ],
  designTokens: {
    heroGradient: "linear-gradient(135deg, #0D1B4A 0%, #3B5BFF 100%)",
    showMeshBackground: true,
    primaryGlow: true,
  },
  features: [
    { id: "f1", iconName: "WifiOff", title: "يعمل بدون إنترنت (Offline-First)", description: "يعمل النظام بسرعة فائقة محلياً، ويزامن مبيعاتك تلقائياً عند عودة الاتصال بخوادمنا." },
    { id: "f2", iconName: "MessageCircle", title: "فواتير واتساب فورية", description: "مع كل فاتورة بيع، يتم إرسال رسالة فورية على واتساب العميل تحتوي على تفاصيل الفاتورة." },
    { id: "f3", iconName: "Store", title: "ربط مع أي متجر إلكتروني", description: "ممكن تربط السيستم مع أي موقع خارجي أو متجر إلكتروني. مخزونك ومبيعاتك متزامنة." },
    { id: "f4", iconName: "Cloud", title: "محلي أو سحابي — أنت تختار", description: "النظام متاح يشتغل بشكل محلي بالكامل (Offline) أو سحابي على الويب." },
    { id: "f5", iconName: "BarChart3", title: "تقارير متقدمة وتحليلات ذكية", description: "لوحة تحكم غنية بتقارير الأداء والأرباح والمخزون. تقارير يومية وأسبوعية وشهرية." },
    { id: "f6", iconName: "Shirt", title: "التكويد الذكي للملابس", description: "توليد مصفوفة المقاسات والألوان وطباعة الباركود بضغطة زر واحدة." },
    { id: "f7", iconName: "ShieldCheck", title: "رقابة مالية وZ-Report", description: "إغلاق ورديات دقيق بنظام العد الأعمى لضمان تطابق الخزينة ومنع التلاعب." },
    { id: "f8", iconName: "CreditCard", title: "مدفوعات متعددة", description: "دعم الدفع نقداً، فيزا، فوري، وأقساط. مرونة كاملة في طرق الدفع." },
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
  ],
  marqueeConfig: {
    speed: 120,
    thickness: "py-6",
    row1Color: "#0D1B4A",
    row2Color: "#3B5BFF",
    zIndexForward: true,
  },
  promoBar: {
    enabled: true,
    text: "🔥 خصم 20% على الباقات السنوية لفترة محدودة!",
    linkUrl: "#pricing",
    backgroundColor: "#F59E0B", // Amber
  },
  sideBadge: {
    enabled: true,
    text: "SALE",
    backgroundColor: "#F43F5E", // Rose
  },
  pages: [
    { 
      id: "page-1", 
      title: "عن منظومة", 
      slug: "about", 
      content: "## من نحن؟\nمنظومة هي الشركة الرائدة في تقديم حلول نقاط البيع (POS) وإدارة المخازن السحابية والهجينة في مصر والشرق الأوسط.\n\n## رؤيتنا\nنهدف إلى تمكين التجار وأصحاب المحلات التجارية من إدارة أعمالهم بأعلى دقة ماليّة وأسرع أداء بيعي، وبأقل تكلفة تشغيلية، حتى في حال انقطاع الاتصال بالإنترنت.\n\n## مميزات نظام منظومة المحاسبي\n- **نظام كاشير هجين (Hybrid)** يعمل بالكامل أوفلاين دون الحاجة للإنترنت.\n- **إرسال الفواتير التفاعلية فورياً** عبر تطبيق واتساب لتقليل نفقات الطباعة الورقية.\n- **إدارة ذكية للمخزون** ومصفوفة المقاسات والألوان لمحلات الملابس والأحذية.\n- **نظام العد الأعمى** لإغلاق الورديات Z-Report لمنع العجز المالي والتلاعب.", 
      isPublished: true, 
      showInHeader: false, 
      showInFooter: true, 
      order: 1 
    },
    { 
      id: "page-2", 
      title: "تواصل معنا", 
      slug: "contact", 
      content: "## تواصل معنا\nيسعدنا دائماً تواصلك معنا للاستفسار أو طلب الدعم الفني والمبيعات. فريقنا متواجد لخدمتك على مدار الساعة.\n\n## معلومات الاتصال المباشر\n- **رقم الواتساب والمبيعات:** +201099600048\n- **البريد الإلكتروني:** support@manzoma.online\n- **العنوان الرئيسي:** القاهرة، جمهورية مصر العربية\n\n## أوقات العمل الرسمية\n- **القسم الإداري والمبيعات:** يومياً من الساعة 9:00 صباحاً وحتى 10:00 مساءً.\n- **الدعم الفني والتقني:** متوفر 24/7 طوال أيام الأسبوع لدعم ورديات العمل الليلية.", 
      isPublished: true, 
      showInHeader: false, 
      showInFooter: true, 
      order: 2 
    },
    { 
      id: "page-3", 
      title: "الأسئلة الشائعة", 
      slug: "faq", 
      content: "## الأسئلة الشائعة حول نظام كاشير منظومة\nنوفر لك إجابات سريعة ووافية عن كافة الاستفسارات الشائعة بخصوص إعداد النظام والأسعار وتوافق الأجهزة.\n\n## هل يدعم النظام الفواتير الإلكترونية مصلحة الضرائب؟\nنعم، يتوافق نظام منظومة بالكامل مع المعايير الفنية والمالية الخاصة بمصلحة الضرائب المصرية لدعم منظومة الفاتورة الإلكترونية والإيصال الإلكتروني.\n\n## هل يعمل الكاشير في حال انقطاع الإنترنت؟\nنعم، النظام يعمل بدون إنترنت (Offline-First) بشكل كامل، ويخزن مبيعاتك بأمان على قاعدة بيانات محلية، ثم يقوم بمزامنتها مع السحابة تلقائياً فور عودة الاتصال.\n\n## ما هي الأجهزة المتوافقة مع نظام منظومة؟\n- أجهزة الكمبيوتر واللابتوب التي تعمل بنظام تشغيل Windows.\n- شاشات الكاشير التي تعمل باللمس.\n- طابعات الفواتير الحرارية وأجهزة قراءة الباركود (Barcode Scanners).\n- الموازين الإلكترونية لمتاجر البقالة والتجزئة.", 
      isPublished: true, 
      showInHeader: false, 
      showInFooter: true, 
      order: 3 
    }
  ],
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      theme: "light",
      language: "ar",
      config: defaultConfig,
      packages: defaultPackages,
      subscriptions: defaultSubscriptions,
      // Stats are now fetched from the real API in Overview.tsx
      stats: {
        totalCompanies: 0,
        totalRevenue: 0,
        totalOrders: 0,
        mrrHistory: [],
        averageOrderValue: 0,
      },
      
      // Auth State
      isAuthenticated: false,
      currentUser: null,
      adminUsers: [
        {
          id: "admin-1",
          name: "المدير العام",
          email: "admin@manzoma.com",
          password: "",
          role: "super_admin"
        }
      ],
      
      // Dynamic Calculated Properties
      getCalculatedMRR: () => {
        const { subscriptions, packages } = get();
        return subscriptions
          .filter(sub => sub.status === "active" || sub.status === "past_due")
          .reduce((total, sub) => {
            const pkg = packages.find(p => p.id === sub.packageId);
            if (!pkg) return total;
            // Parse price string to number, remove commas
            const monthlyPrice = parseInt(pkg.price.replace(/,/g, ''), 10);
            const yearlyPriceMonthly = pkg.yearlyPrice ? parseInt(pkg.yearlyPrice.replace(/,/g, ''), 10) : monthlyPrice;
            
            return total + (sub.billingCycle === "yearly" ? yearlyPriceMonthly : monthlyPrice);
          }, 0);
      },
      
      getCalculatedARR: () => {
        return get().getCalculatedMRR() * 12;
      },
      
      getActiveLicensesCount: () => {
        const { subscriptions } = get();
        return subscriptions.filter(sub => sub.status === "active").length;
      },
      
      getChurnRate: () => {
        const { subscriptions } = get();
        const total = subscriptions.length;
        if (total === 0) return 0;
        const churned = subscriptions.filter(sub => sub.status === "expired" || sub.status === "suspended").length;
        // Mock a 3.2% churn rate realistically, or calculate if we have historical data
        return Number(((churned / total) * 100).toFixed(1)); 
      },

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      updateConfig: (updater) => set((state) => {
        const newConfig = updater(state.config);
        
        // Sync to backend asynchronously
        const payload = {
          hero: newConfig.hero,
          features: newConfig.features,
          testimonials: [],
          appearance: {
            siteName: newConfig.siteName,
            logoUrl: newConfig.logoUrl,
            iconUrl: newConfig.iconUrl,
            patternUrl: newConfig.patternUrl,
            primaryColor: newConfig.primaryColor,
            navyColor: newConfig.navyColor,
            emeraldColor: newConfig.emeraldColor,
            designTokens: newConfig.designTokens,
            marqueeConfig: newConfig.marqueeConfig,
            marqueeItems: newConfig.marqueeItems,
            promoBar: newConfig.promoBar,
            sideBadge: newConfig.sideBadge,
          },
          pricing: {
            trialDays: newConfig.trialDays,
          },
          seo: {},
          socialLinks: newConfig.socialLinks,
        };
        
        updatePublicConfig(payload).catch(e => console.error('Failed to sync CMS config to backend', e));
        
        return { config: newConfig };
      }),
      updatePackages: (packages) => set({ packages }),
      updateSubscriptions: (subscriptions) => set({ subscriptions }),
      updateStats: (newStats) => set((state) => ({ stats: { ...state.stats, ...newStats } })),
      
      initializeCMSData: async () => {
        try {
          const [data, pages] = await Promise.all([
            fetchPublicConfig(),
            fetchPublicPages().catch(() => [])
          ]);
          
          if (data && Object.keys(data).length > 0) {
            set((state) => {
              const app = data.appearance || {};
              const pricing = data.pricing || {};
              const mergedConfig = {
                ...state.config,
                hero: data.hero && data.hero.titleLine1 ? data.hero : state.config.hero,
                features: data.features && data.features.length ? data.features : state.config.features,
                socialLinks: data.socialLinks && data.socialLinks.length ? data.socialLinks : state.config.socialLinks,
                
                // Unpack appearance
                siteName: app.siteName || state.config.siteName,
                logoUrl: app.logoUrl || state.config.logoUrl,
                iconUrl: app.iconUrl || state.config.iconUrl,
                patternUrl: app.patternUrl || state.config.patternUrl,
                primaryColor: app.primaryColor || state.config.primaryColor,
                navyColor: app.navyColor || state.config.navyColor,
                emeraldColor: app.emeraldColor || state.config.emeraldColor,
                designTokens: app.designTokens || state.config.designTokens,
                marqueeConfig: app.marqueeConfig || state.config.marqueeConfig,
                marqueeItems: app.marqueeItems || state.config.marqueeItems,
                promoBar: app.promoBar || state.config.promoBar,
                sideBadge: app.sideBadge || state.config.sideBadge,
                
                // Unpack pricing
                trialDays: pricing.trialDays || state.config.trialDays,
                
                // Pages from API
                pages: pages && pages.length > 0 ? pages : state.config.pages,
              };
              return { config: mergedConfig };
            });
          }
        } catch (e) {
          console.error("Error loading CMS data from backend:", e);
        }
      },

      // Auth Actions
      login: (email, password) => {
        const users = get().adminUsers;
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ isAuthenticated: true, currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, currentUser: null }),
      addAdmin: (user) => set((state) => ({ adminUsers: [...state.adminUsers, user] })),
      removeAdmin: (id) => set((state) => ({ adminUsers: state.adminUsers.filter(u => u.id !== id) })),
      updateAdmin: (id, userUpdates) => set((state) => ({
        adminUsers: state.adminUsers.map(u => u.id === id ? { ...u, ...userUpdates } : u)
      })),

      // Advanced SaaS Actions
      generateLicenseKey: (subscriptionId) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === subscriptionId ? { ...sub, licenseKey: generateKey() } : sub
          ),
        }));
      },
      
      revokeHWID: (subscriptionId) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === subscriptionId ? { ...sub, hwid: null } : sub
          ),
        }));
      },
      
      suspendSubscription: (subscriptionId) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === subscriptionId ? { ...sub, status: "suspended" } : sub
          ),
        }));
      },

    }),
    {
      name: "manzoma-admin-storage-v8",
    }
  )
);
