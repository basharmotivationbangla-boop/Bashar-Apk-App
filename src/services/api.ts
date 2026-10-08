import { AppItem, CategoryItem, WebsiteSettings, AnalyticsSummary, ContactMessage, AdminUser } from '../types';

const TOKEN_KEY = 'bashar_admin_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getHeaders = (extra: HeadersInit = {}): HeadersInit => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extra as Record<string, string>)
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: getHeaders(options.headers || {})
  });

  const contentType = res.headers.get('content-type') || '';
  let data: any = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = data && typeof data === 'object' && data.error ? data.error : `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // --- Auth ---
  async login(password: string): Promise<{ success: boolean; token: string; user: AdminUser }> {
    const res = await request<{ success: boolean; token: string; user: AdminUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async getMe(): Promise<{ authenticated: boolean; user?: AdminUser }> {
    try {
      return await request<{ authenticated: boolean; user?: AdminUser }>('/api/auth/me');
    } catch {
      return { authenticated: false };
    }
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  async updateProfile(username?: string, email?: string): Promise<{ success: boolean; user: AdminUser }> {
    return request('/api/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify({ username, email })
    });
  },

  // --- Settings ---
  async getSettings(): Promise<WebsiteSettings> {
    return request<WebsiteSettings>('/api/settings');
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<{ success: boolean; settings: WebsiteSettings }> {
    return request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // --- Categories ---
  async getCategories(): Promise<CategoryItem[]> {
    return request<CategoryItem[]>('/api/categories');
  },

  async createCategory(cat: Partial<CategoryItem>): Promise<CategoryItem> {
    return request<CategoryItem>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(cat)
    });
  },

  async updateCategory(id: string, cat: Partial<CategoryItem>): Promise<CategoryItem> {
    return request<CategoryItem>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cat)
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return request(`/api/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // --- Apps ---
  async getApps(params: {
    search?: string;
    category?: string;
    status?: string;
    featured?: boolean;
    popular?: boolean;
    isNew?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ apps: AppItem[]; total: number; page: number; limit: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.status) query.set('status', params.status);
    if (params.featured) query.set('featured', 'true');
    if (params.popular) query.set('popular', 'true');
    if (params.isNew) query.set('isNew', 'true');
    if (params.sort) query.set('sort', params.sort);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return request(`/api/apps?${query.toString()}`);
  },

  async getApp(slugOrId: string): Promise<AppItem & { relatedApps?: AppItem[] }> {
    return request<AppItem & { relatedApps?: AppItem[] }>(`/api/apps/${slugOrId}`);
  },

  async createApp(appData: Partial<AppItem>): Promise<AppItem> {
    return request<AppItem>('/api/apps', {
      method: 'POST',
      body: JSON.stringify(appData)
    });
  },

  async updateApp(id: string, appData: Partial<AppItem>): Promise<AppItem> {
    return request<AppItem>(`/api/apps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appData)
    });
  },

  async deleteApp(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/api/apps/${id}`, {
      method: 'DELETE'
    });
  },

  async duplicateApp(id: string): Promise<AppItem> {
    return request<AppItem>(`/api/apps/${id}/duplicate`, {
      method: 'POST'
    });
  },

  async toggleAppFlag(id: string, field: 'isFeatured' | 'isPopular' | 'isNew' | 'status'): Promise<AppItem> {
    return request<AppItem>(`/api/apps/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ field })
    });
  },

  // --- Downloads ---
  getDownloadUrl(slugOrId: string): string {
    return `/api/download/${slugOrId}`;
  },

  // --- File Upload ---
  async uploadFile(file: File): Promise<{ success: boolean; url: string; fileName: string; fileSize: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const result = await request<{ success: boolean; url: string; fileName: string; fileSize: string }>('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
              fileType: file.type
            })
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file for upload'));
      reader.readAsDataURL(file);
    });
  },

  // --- Analytics ---
  async getAnalytics(): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>('/api/analytics/overview');
  },

  // --- Contact Messages ---
  async sendContactMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
    return request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    return request<ContactMessage[]>('/api/contact/messages');
  },

  async updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<ContactMessage> {
    return request<ContactMessage>(`/api/contact/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async deleteContactMessage(id: string): Promise<{ success: boolean }> {
    return request(`/api/contact/messages/${id}`, {
      method: 'DELETE'
    });
  },

  // --- Backup & Restore ---
  async restoreBackup(backupData: any): Promise<{ success: boolean; message: string }> {
    return request('/api/backup/import', {
      method: 'POST',
      body: JSON.stringify({ backupData })
    });
  }
};
