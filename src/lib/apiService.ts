/**
 * 🔌 Manzoma Site → ERP Backend API Service
 * Connects the admin dashboard to the real SuperAdmin API
 * WITHOUT modifying the system backend.
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://api.manzoma.online';

/** Get the stored JWT token dynamically depending on target API endpoint */
const getToken = (endpoint?: string): string | null => {
  if (endpoint?.startsWith('/api/superadmin')) {
    return localStorage.getItem('manzoma_sa_token');
  }
  if (endpoint?.startsWith('/api/portal')) {
    return localStorage.getItem('manzoma_client_token');
  }
  return localStorage.getItem('manzoma_client_token') || localStorage.getItem('manzoma_sa_token');
};

/** Save the SuperAdmin JWT token */
export const saveToken = (token: string) => {
  localStorage.setItem('manzoma_sa_token', token);
};

/** Clear the token */
export const clearToken = () => {
  localStorage.removeItem('manzoma_sa_token');
};

/** Core fetch wrapper with auth */
async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken(endpoint);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || errorData.message || `API Error ${res.status}`);
  }

  return res.json();
}

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════

export async function loginAsSuperAdmin(username: string, password: string) {
  const data = await apiFetch<any>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (data.token) {
    saveToken(data.token);
  }
  return data;
}

// ═══════════════════════════════════════
// COMPANIES (CLIENTS)
// ═══════════════════════════════════════

export interface CompanyFromAPI {
  id: string;
  name: string;
  adminEmail: string | null;
  phone: string | null;
  status: string;
  planName: string;
  isActive: boolean;
  maxBranches: number;
  maxWarehouses: number;
  maxPosTerminals: number;
  maxUsers: number;
  subscriptionEndsAt: string | null;
  subscriptionPlan: { name: string; price: number } | null;
  licenses: { id: string; serialKey: string; hwid: string | null; isActive: boolean; expiresAt: string; deviceName?: string }[];
  _count: {
    branches: number;
    users: number;
    products: number;
    orders: number;
  };
  createdAt: string;
}

export async function fetchCompanies(): Promise<CompanyFromAPI[]> {
  return apiFetch('/api/superadmin/companies');
}

export async function createCompany(data: {
  name: string;
  adminEmail?: string;
  phone?: string;
  planName?: string;
  adminFullName?: string;
  adminUsername: string;
  adminPassword: string;
}) {
  return apiFetch('/api/superadmin/companies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCompanyStatus(companyId: string, status: 'ACTIVE' | 'SUSPENDED') {
  return apiFetch(`/api/superadmin/companies/${companyId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, isActive: status === 'ACTIVE' }),
  });
}

// ═══════════════════════════════════════
// LICENSES & HWID
// ═══════════════════════════════════════

export async function generateLicense(companyId: string, planName: string, durationMonths = 12) {
  return apiFetch('/api/superadmin/licenses/generate', {
    method: 'POST',
    body: JSON.stringify({ companyId, planName, durationMonths }),
  });
}

export async function revokeLicense(licenseId: string) {
  return apiFetch(`/api/superadmin/licenses/${licenseId}/revoke`, {
    method: 'PUT',
  });
}

// ═══════════════════════════════════════
// IMPERSONATION
// ═══════════════════════════════════════

export async function impersonateCompany(companyId: string) {
  return apiFetch('/api/superadmin/impersonate', {
    method: 'POST',
    body: JSON.stringify({ companyId }),
  });
}

// ═══════════════════════════════════════
// SYSTEM LOGS
// ═══════════════════════════════════════

export interface SystemLog {
  id: string;
  level: string;
  action: string;
  message: string;
  metadata?: any;
  company?: { name: string };
  user?: { username: string };
  companyId?: string;
  createdAt: string;
}

export async function fetchLogs(options?: { companyId?: string; level?: string; limit?: number }): Promise<SystemLog[]> {
  const params = new URLSearchParams();
  if (options?.companyId) params.set('companyId', options.companyId);
  if (options?.level) params.set('level', options.level);
  if (options?.limit) params.set('limit', String(options.limit));
  const qs = params.toString();
  return apiFetch(`/api/superadmin/logs${qs ? `?${qs}` : ''}`);
}

// ═══════════════════════════════════════
// ADVANCED FINANCIALS & DATA
// ═══════════════════════════════════════

export interface GlobalStats {
  totalCompanies: number;
  totalRevenue: number;
  totalOrders: number;
  mrrHistory: number[];
  averageOrderValue: number;
}

export async function fetchGlobalStats(): Promise<GlobalStats> {
  return apiFetch('/api/superadmin/global-stats');
}

export interface InvoiceFromAPI {
  id: string;
  receiptNumber: string;
  customerName: string | null;
  total: number;
  paymentStatus: string;
  createdAt: string;
  company: { name: string };
  user?: { fullName: string; username: string };
  items: any[];
}

export async function fetchGlobalInvoices(page = 1, search = ''): Promise<{ data: InvoiceFromAPI[], pagination: any }> {
  const qs = `?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ''}`;
  return apiFetch(`/api/superadmin/global-invoices${qs}`);
}

export async function updateSubscriptionAdvanced(companyId: string, data: {
  subscriptionEndsAt?: string;
  planName?: string;
  status?: string;
}) {
  return apiFetch(`/api/superadmin/companies/${companyId}/subscription-advanced`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Triggers a native browser download for the JSON backup of a client.
 */
export async function downloadCompanyBackup(companyId: string, companyName: string) {
  const token = getToken(`/api/superadmin/companies/${companyId}/backup`);
  const res = await fetch(`${API_URL}/api/superadmin/companies/${companyId}/backup`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || errorData.message || 'Backup failed');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.db`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════
// PUBLIC SITE CMS (Landing Page)
// ═══════════════════════════════════════

export async function fetchPublicConfig() {
  return apiFetch('/api/public/config');
}

export async function updatePublicConfig(data: any) {
  return apiFetch('/api/superadmin/config', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchPublicNavigation() {
  return apiFetch('/api/public/navigation');
}

export async function updatePublicNavigation(type: string, items: any[]) {
  return apiFetch(`/api/superadmin/navigation/${type}`, {
    method: 'PUT',
    body: JSON.stringify({ items }),
  });
}

export async function fetchPublicPages() {
  return apiFetch('/api/superadmin/pages'); // Super admin sees all, including drafts
}

export async function fetchPublicPageBySlug(slug: string) {
  return apiFetch(`/api/public/pages/${slug}`);
}

export async function createPublicPage(data: any) {
  return apiFetch('/api/superadmin/pages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePublicPage(id: string, data: any) {
  return apiFetch(`/api/superadmin/pages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePublicPage(id: string) {
  return apiFetch(`/api/superadmin/pages/${id}`, {
    method: 'DELETE',
  });
}

// ═══════════════════════════════════════
// SAAS PAYMENT METHODS & REQUESTS
// ═══════════════════════════════════════

export async function fetchPaymentMethods() {
  return apiFetch('/api/superadmin/payment-methods');
}

export async function createPaymentMethod(data: any) {
  return apiFetch('/api/superadmin/payment-methods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePaymentMethod(id: string, data: any) {
  return apiFetch(`/api/superadmin/payment-methods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePaymentMethod(id: string) {
  return apiFetch(`/api/superadmin/payment-methods/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchPaymentRequests() {
  return apiFetch('/api/superadmin/payment-requests');
}

export async function approvePaymentRequest(id: string) {
  return apiFetch(`/api/superadmin/payment-requests/${id}/approve`, {
    method: 'POST',
  });
}

export async function rejectPaymentRequest(id: string) {
  return apiFetch(`/api/superadmin/payment-requests/${id}/reject`, {
    method: 'POST',
  });
}

export async function fetchClientOverview() {
    return apiFetch('/api/portal/overview');
}
export async function fetchClientPaymentMethods() {
    return apiFetch('/api/portal/payment-methods');
}
export async function fetchClientPaymentRequests() {
    return apiFetch('/api/portal/payment-requests');
}
export async function createClientPaymentRequest(data: any) {
    return apiFetch('/api/portal/payment-requests', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
