/**
 * Server-Side Rendering API Utilities
 * These functions fetch data at build time for static site generation
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
}

// Tools API
export const ssrToolsApi = {
  async getAll(params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    const endpoint = `/api/tools${queryString ? `?${queryString}` : ''}`;
    return await fetchAPI(endpoint);
  },

  async getBySlug(slug: string) {
    return await fetchAPI(`/api/tools/by-slug/${slug}`);
  },

  async getReviews(toolId: string, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return await fetchAPI(`/api/tools/${toolId}/reviews${queryString ? `?${queryString}` : ''}`);
  },

  async getComments(slug: string, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return await fetchAPI(`/api/tools/${slug}/comments${queryString ? `?${queryString}` : ''}`);
  },
};

// Blogs API
export const ssrBlogsApi = {
  async getAll(params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    const endpoint = `/api/blogs${queryString ? `?${queryString}` : ''}`;
    return await fetchAPI(endpoint);
  },

  async getBySlug(slug: string) {
    return await fetchAPI(`/api/blogs/by-slug/${slug}`);
  },

  async getComments(slug: string, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return await fetchAPI(`/api/blogs/${slug}/comments${queryString ? `?${queryString}` : ''}`);
  },
};

// Categories API
export const ssrCategoriesApi = {
  async getAll() {
    return await fetchAPI('/api/categories');
  },
};

// Health check
export async function checkAPIHealth() {
  try {
    const health = await fetchAPI('/api/health');
    console.log('✅ API Health Check:', health.status);
    return health;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    return null;
  }
}
