import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  priceSuffix: string;
  features: string[];
  isPopular: boolean;
  visible: boolean;
}

export interface Stat {
  q: string;
  l: string;
  color: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  isNew?: boolean;
}

export interface SiteConfig {
  siteName: string;
  logoUrl?: string;
  iconUrl?: string;
  patternUrl?: string;
  primaryColor: string;
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaText: string;
  };
  stats: Stat[];
  headerLinks: LinkItem[];
  footerSections: {
    title: string;
    links: LinkItem[];
  }[];
}

export interface Subscription {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  packageId: string;
  status: "active" | "expired" | "trial";
  startDate: string;
}

interface AdminState {
  config: SiteConfig;
  packages: Package[];
  subscriptions: Subscription[];
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  updatePackages: (packages: Package[]) => void;
  updateSubscriptions: (subs: Subscription[]) => void;
}

const defaultPackages: Package[] = [
  {
    id: "p1",
    name: "الباقة الأساسية",
    description: "مثالية للمتاجر الناشئة ونقاط البيع الفردية.",
    price: "مجاناً",
    priceSuffix: "للأبد",
    features: [
      "نقطة بيع واحدة (POS)",
      "إدارة مخزون مبسطة لـ 500 صنف",
      "فواتير رقمية عبر الواتساب",
      "تقارير مبيعات يومية أساسية",
      "دعم فني عبر البريد الإلكتروني",
    ],
    isPopular: false,
    visible: true,
  },
  {
    id: "p2",
    name: "الباقة الاحترافية",
    description: "للشركات والمطاعم ذات الفروع المتعددة.",
    price: "199",
    priceSuffix: "ر.س / شهرياً",
    features: [
      "نقاط بيع غير محدودة",
      "إدارة مخزون متقدمة وتصنيع (BOM)",
      "مزامنة فورية مع المتاجر الإلكترونية",
      "ربط مع بوابات الدفع وشركات الشحن",
      "دعم فني 24/7 عبر الواتساب والاتصال",
      "تقارير محاسبية مفصلة وقيود يومية",
    ],
    isPopular: true,
    visible: true,
  },
];

const defaultSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    storeName: "متجر الهناء",
    ownerName: "أحمد محمود",
    email: "ahmad@example.com",
    packageId: "p2",
    status: "active",
    startDate: "2026-01-15",
  },
  {
    id: "sub-2",
    storeName: "قهوة مختصة",
    ownerName: "سارة خالد",
    email: "sara@example.com",
    packageId: "p1",
    status: "trial",
    startDate: "2026-04-20",
  },
];

const defaultConfig: SiteConfig = {
  siteName: "منظومة",
  logoUrl: "/logo.png",
  iconUrl: "/icon.png",
  patternUrl: "/pattern.png",
  primaryColor: "blue", // Could use hex codes, but we'll stick to tailwind logic or CSS vars
  hero: {
    titleLine1: "نظام يمنع السرقات ويسرع",
    titleLine2: "عملية البيع.",
    subtitle:
      "حوّل فوضى المبيعات إلى سيطرة مطلقة. أنشئ نظامك المحاسبي ونقاط البيع الخاصة بك مجانًا وفي دقائق، بلا تعقيد، مع دعم متواصل لزيادة مبيعاتك.",
    ctaText: "أنشئ نظامك الآن",
  },
  stats: [
    { q: "+300,000", l: "عملية بيع يومياً", color: "blue" },
    { q: "+15,000", l: "نقطة بيع نشطة", color: "teal" },
    { q: "99.99%", l: "وقت التشغيل الفعلي", color: "slate-900" },
    { q: "24/7", l: "دعم فني جاهز لخدمتك", color: "slate-500" },
  ],
  headerLinks: [
    { id: "l1", label: "مزايا المنظومة", url: "#" },
    { id: "l2", label: "نقاط البيع والمخزون", url: "#" },
    { id: "l3", label: "التكامل والربط", url: "#" },
    { id: "l4", label: "الأسعار", url: "#" },
    { id: "l5", label: "الأكاديمية", url: "#", isNew: true },
  ],
  footerSections: [
    {
      title: "المنتج",
      links: [
        { id: "f1", label: "نقاط البيع", url: "#" },
        { id: "f2", label: "إدارة المخزون", url: "#" },
        { id: "f3", label: "التصنيع (BOM)", url: "#" },
        { id: "f4", label: "التقارير المالية", url: "#" },
      ],
    },
    {
      title: "الشركة",
      links: [
        { id: "c1", label: "من نحن", url: "#" },
        { id: "c2", label: "الأسعار", url: "#" },
        { id: "c3", label: "المدونة", url: "#" },
        { id: "c4", label: "الوظائف", url: "#" },
      ],
    },
  ],
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      packages: defaultPackages,
      subscriptions: defaultSubscriptions,
      updateConfig: (updater) =>
        set((state) => ({ config: updater(state.config) })),
      updatePackages: (packages) => set({ packages }),
      updateSubscriptions: (subscriptions) => set({ subscriptions }),
    }),
    {
      name: "admin-store",
    },
  ),
);
