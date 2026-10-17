import { AdminAnalytics, GeneratedItem, PlanInfo, SystemConfig, User, UserLimits } from '../types';

const TOKEN_KEY = 'creatorai_token';
const GUEST_ITEMS_KEY = 'creatorai_guest_items';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg) as any;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  // System status
  async getSystemStatus(): Promise<{ hasApiKey: boolean; appName: string; version: string; announcement: string; maintenanceMode: boolean }> {
    return request('/api/system/status');
  },

  // Auth
  async register(body: { name: string; email: string; password: string; niche?: string; country?: string }): Promise<{ token: string; user: User; message: string }> {
    const data = await request<{ token: string; user: User; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setStoredToken(data.token);
    return data;
  },

  async login(body: { email: string; password: string }): Promise<{ token: string; user: User; message: string }> {
    const data = await request<{ token: string; user: User; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setStoredToken(data.token);
    return data;
  },

  async getCurrentUser(): Promise<{ user: User; limits: UserLimits }> {
    return request('/api/auth/me');
  },

  async resetPassword(body: { email: string; newPassword?: string }): Promise<{ message: string }> {
    return request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateProfile(body: { name?: string; bio?: string; niche?: string; country?: string }): Promise<{ user: User; message: string }> {
    return request('/api/auth/profile', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  logout() {
    setStoredToken(null);
  },

  // Generation
  async generateContent(params: {
    type: string;
    topic: string;
    platform?: string;
    style?: string;
    tone?: string;
    targetAudience?: string;
    businessName?: string;
    product?: string;
    price?: string;
    targetCustomers?: string;
    niche?: string;
    framework?: string;
    countryOrRegion?: string;
    callToAction?: string;
    extraDetails?: string;
  }): Promise<{ success: boolean; item: GeneratedItem }> {
    return request('/api/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async generatePoster(params: {
    prompt: string;
    businessName?: string;
    headline?: string;
    subheadline?: string;
    badge?: string;
    cta?: string;
    theme?: string;
    aspectRatio?: '1:1' | '9:16' | '16:9';
  }): Promise<{ success: boolean; item: GeneratedItem; imageUrl?: string; posterData: any }> {
    return request('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // History & Favorites
  async getHistory(): Promise<{ items: GeneratedItem[] }> {
    return request('/api/history');
  },

  async toggleFavorite(id: string): Promise<{ item: GeneratedItem }> {
    return request(`/api/history/${id}/favorite`, {
      method: 'POST',
    });
  },

  async updateItem(id: string, updates: { content?: string; title?: string }): Promise<{ item: GeneratedItem }> {
    return request(`/api/history/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteItem(id: string): Promise<{ success: boolean }> {
    return request(`/api/history/${id}`, {
      method: 'DELETE',
    });
  },

  // Plans & Upgrades
  async getPlans(): Promise<{ plans: PlanInfo[] }> {
    return request('/api/plans');
  },

  async upgradePlan(planId: string, billingCycle: 'monthly' | 'yearly'): Promise<{ success: boolean; message: string; user: User }> {
    return request('/api/plans/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId, billingCycle }),
    });
  },

  // Admin
  async getAdminOverview(): Promise<{ analytics: AdminAnalytics }> {
    return request('/api/admin/overview');
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    return request('/api/admin/users');
  },

  async updateAdminUserStatus(userId: string, status: 'active' | 'suspended'): Promise<{ user: User; message: string }> {
    return request(`/api/admin/users/${userId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  async updateAdminUserPlan(userId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<{ user: User; message: string }> {
    return request(`/api/admin/users/${userId}/plan`, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  },

  async getAdminConfig(): Promise<{ config: SystemConfig }> {
    return request('/api/admin/config');
  },

  async updateAdminConfig(config: Partial<SystemConfig>): Promise<{ config: SystemConfig; message: string }> {
    return request('/api/admin/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },
};
