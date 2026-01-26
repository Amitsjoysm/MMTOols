// API utility for backend communication

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8001';

// Generic fetch wrapper with error handling
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Get auth token from localStorage if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Tools API
export const toolsApi = {
  getAll: (params?: { skip?: number; limit?: number; category?: string; pricing?: string; search?: string; sort?: string; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/tools?${queryParams.toString()}`);
  },
  
  getById: (id: string) => apiFetch<any>(`/api/tools/${id}`),
  
  getBySlug: (slug: string) => apiFetch<any>(`/api/tools/by-slug/${slug}`),
  
  compare: (toolIds: string[]) => apiFetch<any[]>(`/api/tools/compare?tool_ids=${toolIds.join(',')}`);
};

// Blogs API
export const blogsApi = {
  getAll: (params?: { skip?: number; limit?: number; status?: string; search?: string; tag?: string; author_id?: string; sort?: string; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/blogs?${queryParams.toString()}`);
  },
  
  getById: (id: string) => apiFetch<any>(`/api/blogs/${id}`),
  
  getBySlug: (slug: string) => apiFetch<any>(`/api/blogs/by-slug/${slug}`),
  
  incrementView: (slug: string) => apiFetch(`/api/blogs/${slug}/view`, { method: 'POST' }),
};

// Categories API
export const categoriesApi = {
  getAll: () => apiFetch<any[]>('/api/categories'),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    apiFetch<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (data: { email: string; username: string; password: string; full_name?: string }) =>
    apiFetch<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getCurrentUser: () => apiFetch<any>('/api/users/me'),
};

// Super Admin APIs
export const superAdminApi = {
  // Dashboard Analytics
  getDashboardAnalytics: (timeframe: number = 30) => 
    apiFetch<any>(`/api/superadmin/dashboard/analytics?timeframe=${timeframe}`),
  
  // Tools Management
  tools: {
    getAll: (params?: { skip?: number; limit?: number; category?: string; status?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      return apiFetch<any[]>(`/api/superadmin/tools?${queryParams.toString()}`);
    },
    create: (data: any) => apiFetch<any>('/api/superadmin/tools', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/superadmin/tools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<any>(`/api/superadmin/tools/${id}`, { method: 'DELETE' }),
  },
  
  // Blogs Management
  blogs: {
    getAll: (params?: { skip?: number; limit?: number; status?: string; author_id?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      return apiFetch<any[]>(`/api/superadmin/blogs?${queryParams.toString()}`);
    },
    create: (data: any) => apiFetch<any>('/api/superadmin/blogs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/superadmin/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<any>(`/api/superadmin/blogs/${id}`, { method: 'DELETE' }),
    publish: (id: string) => apiFetch<any>(`/api/superadmin/blogs/${id}/publish`, { method: 'POST' }),
    unpublish: (id: string) => apiFetch<any>(`/api/superadmin/blogs/${id}/unpublish`, { method: 'POST' }),
  },
  
  // Users Management
  users: {
    getAll: (params?: { skip?: number; limit?: number; role?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      return apiFetch<any[]>(`/api/superadmin/users?${queryParams.toString()}`);
    },
    create: (data: any) => apiFetch<any>('/api/superadmin/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/superadmin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<any>(`/api/superadmin/users/${id}`, { method: 'DELETE' }),
  },
  
  // Categories Management
  categories: {
    getAll: () => apiFetch<any[]>('/api/superadmin/categories'),
    create: (data: any) => apiFetch<any>('/api/superadmin/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/superadmin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<any>(`/api/superadmin/categories/${id}`, { method: 'DELETE' }),
  },
  
  // SEO Management
  seo: {
    getOverview: () => apiFetch<any>('/api/superadmin/seo/overview'),
    getIssues: (params?: { page_type?: string; severity?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      return apiFetch<any>(`/api/superadmin/seo/issues?${queryParams.toString()}`);
    },
    generateTemplates: (pageType: string, count: number = 10) => 
      apiFetch<any>(`/api/superadmin/seo/generate-templates?page_type=${pageType}&count=${count}`, { method: 'POST' }),
    generateJsonLd: (contentType: string, limit: number = 100) =>
      apiFetch<any>(`/api/superadmin/seo/generate-json-ld?content_type=${contentType}&limit=${limit}`, { method: 'POST' }),
  },
};

export default apiFetch;
