// API utility for backend communication

// Automatically detect the correct API URL
function getApiBaseUrl(): string {
  // Check if PUBLIC_API_URL is set (prefer this)
  if (import.meta.env.PUBLIC_API_URL) {
    const apiUrl = import.meta.env.PUBLIC_API_URL;
    // If it's a relative URL (starts with /), use same origin
    if (apiUrl.startsWith('/')) {
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      return '';
    }
    return apiUrl;
  }
  
  // For Codespaces/Preview environments, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Default to empty string (will use relative URLs)
  return '';
}

const API_BASE_URL = getApiBaseUrl();

// Log API URL for debugging (only in development)
if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
  console.log('API Base URL:', API_BASE_URL || 'Relative URLs');
}

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
  
  compare: (toolIds: string[]) => apiFetch<any[]>(`/api/tools/compare?tool_ids=${toolIds.join(',')}`),
  
  // Reviews
  getReviews: (toolId: string, params?: { skip?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/tools/${toolId}/reviews?${queryParams.toString()}`);
  },
  
  createReview: (data: { tool_id: string; rating: number; title?: string; content?: string; pros?: string[]; cons?: string[] }) =>
    apiFetch<any>(`/api/tools/${data.tool_id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Comments
  getComments: (toolSlug: string, params?: { skip?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/tools/${toolSlug}/comments?${queryParams.toString()}`);
  },
  
  createComment: (toolSlug: string, data: { content: string; parent_id?: string }) =>
    apiFetch<any>(`/api/tools/${toolSlug}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Like
  toggleLike: (toolSlug: string) =>
    apiFetch<any>(`/api/tools/${toolSlug}/like`, {
      method: 'POST',
    }),
  
  // Favorite
  toggleFavorite: (toolId: string) =>
    apiFetch<any>(`/api/tools/${toolId}/favorite`, {
      method: 'POST',
    }),
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
  
  // Comments
  getComments: (blogSlug: string, params?: { skip?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/blogs/${blogSlug}/comments?${queryParams.toString()}`);
  },
  
  createComment: (blogSlug: string, data: { content: string; parent_id?: string }) =>
    apiFetch<any>(`/api/blogs/${blogSlug}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Like
  toggleLike: (blogSlug: string) =>
    apiFetch<any>(`/api/blogs/${blogSlug}/like`, {
      method: 'POST',
    }),
  
  // Bookmark
  toggleBookmark: (blogSlug: string) =>
    apiFetch<any>(`/api/blogs/${blogSlug}/bookmark`, {
      method: 'POST',
    }),
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
  
  register: (data: { email: string; username: string; password: string; full_name?: string; verification_method?: string }) =>
    apiFetch<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getCurrentUser: () => apiFetch<any>('/api/auth/me'),
};

// User API
export const userApi = {
  getDashboard: () => apiFetch<any>('/api/user/dashboard'),
  
  updateProfile: (data: { full_name?: string; bio?: string }) =>
    apiFetch<any>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<any>('/api/user/upload-avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
  
  // User's blogs
  getBlogs: () => apiFetch<any[]>('/api/user/blogs'),
  getBlog: (blogId: string) => apiFetch<any>(`/api/user/blogs/${blogId}`),
  createBlog: (data: any) => apiFetch<any>('/api/user/blogs', { method: 'POST', body: JSON.stringify(data) }),
  updateBlog: (blogId: string, data: any) => apiFetch<any>(`/api/user/blogs/${blogId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlog: (blogId: string) => apiFetch<any>(`/api/user/blogs/${blogId}`, { method: 'DELETE' }),
  publishBlog: (blogId: string) => apiFetch<any>(`/api/user/blogs/${blogId}/publish`, { method: 'POST' }),
  
  // User's claimed tools
  getClaimedTools: () => apiFetch<any[]>('/api/user/claimed-tools'),
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
    getById: (id: string) => apiFetch<any>(`/api/superadmin/tools/${id}`),
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
  
  // Sitemap Management
  sitemap: {
    generate: () => apiFetch<any>('/api/superadmin/sitemap/generate', { method: 'POST' }),
  },
};

// Admin APIs
export const adminApi = {
  // Dashboard
  getDashboard: () => apiFetch<any>('/api/admin/dashboard'),
  
  // Analytics
  getAnalytics: (days: number = 30) => apiFetch<any>(`/api/admin/analytics?days=${days}`),
  
  // Reviews Management
  getReviews: (params?: { skip?: number; limit?: number; verified?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/admin/reviews?${queryParams.toString()}`);
  },
  
  verifyReview: (reviewId: string, verified: boolean) =>
    apiFetch<any>(`/api/admin/reviews/${reviewId}/verify?verified=${verified}`, { method: 'PUT' }),
  
  // Contact Submissions
  getContacts: (params?: { skip?: number; limit?: number; status_filter?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/admin/contacts?${queryParams.toString()}`);
  },
  
  updateContactStatus: (contactId: string, status: string) =>
    apiFetch<any>(`/api/admin/contacts/${contactId}/status?new_status=${status}`, { method: 'PUT' }),
  
  // Newsletter Management
  getNewsletterSubscriptions: (params?: { skip?: number; limit?: number; status_filter?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any[]>(`/api/admin/newsletter/subscriptions?${queryParams.toString()}`);
  },
  
  getNewsletterStats: () => apiFetch<any>('/api/admin/newsletter/stats'),
};

// Newsletter API (Public)
export const newsletterApi = {
  subscribe: (email: string, source: string = 'website') =>
    apiFetch<any>('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    }),
  
  unsubscribe: (email: string) =>
    apiFetch<any>('/api/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// Free Tools API
export const freeToolsApi = {
  getAll: (limit?: number) => {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', String(limit));
    return apiFetch<any[]>(`/api/free-tools?${queryParams.toString()}`);
  },
};

// Super Admin Free Tools Management
superAdminApi.freeTools = {
  getAll: (params?: { skip?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiFetch<any>(`/api/superadmin/free-tools?${queryParams.toString()}`);
  },
  
  get: (toolId: string) => apiFetch<any>(`/api/superadmin/free-tools/${toolId}`),
  
  create: (data: { name: string; link: string; description?: string }) =>
    apiFetch<any>('/api/superadmin/free-tools', { method: 'POST', body: JSON.stringify(data) }),
  
  update: (toolId: string, data: { name?: string; link?: string; description?: string; is_active?: boolean }) =>
    apiFetch<any>(`/api/superadmin/free-tools/${toolId}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  delete: (toolId: string) => apiFetch<any>(`/api/superadmin/free-tools/${toolId}`, { method: 'DELETE' }),
};

// AI Blog Generation API
export const aiBlogApi = {
  generateBlog: (data: { topic: string; keywords?: string[]; target_length?: string; auto_publish?: boolean }) =>
    apiFetch<any>('/api/ai/generate-blog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getBlogTopics: (category?: string) => {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    return apiFetch<any>(`/api/ai/blog-topics?${queryParams.toString()}`);
  },
  
  compareTools: (data: { tool_ids: string[]; comparison_criteria?: string[]; create_blog?: boolean; auto_publish?: boolean }) =>
    apiFetch<any>('/api/ai/compare-tools', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Contact API (Public)
export const contactApi = {
  submit: (data: { name: string; email: string; company?: string; subject: string; message: string; inquiry_type?: string }) =>
    apiFetch<any>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default apiFetch;
