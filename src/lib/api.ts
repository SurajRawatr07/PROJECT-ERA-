import { sessionService } from '../services/sessionService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = sessionService.getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>)
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include'
  });

  const json = await response.json().catch(() => ({
    success: false,
    message: `HTTP error ${response.status}`
  }));

  if (!response.ok) {
    return {
      success: false,
      message: json.message || json.error || `Request failed with status ${response.status}`,
      ...json
    };
  }

  return json;
}

export const authApi = {
  register: (payload: Record<string, any>) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (credentials: { email: string; password: string }) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () =>
    request('/api/auth/logout', { method: 'POST' }),
  me: () =>
    request('/api/auth/me', { method: 'GET' })
};

export const userApi = {
  getMe: () => request('/api/users/me', { method: 'GET' }),
  updateMe: (updates: Record<string, any>) =>
    request('/api/users/me', { method: 'PATCH', body: JSON.stringify(updates) }),
  getById: (id: string) => request(`/api/users/${encodeURIComponent(id)}`, { method: 'GET' })
};

export const projectApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request(`/api/projects${query}`, { method: 'GET' });
  },
  getById: (id: string) => request(`/api/projects/${encodeURIComponent(id)}`, { method: 'GET' }),
  create: (payload: Record<string, any>) =>
    request('/api/projects', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, updates: Record<string, any>) =>
    request(`/api/projects/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  delete: (id: string) =>
    request(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  continueProject: (id: string, payload: Record<string, any>) =>
    request(`/api/projects/${encodeURIComponent(id)}/continue`, { method: 'POST', body: JSON.stringify(payload) }),
  getLineage: (id: string) =>
    request(`/api/projects/${encodeURIComponent(id)}/lineage`, { method: 'GET' })
};

export const collaborationApi = {
  request: (payload: { projectId: string; roleInterest: string; message: string }) =>
    request('/api/collaboration/request', { method: 'POST', body: JSON.stringify(payload) }),
  getReceived: () => request('/api/collaboration/received', { method: 'GET' }),
  getSent: () => request('/api/collaboration/sent', { method: 'GET' }),
  accept: (id: string) => request(`/api/collaboration/${encodeURIComponent(id)}/accept`, { method: 'PATCH' }),
  reject: (id: string) => request(`/api/collaboration/${encodeURIComponent(id)}/reject`, { method: 'PATCH' })
};

export const reviewApi = {
  listForProject: (projectId: string) =>
    request(`/api/projects/${encodeURIComponent(projectId)}/reviews`, { method: 'GET' }),
  createForProject: (projectId: string, payload: Record<string, any>) =>
    request(`/api/projects/${encodeURIComponent(projectId)}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export const verificationApi = {
  list: () => request('/api/verifications', { method: 'GET' }),
  submit: (payload: Record<string, any>) =>
    request('/api/verifications', { method: 'POST', body: JSON.stringify(payload) }),
  review: (id: string, payload: { status: 'VERIFIED' | 'REJECTED'; rejectionReason?: string }) =>
    request(`/api/verifications/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
};

export const notificationApi = {
  list: () => request('/api/notifications', { method: 'GET' }),
  markRead: (id: string) =>
    request(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),
  markAllRead: () =>
    request('/api/notifications/read-all', { method: 'PATCH' })
};
