import React, { useState, useEffect } from "react";
import {
  Search, Plus, Store, User, Key, MonitorSmartphone, MoreVertical,
  RefreshCw, PowerOff, ChevronDown, Copy, Eye, Shield, X, Loader2,
  Building2, Package, ShoppingCart, Users as UsersIcon, AlertTriangle, Database, Calendar,
  Sliders, Cloud, MessageSquare, Factory, FileSpreadsheet, CheckCircle2,
  Tag, WifiOff, SlidersHorizontal, Zap, Radio, Layers, Boxes, Network,
  ExternalLink, Sparkles, Activity, CheckCircle, Wifi, Laptop, ArrowUpRight
} from "lucide-react";
import {
  fetchCompanies, createCompany, updateCompanyStatus,
  generateLicense, revokeLicense, impersonateCompany,
  downloadCompanyBackup, updateSubscriptionAdvanced,
  updateCompanyFeatures, updateCompanyQuotas, fetchCompanyBranches,
  type CompanyFromAPI, type BranchTelemetry
} from "../../lib/apiService";

type ModalState = null | "create" | "license" | "editSubscription" | "features" | "branches";

export default function ClientsManager() {
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchTypeFilter, setBranchTypeFilter] = useState<"all" | "single" | "multi">("all");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Subscription & Quotas Form
  const [subForm, setSubForm] = useState({ 
    planName: "", 
    endsAt: "",
    maxBranches: 1,
    maxWarehouses: 1,
    maxPosTerminals: 1,
    maxUsers: 5
  });

  // License Generator Form
  const [licenseForm, setLicenseForm] = useState({ 
    planName: "BASIC", 
    durationMonths: 12, 
    hwid: "", 
    generatedKey: null as string | null 
  });

  // Features Form
  const [featuresForm, setFeaturesForm] = useState({
    cloudSync: true,
    whatsapp: false,
    manufacturing: false,
    multiBranch: false,
    accounting: true,
    credit: true,
    promotions: true,
    excel: true,
    mcp: false
  });

  // Form state for creating new client
  const [form, setForm] = useState({
    name: "", 
    adminEmail: "", 
    phone: "", 
    planName: "BASIC",
    adminFullName: "", 
    adminUsername: "", 
    adminPassword: "",
    maxBranches: 1,
    maxWarehouses: 1,
    maxPosTerminals: 1,
    maxUsers: 5,
    cloudSync: true, 
    whatsapp: false, 
    manufacturing: false, 
    multiBranch: false
  });

  // Branch Live Telemetry Modal State
  const [selectedCompanyForBranches, setSelectedCompanyForBranches] = useState<CompanyFromAPI | null>(null);
  const [branchesList, setBranchesList] = useState<BranchTelemetry[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
    const handleClick = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const safeCompanies = Array.isArray(companies) ? companies : [];
  const filtered = safeCompanies.filter((c) => {
    if (!c) return false;
    const q = search.toLowerCase();
    const matchSearch = !search || (c.name && c.name.toLowerCase().includes(q)) ||
      (c.adminEmail && c.adminEmail.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q));
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "active" && c.isActive) ||
      (statusFilter === "suspended" && !c.isActive);
    const maxB = c.maxBranches || 1;
    const matchBranchType = branchTypeFilter === "all" ||
      (branchTypeFilter === "single" && maxB === 1) ||
      (branchTypeFilter === "multi" && maxB > 1);

    return matchSearch && matchStatus && matchBranchType;
  });

  // Quick Upgrade Helper: Sets quotas to 3 branches, 3 warehouses, 5 terminals and activates MULTI_BRANCH
  const applyMultiBranchPreset = (target: "create" | "edit") => {
    if (target === "create") {
      setForm(prev => ({
        ...prev,
        maxBranches: 3,
        maxWarehouses: 3,
        maxPosTerminals: 5,
        maxUsers: 10,
        multiBranch: true,
        planName: "PREMIUM"
      }));
      showToast("⚡ تم تطبيق باقة سلاسل الفروع (3 فروع + 3 مخازن + تفعيل موديول الفروع)!");
    } else {
      setSubForm(prev => ({
        ...prev,
        maxBranches: Math.max(prev.maxBranches || 1, 3),
        maxWarehouses: Math.max(prev.maxWarehouses || 1, 3),
        maxPosTerminals: Math.max(prev.maxPosTerminals || 1, 5),
        maxUsers: Math.max(prev.maxUsers || 5, 10),
        planName: ["ENTERPRISE", "LIFETIME"].includes(prev.planName?.toUpperCase()) ? prev.planName : "PREMIUM"
      }));
      showToast("⚡ تم ضبط الحصص لسلاسل الفروع (3 فروع + 3 مخازن + 5 كاشير على الأقل)!");
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.adminUsername || !form.adminPassword) return;
    setActionLoading(true);
    try {
      const res = await createCompany({
        name: form.name,
        adminEmail: form.adminEmail,
        phone: form.phone,
        planName: form.planName,
        adminFullName: form.adminFullName,
        adminUsername: form.adminUsername,
        adminPassword: form.adminPassword,
        maxBranches: form.maxBranches,
        maxWarehouses: form.maxWarehouses,
        maxPosTerminals: form.maxPosTerminals,
        maxUsers: form.maxUsers
      });

      if (res?.companyId) {
        const enabledModules = ["POS", "INVENTORY", "BASIC_SALES"];
        if (form.cloudSync) enabledModules.push("CLOUD_SYNC");
        if (form.whatsapp) enabledModules.push("WHATSAPP");
        if (form.manufacturing) enabledModules.push("MANUFACTURING_V2", "WORKSHOP_PRO");
        if (form.multiBranch || form.maxBranches > 1) enabledModules.push("MULTI_BRANCH");
        enabledModules.push("ACCOUNTING", "CREDIT", "PROMOTIONS", "EXCEL");

        await updateCompanyFeatures(res.companyId, {
          cloudSync: form.cloudSync,
          whatsapp: form.whatsapp,
          manufacturing: form.manufacturing,
          multiBranch: form.multiBranch || form.maxBranches > 1,
          accounting: true,
          credit: true,
          promotions: true,
          excel: true
        }, enabledModules);
      }

      showToast(`تم إنشاء "${form.name}" بنجاح وتعيين الحصص والميزات ✅`);
      setModal(null);
      setForm({
        name: "", 
        adminEmail: "", 
        phone: "", 
        planName: "BASIC",
        adminFullName: "", 
        adminUsername: "", 
        adminPassword: "",
        maxBranches: 1,
        maxWarehouses: 1,
        maxPosTerminals: 1,
        maxUsers: 5,
        cloudSync: true, 
        whatsapp: false, 
        manufacturing: false, 
        multiBranch: false
      });
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (company: CompanyFromAPI) => {
    const newStatus = company.isActive ? "SUSPENDED" : "ACTIVE";
    setActionLoading(true);
    try {
      await updateCompanyStatus(company.id, newStatus);
      showToast(`تم ${newStatus === "ACTIVE" ? "تفعيل" : "تعليق"} "${company.name}" ✅`);
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const openLicenseModal = (company: CompanyFromAPI) => {
    setSelectedCompanyId(company.id);
    setLicenseForm({
      planName: company.planName || "BASIC",
      durationMonths: 12,
      hwid: "",
      generatedKey: null
    });
    setModal("license");
    setOpenDropdownId(null);
  };

  const handleGenerateLicense = async () => {
    if (!selectedCompanyId) return;
    setActionLoading(true);
    try {
      const result = await generateLicense(
        selectedCompanyId, 
        licenseForm.planName, 
        Number(licenseForm.durationMonths), 
        licenseForm.hwid
      );
      setLicenseForm(prev => ({ ...prev, generatedKey: result.serialKey }));
      showToast(`تم توليد ترخيص: ${result.serialKey} ✅`);
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeLicense = async (licenseId: string) => {
    setActionLoading(true);
    try {
      await revokeLicense(licenseId);
      showToast("تم إلغاء الترخيص ✅");
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleDownloadBackup = async (companyId: string, companyName: string) => {
    setActionLoading(true);
    try {
      showToast("جاري تجهيز وتحميل النسخة الاحتياطية...");
      await downloadCompanyBackup(companyId, companyName);
      showToast("تم تنزيل نسخة الاحتياط ✅");
    } catch (err: any) {
      showToast(`فشل التحميل: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleImpersonate = async (companyId: string) => {
    setActionLoading(true);
    try {
      const result = await impersonateCompany(companyId);
      const appUrl = `https://app.manzoma.online/#/login?impersonate=${result.token}`;
      window.open(appUrl, "_blank");
      showToast(`تم فتح حساب "${result.companyName}" في تبويب جديد`);
    } catch (err: any) {
      showToast(`خطأ في المحاكاة: ${err.message}`);
    } finally {
      setActionLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleUpdateSubscriptionAndQuotas = async () => {
    if (!selectedCompanyId) return;
    setActionLoading(true);
    try {
      // 1. Update Subscription Date & Tier
      await updateSubscriptionAdvanced(selectedCompanyId, {
        planName: subForm.planName,
        subscriptionEndsAt: subForm.endsAt
      });

      // 2. Update Resource Quotas
      await updateCompanyQuotas(selectedCompanyId, {
        maxBranches: Number(subForm.maxBranches) || 1,
        maxWarehouses: Number(subForm.maxWarehouses) || 1,
        maxPosTerminals: Number(subForm.maxPosTerminals) || 1,
        maxUsers: Number(subForm.maxUsers) || 5
      });

      // 3. Auto-enable Multi-Branch module if maxBranches > 1 without stripping existing modules
      if (Number(subForm.maxBranches) > 1) {
        const company = companies.find(c => c.id === selectedCompanyId);
        if (company) {
          const currentFeat = getCompanyFeatures(company);
          currentFeat.multiBranch = true;
          const enabledModules = ["POS", "INVENTORY", "BASIC_SALES", "MULTI_BRANCH"];
          if (currentFeat.cloudSync) enabledModules.push("CLOUD_SYNC");
          if (currentFeat.whatsapp) enabledModules.push("WHATSAPP");
          if (currentFeat.manufacturing) enabledModules.push("MANUFACTURING_V2");
          if (currentFeat.accounting) enabledModules.push("ACCOUNTING");
          if (currentFeat.credit) enabledModules.push("CREDIT");
          if (currentFeat.promotions) enabledModules.push("PROMOTIONS");
          if (currentFeat.excel) enabledModules.push("EXCEL");
          await updateCompanyFeatures(selectedCompanyId, currentFeat, enabledModules);
        }
      }

      showToast("تم تحديث مدة الاشتراك والحصص الرقمية بنجاح ✅");
      setModal(null);
      await loadCompanies();
    } catch (err: any) {
      showToast(`خطأ: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditSubModal = (company: CompanyFromAPI) => {
    setSelectedCompanyId(company.id);
    setSubForm({
      planName: company.planName || "BASIC",
      endsAt: company.subscriptionEndsAt && !isNaN(new Date(company.subscriptionEndsAt).getTime())
        ? new Date(company.subscriptionEndsAt).toISOString().slice(0, 16)
        : "",
      maxBranches: company.maxBranches || 1,
      maxWarehouses: company.maxWarehouses || 1,
      maxPosTerminals: company.maxPosTerminals || 1,
      maxUsers: company.maxUsers || 5
    });
    setModal("editSubscription");
    setOpenDropdownId(null);
  };

  // Branch Live Telemetry Modal Handler
  const openBranchesModal = async (company: CompanyFromAPI) => {
    setSelectedCompanyId(company.id);
    setSelectedCompanyForBranches(company);
    setBranchesList([]);
    setLoadingBranches(true);
    setModal("branches");
    setOpenDropdownId(null);

    try {
      const data = await fetchCompanyBranches(company.id);
      setBranchesList(data);
    } catch (err: any) {
      // Fallback: construct default main branch from company stats if API fails
      setBranchesList([
        {
          id: "br-main",
          name: "الفرع الرئيسي",
          code: "BR-01",
          isHq: true,
          isActive: true,
          usersCount: company._count?.users ?? 1,
          warehouses: [{ id: "wh-main", name: "المخزن الرئيسي" }],
          warehousesCount: 1,
          status: "ONLINE",
          lastSyncAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoadingBranches(false);
    }
  };

  const getCompanyFeatures = (company: CompanyFromAPI) => {
    let feat: any = {};
    if (company.features) {
      try {
        feat = typeof company.features === "string" ? JSON.parse(company.features) : company.features;
      } catch {}
    }
    let mods: string[] = [];
    if (company.enabledModules) {
      try {
        mods = typeof company.enabledModules === "string" ? JSON.parse(company.enabledModules) : company.enabledModules;
      } catch {}
    }

    const isAll = feat.all === true || feat["*"] === true || mods.includes("ALL");
    const isProOrAbove = ["PRO", "PREMIUM", "ENTERPRISE", "LIFETIME"].includes((company.planName || "").toUpperCase());

    return {
      cloudSync: feat.cloudSync !== undefined ? !!feat.cloudSync : (isAll || isProOrAbove || mods.length === 0 || mods.includes("CLOUD_SYNC")),
      whatsapp: feat.whatsapp !== undefined ? !!feat.whatsapp : (isAll || isProOrAbove || mods.includes("WHATSAPP")),
      manufacturing: feat.manufacturing !== undefined ? !!feat.manufacturing : (isAll || mods.includes("MANUFACTURING_V2")),
      multiBranch: feat.multiBranch !== undefined ? !!feat.multiBranch : (isAll || mods.includes("MULTI_BRANCH") || (company.maxBranches && company.maxBranches > 1)),
      accounting: feat.accounting !== undefined ? !!feat.accounting : (isAll || mods.length === 0 || mods.includes("ACCOUNTING")),
      credit: feat.credit !== undefined ? !!feat.credit : (isAll || mods.length === 0 || mods.includes("CREDIT")),
      promotions: feat.promotions !== undefined ? !!feat.promotions : (isAll || isProOrAbove || mods.length === 0 || mods.includes("PROMOTIONS")),
      excel: feat.excel !== undefined ? !!feat.excel : (isAll || isProOrAbove || mods.length === 0 || mods.includes("EXCEL")),
      mcp: feat.mcp !== undefined ? !!feat.mcp : (isAll || ["ENTERPRISE", "LIFETIME"].includes((company.planName || "").toUpperCase()) || mods.includes("MCP")),
    };
  };

  const openFeaturesModal = (company: CompanyFromAPI) => {
    setSelectedCompanyId(company.id);
    const feat = getCompanyFeatures(company);
    setFeaturesForm(feat);
    setModal("features");
    setOpenDropdownId(null);
  };

  const handleSaveFeatures = async () => {
    if (!selectedCompanyId) return;
    setActionLoading(true);
    try {
      const enabledModules = ["POS", "INVENTORY", "BASIC_SALES"];
      if (featuresForm.cloudSync) enabledModules.push("CLOUD_SYNC");
      if (featuresForm.whatsapp) enabledModules.push("WHATSAPP");
      if (featuresForm.manufacturing) enabledModules.push("MANUFACTURING_V2", "WORKSHOP_PRO");
      if (featuresForm.multiBranch) enabledModules.push("MULTI_BRANCH");
      if (featuresForm.accounting) enabledModules.push("ACCOUNTING");
      if (featuresForm.credit) enabledModules.push("CREDIT");
      if (featuresForm.promotions) enabledModules.push("PROMOTIONS");
      if (featuresForm.excel) enabledModules.push("EXCEL");
      if ((featuresForm as any).mcp) enabledModules.push("MCP");

      await updateCompanyFeatures(selectedCompanyId, featuresForm, enabledModules);
      showToast("تم تحديث ميزات وصلاحيات الشركة بنجاح ✅");
      setModal(null);
      await loadCompanies();
    } catch (err: any) {
      showToast(`فشل حفظ الميزات: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (isActive: boolean, status: string) => {
    const active = isActive && status === "ACTIVE";
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1.5 border shadow-xs ${
        active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
        {active ? "نشط" : "موقوف"}
      </span>
    );
  };

  // Quota Utilization Progress Bar Widget
  const QuotaProgressBar = ({
    current,
    max,
    label,
    icon: IconComponent,
    color
  }: {
    current: number;
    max: number;
    label: string;
    icon: any;
    color: "indigo" | "amber" | "emerald" | "purple";
  }) => {
    const isUnlimited = max >= 999;
    const ratio = isUnlimited ? 0 : Math.min(100, Math.round((current / (max || 1)) * 100));
    const isFull = !isUnlimited && current >= max;
    const isWarning = !isUnlimited && ratio >= 75 && !isFull;

    // Progress bar color based on utilization
    let barColor = "bg-indigo-600";
    if (color === "amber") barColor = "bg-amber-500";
    if (color === "emerald") barColor = "bg-emerald-500";
    if (color === "purple") barColor = "bg-purple-600";
    if (isWarning) barColor = "bg-amber-500";
    if (isFull) barColor = "bg-rose-500";

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="flex items-center gap-1 text-slate-600">
            <IconComponent className="w-3 h-3 text-slate-400" />
            {label}
          </span>
          <span className={`font-mono font-black ${isFull ? "text-rose-600" : isWarning ? "text-amber-600" : "text-slate-900"}`}>
            {current} / {isUnlimited ? "∞" : max}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor} ${isFull ? "animate-pulse" : ""}`}
            style={{ width: `${isUnlimited ? (current > 0 ? 30 : 0) : Math.max(8, ratio)}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4" dir="rtl">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-600 font-black text-sm">جاري تحميل بيانات منظومة العملاء والحصص السحابية...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4" dir="rtl">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <p className="text-slate-900 font-black text-lg">فشل الاتصال بالسيرفر المركزي</p>
        <p className="text-slate-500 text-sm font-bold">{error}</p>
        <button onClick={loadCompanies} className="bg-indigo-600 text-white px-7 py-3 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-600/20">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Top Aggregates
  const totalCompaniesCount = safeCompanies.length;
  const multiBranchCount = safeCompanies.filter(c => (c.maxBranches || 1) > 1).length;
  const singleStoreCount = safeCompanies.filter(c => (c.maxBranches || 1) === 1).length;
  const totalActiveBranches = safeCompanies.reduce((acc, c) => acc + (c._count?.branches || 1), 0);

  return (
    <div className="space-y-6 pb-24" dir="rtl">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-black text-sm border border-slate-700 backdrop-blur-md flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Telemetry Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">إجمالي المشتركين</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCompaniesCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">سلاسل تجارية متعددة الفروع</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{multiBranchCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Network className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">متاجر فردية بسيطة</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{singleStoreCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">إجمالي الفروع المفتوحة</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{totalActiveBranches}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">إدارة العملاء والحصص السحابية</h1>
          <p className="text-xs font-bold text-slate-500 mt-1">
            مراقبة استهلاك الفروع والمخازن ونقاط البيع مع رادار مباشر لكل عميل
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadCompanies} 
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-xs"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setModal("create")} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عميل جديد</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[260px] max-w-sm">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="بحث بالاسم، البريد، أو الهاتف..."
            className="bg-white border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-full transition-all shadow-xs" 
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3 pr-10 text-xs font-bold text-slate-900 outline-none cursor-pointer shadow-xs"
          >
            <option value="all">كل الحالات (نشط وموقوف)</option>
            <option value="active">العملاء النشطون فقط</option>
            <option value="suspended">الموقوفون فقط</option>
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Branch Tier Filter */}
        <div className="relative">
          <select 
            value={branchTypeFilter} 
            onChange={(e) => setBranchTypeFilter(e.target.value as any)}
            className="appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3 pr-10 text-xs font-bold text-slate-900 outline-none cursor-pointer shadow-xs"
          >
            <option value="all">كل الهياكل التجارية</option>
            <option value="single">🟢 متاجر فردية بسيطة (1 فرع)</option>
            <option value="multi">🏢 سلاسل متعددة الفروع (&gt; 1 فرع)</option>
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider">
                <th className="px-6 py-4 text-right">الشركة / النشاط</th>
                <th className="px-6 py-4 text-right">تصنيف المتجر والحصص (Quotas)</th>
                <th className="px-6 py-4 text-right">البيانات والإحصائيات</th>
                <th className="px-6 py-4 text-right">الترخيص والجهاز</th>
                <th className="px-6 py-4 text-right">حالة الاشتراك</th>
                <th className="px-6 py-4 text-right bg-indigo-50/30 text-indigo-700">الميزات والوحدات</th>
                <th className="px-6 py-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((company) => {
                const license = company.licenses?.[0];
                const maxB = company.maxBranches || 1;
                const isMultiBranch = maxB > 1;
                const branchesCount = company._count?.branches ?? 0;
                const warehousesCount = company._count?.warehouses ?? 0;
                const posTerminalsCount = company.licenses?.filter(l => l.isActive).length ?? 0;

                return (
                  <tr key={company.id} className={`transition-colors group ${!company.isActive ? "bg-rose-50/20" : "hover:bg-slate-50/50"}`}>
                    
                    {/* Company Info */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isMultiBranch ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                        }`}>
                          {isMultiBranch ? <Building2 className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-tight">{company.name}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1">{company.adminEmail || company.phone || "—"}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                              {company.planName}
                            </span>
                            {/* Branch Live Telemetry Quick Pill */}
                            <button
                              onClick={() => openBranchesModal(company)}
                              className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                              title="استعراض فروع العميل ورادار الاتصال"
                            >
                              <Activity className="w-2.5 h-2.5 text-indigo-600" />
                              <span>رادار الفروع ({branchesCount})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quota Utilization & Tier Badges */}
                    <td className="px-6 py-5 align-top min-w-[240px]">
                      <div className="space-y-3">
                        {/* Distinctive Tier Badge */}
                        <div>
                          {isMultiBranch ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
                              <Network className="w-3.5 h-3.5 text-indigo-600" />
                              <span>🏢 سلسلة تجارية ({maxB} فروع)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>🟢 متجر فردي بسيط</span>
                            </span>
                          )}
                        </div>

                        {/* Quota Progress Bars */}
                        <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                          {/* Branches Quota */}
                          <QuotaProgressBar
                            current={branchesCount}
                            max={maxB}
                            label="الفروع"
                            icon={Store}
                            color="indigo"
                          />

                          {/* Warehouses Quota */}
                          <QuotaProgressBar
                            current={warehousesCount}
                            max={company.maxWarehouses || 1}
                            label="المخازن"
                            icon={Boxes}
                            color="amber"
                          />

                          {/* POS Terminals Quota */}
                          <QuotaProgressBar
                            current={posTerminalsCount}
                            max={company.maxPosTerminals || 1}
                            label="نقاط البيع"
                            icon={MonitorSmartphone}
                            color="emerald"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-5 align-top">
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                          <UsersIcon className="w-3 h-3 text-slate-400" />
                          {company._count?.users ?? 0} مستخدم
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                          <Package className="w-3 h-3 text-slate-400" />
                          {company._count?.products ?? 0} صنف
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                          <Store className="w-3 h-3 text-slate-400" />
                          {company._count?.branches ?? 0} فرع
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                          <ShoppingCart className="w-3 h-3 text-slate-400" />
                          {company._count?.orders ?? 0} فاتورة
                        </span>
                      </div>
                    </td>

                    {/* License */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col gap-1.5">
                        {license ? (
                          <>
                            <div className="flex items-center gap-1.5 text-xs font-mono font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 w-fit">
                              <Key className="w-3 h-3 text-slate-400" />
                              {license.serialKey}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              <MonitorSmartphone className="w-3.5 h-3.5 text-slate-400" />
                              {license.hwid ? (
                                <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1 text-[11px]">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                  مربوط بجهاز
                                </span>
                              ) : (
                                <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                                  غير مربوط
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <button 
                            onClick={() => { setSelectedCompanyId(company.id); setModal("license"); }}
                            className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl w-max hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
                          >
                            إصدار ترخيص جديد
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status & Expiry */}
                    <td className="px-6 py-5 align-top">
                      <div className="space-y-1">
                        <div>{statusBadge(company.isActive, company.status)}</div>
                        {company.subscriptionEndsAt ? (
                          <p className="text-[10px] font-bold text-slate-400">
                            ينتهي: {new Date(company.subscriptionEndsAt).toLocaleDateString("ar-EG")}
                          </p>
                        ) : (
                          <p className="text-[10px] font-bold text-slate-400">بدون تاريخ انتهاء</p>
                        )}
                      </div>
                    </td>

                    {/* Features & Modules */}
                    <td className="px-6 py-5 align-top bg-indigo-50/15">
                      {(() => {
                        const feat = getCompanyFeatures(company);
                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-1 max-w-[210px]">
                              {feat.cloudSync ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Cloud className="w-3 h-3 text-emerald-600" /> سحابي
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                  <WifiOff className="w-3 h-3 text-amber-700" /> أوفلاين 100%
                                </span>
                              )}
                              {feat.multiBranch && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                  <Store className="w-2.5 h-2.5 text-purple-600" /> فروع
                                </span>
                              )}
                              {feat.whatsapp && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                                  <MessageSquare className="w-2.5 h-2.5 text-green-600" /> واتساب
                                </span>
                              )}
                              {feat.manufacturing && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  <Factory className="w-2.5 h-2.5 text-blue-600" /> تصنيع
                                </span>
                              )}
                              {(feat as any).mcp && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
                                  <Sparkles className="w-2.5 h-2.5 text-purple-600" /> MCP ذكاء
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openFeaturesModal(company);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-xs shadow-indigo-600/20 active:scale-95 w-fit"
                            >
                              <Sliders className="w-3 h-3" />
                              تخصيص الميزات
                            </button>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6 py-5 align-top text-left relative">
                      <div className="relative">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setOpenDropdownId(openDropdownId === company.id ? null : company.id); 
                          }}
                          className={`p-2.5 rounded-2xl transition-all ${
                            openDropdownId === company.id 
                              ? "bg-slate-900 text-white shadow-md" 
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openDropdownId === company.id && (
                          <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 py-1.5 flex flex-col text-right animate-in fade-in zoom-in-95 duration-150">
                            
                            {/* Branch Radar Option */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); openBranchesModal(company); }}
                              className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-black text-indigo-600 hover:bg-indigo-50 w-full"
                            >
                              رادار الفروع المتصلة <Activity className="w-4 h-4 text-indigo-600" />
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleImpersonate(company.id); }}
                              className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 w-full"
                            >
                              محاكاة الدخول <Eye className="w-4 h-4 text-slate-400" />
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDownloadBackup(company.id, company.name); }}
                              className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 w-full"
                            >
                              نسخة احتياطية للعميل <Database className="w-4 h-4 text-slate-400" />
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); openEditSubModal(company); }}
                              className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 w-full"
                            >
                              تعديل الاشتراك والحصص <Calendar className="w-4 h-4 text-slate-400" />
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); openFeaturesModal(company); }}
                              className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 w-full"
                            >
                              إدارة الميزات والصلاحيات <Sliders className="w-4 h-4 text-slate-400" />
                            </button>

                            {license && (
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  navigator.clipboard.writeText(license.serialKey); 
                                  showToast("تم نسخ مفتاح التفعيل بنجاح ✅"); 
                                  setOpenDropdownId(null); 
                                }}
                                className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 w-full"
                              >
                                نسخ مفتاح التفعيل <Copy className="w-4 h-4 text-slate-400" />
                              </button>
                            )}

                            <button 
                              onClick={(e) => { e.stopPropagation(); openLicenseModal(company); }}
                              className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 w-full"
                            >
                              إصدار ترخيص / ربط جهاز <Key className="w-4 h-4 text-slate-400" />
                            </button>

                            {license && license.hwid && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRevokeLicense(license.id); }}
                                className="flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50 w-full"
                              >
                                تصفير ربط الجهاز (HWID) <RefreshCw className="w-4 h-4" />
                              </button>
                            )}

                            <div className="h-px bg-slate-100 my-1 mx-2" />

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleToggleStatus(company); }}
                              className={`flex items-center justify-end gap-2.5 px-4 py-2.5 text-xs font-bold w-full ${
                                company.isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                            >
                              {company.isActive ? "إيقاف الخدمة" : "إعادة التفعيل"}
                              {company.isActive ? <PowerOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <p className="text-slate-400 font-black text-sm">لا توجد نتائج مطابقة لبحثك</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 🚀 CREATE CLIENT MODAL (UPGRADED WITH QUOTAS & PRESET) */}
      {/* ═══════════════════════════════════════════════════════ */}
      {modal === "create" && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-5 left-5 p-2 rounded-xl hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">إضافة عميل جديد</h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5">تحديد بيانات المشترك وحصصه الرقمية في السحابة</p>
              </div>

              {/* Quick Multi-Branch Preset Button */}
              <button
                type="button"
                onClick={() => applyMultiBranchPreset("create")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 hover:opacity-95 transition-all flex items-center gap-1.5 active:scale-95"
                title="يضبط الحصص لـ 3 فروع و 3 مخازن ويفعل موديول الفروع تلقائياً"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>ترقية إلى سلاسل الفروع</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">اسم الشركة / المتجر *</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                  placeholder="مثال: سلسلة فروع أسواق النور" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">اسم المدير المسؤول</label>
                  <input 
                    value={form.adminFullName} 
                    onChange={(e) => setForm(f => ({ ...f, adminFullName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    placeholder="أحمد محمد" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">البريد الإلكتروني</label>
                  <input 
                    value={form.adminEmail} 
                    onChange={(e) => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    placeholder="admin@example.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">رقم الهاتف</label>
                  <input 
                    value={form.phone} 
                    onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    placeholder="01001234567" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">باقة الاشتراك</label>
                  <select 
                    value={form.planName} 
                    onChange={(e) => setForm(f => ({ ...f, planName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black outline-none cursor-pointer bg-slate-50"
                  >
                    <option value="BASIC">أساسية (BASIC - متجر فردي)</option>
                    <option value="PREMIUM">احترافية (PREMIUM - فروع متعددة)</option>
                    <option value="ENTERPRISE">مؤسسات (ENTERPRISE)</option>
                    <option value="LIFETIME">مدى الحياة (LIFETIME)</option>
                  </select>
                </div>
              </div>

              {/* 🎯 DIGITAL QUOTAS SECTION */}
              <div className="border-t border-slate-200 pt-4 mt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    تحديد الحصص الرقمية (Resource Quotas)
                  </p>
                  <span className="text-[10px] font-bold text-slate-400">تحكم كامل في حدود العميل</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-indigo-50/30 p-3.5 rounded-2xl border border-indigo-100">
                  {/* Max Branches */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Store className="w-3 h-3 text-indigo-600" /> الفروع
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.maxBranches}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setForm(f => ({ ...f, maxBranches: val, multiBranch: val > 1 ? true : f.multiBranch }));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">
                      {form.maxBranches > 1 ? "🏢 سلسلة" : "🟢 فردي"}
                    </span>
                  </div>

                  {/* Max Warehouses */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Boxes className="w-3 h-3 text-amber-600" /> المخازن
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.maxWarehouses}
                      onChange={(e) => setForm(f => ({ ...f, maxWarehouses: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">مستودع</span>
                  </div>

                  {/* Max POS Terminals */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MonitorSmartphone className="w-3 h-3 text-emerald-600" /> الكاشير
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.maxPosTerminals}
                      onChange={(e) => setForm(f => ({ ...f, maxPosTerminals: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">نقطة بيع</span>
                  </div>

                  {/* Max Users */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <UsersIcon className="w-3 h-3 text-purple-600" /> المستخدمين
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.maxUsers}
                      onChange={(e) => setForm(f => ({ ...f, maxUsers: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">موظف</span>
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="border-t border-slate-200 pt-4 mt-2">
                <p className="text-xs font-black text-slate-900 mb-2.5">بيانات تسجيل الدخول للعميل</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1.5">اسم المستخدم *</label>
                    <input 
                      value={form.adminUsername} 
                      onChange={(e) => setForm(f => ({ ...f, adminUsername: e.target.value }))}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20" 
                      placeholder="admin-store" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1.5">كلمة المرور *</label>
                    <input 
                      type="password" 
                      value={form.adminPassword} 
                      onChange={(e) => setForm(f => ({ ...f, adminPassword: e.target.value }))}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>

              {/* Features Toggles */}
              <div className="border-t border-slate-200 pt-4 mt-2">
                <p className="text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  الميزات الأساسية الأولية
                </p>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={form.cloudSync}
                      onChange={(e) => setForm(f => ({ ...f, cloudSync: e.target.checked }))}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>المزامنة السحابية (Cloud)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={form.multiBranch}
                      onChange={(e) => setForm(f => ({ ...f, multiBranch: e.target.checked }))}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>موديول تعدد الفروع</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={form.whatsapp}
                      onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.checked }))}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>فواتير الواتساب</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={form.manufacturing}
                      onChange={(e) => setForm(f => ({ ...f, manufacturing: e.target.checked }))}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>إدارة التصنيع والورش</span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCreate} 
              disabled={actionLoading || !form.name || !form.adminUsername || !form.adminPassword}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {actionLoading ? "جاري إنشاء العميل وتعيين الحصص..." : "إنشاء العميل الآن"}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 📡 BRANCH LIVE TELEMETRY MODAL (رادار الفروع المتصلة)  */}
      {/* ═══════════════════════════════════════════════════════ */}
      {modal === "branches" && selectedCompanyForBranches && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-5 left-5 p-2 rounded-xl hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 mb-6 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 leading-tight">رادار الفروع والاتصال المباشر</h2>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Live Telemetry
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {selectedCompanyForBranches.name} — حصة الفروع المعتمدة: {selectedCompanyForBranches._count?.branches ?? 0} / {selectedCompanyForBranches.maxBranches || 1}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setModal("editSubscription");
                  openEditSubModal(selectedCompanyForBranches);
                }}
                className="text-xs font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors shrink-0"
              >
                تعديل الحصص
              </button>
            </div>

            {/* Telemetry Branches List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pl-1 py-1">
              {loadingBranches ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs font-black text-slate-500">جاري قراءة إشارات الرادار من فروع العميل...</p>
                </div>
              ) : branchesList.length === 0 ? (
                <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200/60 p-6">
                  <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-black text-slate-700">لا توجد فروع مسجلة لهذا العميل حتى الآن</p>
                  <p className="text-xs font-bold text-slate-400 mt-1">يتم إنشاء الفرع الرئيسي تلقائياً عند أول تشغيل للمؤسسة.</p>
                </div>
              ) : (
                branchesList.map((branch, bIdx) => (
                  <div 
                    key={branch.id || bIdx} 
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-mono font-black text-xs ${
                        branch.isHq ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        {branch.code || `BR-${bIdx + 1}`}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm">{branch.name}</h4>
                          {branch.isHq && (
                            <span className="text-[10px] font-black px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                              الفرع الرئيسي HQ
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                            {branch.usersCount || 0} مستخدم
                          </span>
                          <span className="flex items-center gap-1">
                            <Boxes className="w-3.5 h-3.5 text-slate-400" />
                            {branch.warehousesCount || 1} مخزن
                          </span>
                          {branch.warehouses && branch.warehouses.length > 0 && (
                            <span className="text-[11px] text-slate-400">
                              ({branch.warehouses.map(w => w.name).join("، ")})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Beacon */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border ${
                        branch.status === "ONLINE" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${branch.status === "ONLINE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        {branch.status === "ONLINE" ? "متصل الآن" : "أوفلاين"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        آخر نشاط: {new Date(branch.lastSyncAt || Date.now()).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 shrink-0 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                إجمالي الفروع المتصلة: {branchesList.length} فرع
              </span>
              <button
                onClick={() => setModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-black transition-colors"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ⚙️ ADVANCED SUBSCRIPTION & QUOTAS EDIT MODAL           */}
      {/* ═══════════════════════════════════════════════════════ */}
      {modal === "editSubscription" && selectedCompanyId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative my-8" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-5 left-5 p-2 rounded-xl hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">تعديل الاشتراك والحصص الرقمية</h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {companies.find(c => c.id === selectedCompanyId)?.name}
                </p>
              </div>

              {/* Quick Multi-Branch Preset */}
              <button
                type="button"
                onClick={() => applyMultiBranchPreset("edit")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 hover:opacity-95 transition-all flex items-center gap-1.5 active:scale-95"
                title="ضبط تلقائي لـ 3 فروع و 3 مخازن و 5 كاشير"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>ترقية لسلاسل الفروع</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black text-slate-600 mb-1.5">الباقة الحالية</label>
                <select 
                  value={subForm.planName}
                  onChange={(e) => setSubForm({ ...subForm, planName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="BASIC">الباقة الأساسية (BASIC)</option>
                  <option value="PREMIUM">الباقة الاحترافية (PREMIUM)</option>
                  <option value="ENTERPRISE">باقة المؤسسات (ENTERPRISE)</option>
                  <option value="LIFETIME">مدى الحياة (LIFETIME)</option>
                  <option value="TRIAL">فترة تجريبية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 mb-1.5">تاريخ ووقت انتهاء الاشتراك</label>
                <input 
                  type="datetime-local"
                  value={subForm.endsAt}
                  onChange={(e) => setSubForm({ ...subForm, endsAt: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 text-right"
                />
              </div>

              {/* Quotas Numeric Overrides */}
              <div className="border-t border-slate-200 pt-4 mt-2">
                <p className="text-xs font-black text-slate-900 mb-2.5 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  التحكم في حصص ومحددات العميل (Quotas)
                </p>

                <div className="grid grid-cols-2 gap-3 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-indigo-600" /> عدد الفروع (maxBranches)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={subForm.maxBranches}
                      onChange={(e) => setSubForm(s => ({ ...s, maxBranches: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">
                      {subForm.maxBranches > 1 ? "🏢 سلسلة فروع" : "🟢 متجر فردي (1)"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-amber-600" /> عدد المخازن (maxWarehouses)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={subForm.maxWarehouses}
                      onChange={(e) => setSubForm(s => ({ ...s, maxWarehouses: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">مستودعات التخزين</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MonitorSmartphone className="w-3.5 h-3.5 text-emerald-600" /> نقاط الكاشير (maxPos)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={subForm.maxPosTerminals}
                      onChange={(e) => setSubForm(s => ({ ...s, maxPosTerminals: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">شاشات وأجهزة البيع</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <UsersIcon className="w-3.5 h-3.5 text-purple-600" /> المستخدمين (maxUsers)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={subForm.maxUsers}
                      onChange={(e) => setSubForm(s => ({ ...s, maxUsers: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-[9px] font-bold text-slate-400 block text-center">حسابات الموظفين</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setModal(null)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
              >
                إلغاء
              </button>
              <button 
                onClick={handleUpdateSubscriptionAndQuotas} 
                disabled={actionLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-black text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {actionLoading ? "جاري الحفظ..." : "حفظ التغييرات والحصص"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 🔑 HARDWARE LICENSE MODAL                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      {modal === "license" && selectedCompanyId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-5 left-5 p-2 rounded-xl hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">إصدار ترخيص / ربط جهاز</h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {companies.find(c => c.id === selectedCompanyId)?.name}
                </p>
              </div>
            </div>

            {licenseForm.generatedKey ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-emerald-900">تم توليد كود الترخيص بنجاح!</h3>
                  <div className="font-mono text-base font-black tracking-widest bg-white py-3 px-4 rounded-xl border border-emerald-300 text-emerald-800 select-all">
                    {licenseForm.generatedKey}
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    انسخ هذا الكود وأرسله للعميل لتفعيله في شاشة البرنامج
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(licenseForm.generatedKey!);
                    showToast("تم نسخ كود التفعيل بنجاح ✅");
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>نسخ كود التفعيل الآن</span>
                </button>

                <button
                  onClick={() => setModal(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-xs transition-all"
                >
                  إغلاق النافذة
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1.5">باقة الترخيص *</label>
                  <select 
                    value={licenseForm.planName}
                    onChange={(e) => setLicenseForm(f => ({ ...f, planName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer bg-slate-50"
                  >
                    <option value="BASIC">أساسية (BASIC)</option>
                    <option value="PREMIUM">احترافية (PREMIUM)</option>
                    <option value="ENTERPRISE">مؤسسات (ENTERPRISE)</option>
                    <option value="LIFETIME">مدى الحياة (LIFETIME)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1.5">مدة الترخيص *</label>
                  <select 
                    value={licenseForm.durationMonths}
                    onChange={(e) => setLicenseForm(f => ({ ...f, durationMonths: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer bg-slate-50"
                  >
                    <option value={1}>شهر واحد (1 شهر)</option>
                    <option value={3}>3 شهور (ربع سنوي)</option>
                    <option value={6}>6 شهور (نصف سنوي)</option>
                    <option value={12}>12 شهر (سنة كاملة)</option>
                    <option value={24}>24 شهر (سنتين)</option>
                    <option value={120}>مدى الحياة (Lifetime)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-slate-700">بصمة الجهاز (HWID)</label>
                    <span className="text-[10px] font-bold text-slate-400">اختياري للربط المسبق</span>
                  </div>
                  <input 
                    type="text"
                    value={licenseForm.hwid}
                    onChange={(e) => setLicenseForm(f => ({ ...f, hwid: e.target.value }))}
                    placeholder="الصق كود الـ HWID المنسوخ من البرنامج..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 placeholder:font-sans placeholder:text-slate-400"
                  />
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    إذا تركته فارغاً، سيرتبط الكود تلقائياً بأول جهاز يتم تفعيله عليه.
                  </p>
                </div>

                <button 
                  onClick={handleGenerateLicense} 
                  disabled={actionLoading}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  {actionLoading ? "جاري إصدار الترخيص..." : "إصدار كود الترخيص الآن"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 🎛️ FEATURES & MODULES CUSTOMIZATION MODAL              */}
      {/* ═══════════════════════════════════════════════════════ */}
      {modal === "features" && selectedCompanyId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col my-8" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-5 left-5 p-2 rounded-xl hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">إدارة الميزات والصلاحيات المخصصة</h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {companies.find(c => c.id === selectedCompanyId)?.name} — قفل أو فتح الموديلات للعميل
                </p>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 pl-1 py-1 flex-1">
              {[
                {
                  id: "cloudSync",
                  label: "المزامنة السحابية (Cloud Sync)",
                  desc: "مزامنة الفواتير والمخازن مع السيرفر السحابي (إذا أغلقت يشتغل البرنامج أوفلاين 100% دون اتصال)",
                  icon: Cloud,
                },
                {
                  id: "multiBranch",
                  label: "تعدد الفروع والمستودعات (Multi-Branch)",
                  desc: "إدارة أكثر من فرع ومخزن وعمليات التحويل المخزني والمالي بين الفروع",
                  icon: Store,
                },
                {
                  id: "whatsapp",
                  label: "تكامل ورسائل الواتساب (WhatsApp Engine)",
                  desc: "إرسال الفواتير التلقائية للعملاء والحملات التسويقية ورسائل الولاء عبر واتساب",
                  icon: MessageSquare,
                },
                {
                  id: "manufacturing",
                  label: "إدارة التصنيع والمشاغل (Manufacturing & BOM)",
                  desc: "أوامر التصنيع، شجرة المواد الخام، وتكاليف الهالك والتشغيل لخطوط الإنتاج",
                  icon: Factory,
                },
                {
                  id: "accounting",
                  label: "الحسابات المتقدمة وشجرة الحسابات (Accounting)",
                  desc: "القيود اليومية، ميزان المراجعة، الحسابات الختامية، ومراكز التكلفة",
                  icon: Shield,
                },
                {
                  id: "credit",
                  label: "حسابات العملاء والآجل (Credit & Ledger)",
                  desc: "دفتر أستاذ العملاء، كشف حساب العميل، وإدارة المديونيات والأقساط",
                  icon: UsersIcon,
                },
                {
                  id: "promotions",
                  label: "العروض والخصومات والباقات (Promotions)",
                  desc: "إنشاء عروض ترويجية، أكواد الخصم، وباقات الأصناف المركبة (Bundles)",
                  icon: Tag,
                },
                {
                  id: "excel",
                  label: "أدوات التصدير والاستيراد (Excel Tools)",
                  desc: "تصدير واستيراد المنتجات والعملاء والمخزون بملفات إكسيل بضغطة زر",
                  icon: FileSpreadsheet,
                },
                {
                  id: "mcp",
                  label: "تكامل ومحرك الذكاء الاصطناعي (MCP Protocol & AI)",
                  desc: "ربط المنظومة مع نماذج Claude Desktop و Google Gemini وإصدار مفاتيح واستدعاء دوائر البيانات الذكية",
                  icon: Sparkles,
                }
              ].map((feat) => {
                const isEnabled = (featuresForm as any)[feat.id];
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.id}
                    onClick={() => setFeaturesForm(prev => ({ ...prev, [feat.id]: !isEnabled }))}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isEnabled ? "bg-indigo-50/40 border-indigo-500/40" : "bg-slate-50/60 border-slate-200/60 opacity-80"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isEnabled ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-200 text-slate-500"
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">{feat.label}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                          }`}>
                            {isEnabled ? "مفعل ومتاح" : "مغلق (تشويقي)"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                      isEnabled ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start"
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-white shadow-md transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveFeatures}
                disabled={actionLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {actionLoading ? "جاري حفظ الصلاحيات..." : "حفظ الصلاحيات والميزات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
