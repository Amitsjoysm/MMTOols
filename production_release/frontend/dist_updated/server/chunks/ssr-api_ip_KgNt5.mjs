const API_BASE_URL = "http://localhost:8001";
console.log("[SSR-API] Using API base URL:", API_BASE_URL);
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
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
const ssrToolsApi = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/tools${queryString ? `?${queryString}` : ""}`;
    return await fetchAPI(endpoint);
  },
  async getBySlug(slug) {
    return await fetchAPI(`/api/tools/by-slug/${slug}`);
  },
  async getReviews(toolId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await fetchAPI(`/api/tools/${toolId}/reviews${queryString ? `?${queryString}` : ""}`);
  },
  async getComments(slug, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await fetchAPI(`/api/tools/${slug}/comments${queryString ? `?${queryString}` : ""}`);
  }
};
const ssrBlogsApi = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/blogs${queryString ? `?${queryString}` : ""}`;
    return await fetchAPI(endpoint);
  },
  async getBySlug(slug) {
    return await fetchAPI(`/api/blogs/by-slug/${slug}`);
  },
  async getComments(slug, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await fetchAPI(`/api/blogs/${slug}/comments${queryString ? `?${queryString}` : ""}`);
  }
};
const ssrCategoriesApi = {
  async getAll() {
    return await fetchAPI("/api/categories");
  }
};

export { ssrToolsApi as a, ssrCategoriesApi as b, ssrBlogsApi as s };
