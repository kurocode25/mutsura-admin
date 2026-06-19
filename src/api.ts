const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface FetchResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface LocalizedText {
  ja: string;
  en: string;
}

interface UserResponse {
  user: {
    id: string;
    name: LocalizedText;
    email: string;
    role: string;
  };
}

interface AuthTokenResponse {
  token: string;
}

interface CategoryResponse {
  id: string;
  name: LocalizedText;
  slug: string;
}

interface TagResponse {
  id: string;
  name: LocalizedText;
  slug: string;
}

interface PageResponse {
  id: string;
  title: LocalizedText;
  slug: string;
  content: LocalizedText;
  created_at: string;
  updated_at: string;
}

interface PostDetailResponse {
  id?: string;
  title: LocalizedText;
  slug: string;
  content: LocalizedText;
  category: CategoryResponse;
  tags?: TagResponse[] | null;
  is_draft: boolean;
  has_english: boolean;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

interface PostListResponse {
  posts: {
    id: string;
    title: string;
    slug: string;
    category: { slug: string; name: string };
    tags?: { slug: string; name: string }[] | null;
    is_draft: boolean;
    published_at: string;
    updated_at: string;
  }[];
  pagination: {
    total_pages: number;
  };
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const getAccessToken = () => accessToken;

// Track retry attempts to prevent infinite loops
let refreshTokenRetry = false;

async function fetchWithAuth<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const url = `${API_BASE_URL}${path}`;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'include'
  };

  if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    const data = (
      contentType?.includes('application/json') ? await response.json() : await response.text()
    ) as T;

    const result: FetchResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };

    // Handle 401 - attempt token refresh
    if (response.status === 401 && !refreshTokenRetry) {
      refreshTokenRetry = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (refreshResponse.ok) {
          const refreshData = (await refreshResponse.json()) as AuthTokenResponse;
          const { token: newToken } = refreshData;
          setAccessToken(newToken);
          refreshTokenRetry = false;

          // Retry original request with new token
          return fetchWithAuth<T>(path, options);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.dispatchEvent(new Event('auth-error'));
        refreshTokenRetry = false;
        throw refreshError;
      }
    }

    if (!response.ok) {
      const error = new Error(`HTTP Error: ${response.status}`);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

async function fetchNoAuth<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: options.credentials
  };

  if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    const data = (
      contentType?.includes('application/json') ? await response.json() : await response.text()
    ) as T;

    const result: FetchResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };

    if (!response.ok) {
      const error = new Error(`HTTP Error: ${response.status}`);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// HTTP method wrappers for convenience
const apiRequest = {
  async get<T = unknown>(path: string, useAuth: boolean = true): Promise<FetchResponse<T>> {
    return useAuth
      ? fetchWithAuth<T>(path, { method: 'GET' })
      : fetchNoAuth<T>(path, { method: 'GET' });
  },

  async post<T = unknown>(
    path: string,
    body: unknown,
    useAuth: boolean = true
  ): Promise<FetchResponse<T>> {
    return useAuth
      ? fetchWithAuth<T>(path, { method: 'POST', body })
      : fetchNoAuth<T>(path, { method: 'POST', body });
  },

  async put<T = unknown>(
    path: string,
    body: unknown,
    useAuth: boolean = true
  ): Promise<FetchResponse<T>> {
    return useAuth
      ? fetchWithAuth<T>(path, { method: 'PUT', body })
      : fetchNoAuth<T>(path, { method: 'PUT', body });
  },

  async delete<T = unknown>(path: string, useAuth: boolean = true): Promise<FetchResponse<T>> {
    return useAuth
      ? fetchWithAuth<T>(path, { method: 'DELETE' })
      : fetchNoAuth<T>(path, { method: 'DELETE' });
  }
};

// Axios-compatible wrapper for compatibility with existing code
const api = {
  get: <T = unknown>(path: string) => apiRequest.get<T>(path, true),
  post: <T = unknown>(path: string, data?: unknown) => apiRequest.post<T>(path, data, true),
  put: <T = unknown>(path: string, data?: unknown) => apiRequest.put<T>(path, data, true),
  delete: <T = unknown>(path: string) => apiRequest.delete<T>(path, true)
};

// No-auth wrapper
const apiNoAuth = {
  get: <T = unknown>(path: string) => apiRequest.get<T>(path, false),
  post: <T = unknown>(path: string, data?: unknown) => apiRequest.post<T>(path, data, false),
  put: <T = unknown>(path: string, data?: unknown) => apiRequest.put<T>(path, data, false),
  delete: <T = unknown>(path: string) => apiRequest.delete<T>(path, false)
};

// API関数
export const refreshToken = () =>
  fetchNoAuth<AuthTokenResponse>('/refresh', { method: 'POST', credentials: 'include' });
export const logoutRequest = () =>
  fetchNoAuth('/logout', { method: 'POST', credentials: 'include' });
export const getPosts = (params: URLSearchParams) =>
  apiNoAuth.get<PostListResponse>(`/post?${params.toString()}`);
export const getMe = () => api.get<UserResponse>('/me');
export const getCategories = () => api.get<CategoryResponse[]>('/category');
export const getTags = () => api.get<TagResponse[]>('/tag');
export const getAdminPost = (slug: string) => api.get<PostDetailResponse>(`/admin/post/${slug}`);
export const getCategory = (slug: string) => apiNoAuth.get<CategoryResponse>(`/category/${slug}`);
export const getTag = (slug: string) => apiNoAuth.get<TagResponse>(`/tag/${slug}`);
export const createPost = (postData: unknown) => api.post('/post', postData);
export const updatePost = (slug: string, postData: unknown) => api.put(`/post/${slug}`, postData);
export const deletePost = (slug: string) => api.delete(`/post/${slug}`);

// Page API functions
export const getPages = () => api.get<PageResponse[]>('/page');
export const getPage = (slug: string) => api.get<PageResponse>(`/page/${slug}`);
export const getPageAdmin = (slug: string) => api.get<PageResponse>(`/admin/page/${slug}`);
export const createPage = (pageData: unknown) => api.post('/page', pageData);
export const updatePage = (slug: string, pageData: unknown) => api.put(`/page/${slug}`, pageData);
export const deletePage = (slug: string) => api.delete(`/page/${slug}`);

export default api;
