import { User, Site, AuthResponse, SiteAnalytics, ApiError } from "./types";

export const API_BASE_URL = "https://studio.phy0.in";

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = errorText || `API error: ${response.status}`;
      const error: ApiError = { 
        message: errorMessage, 
        status: response.status 
      };
      throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> => 
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  register: (username: string, email: string, password: string): Promise<AuthResponse> => 
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  logout: (): Promise<AuthResponse> =>
    fetchApi<AuthResponse>('/auth/logout', { method: 'POST' }),
    
  getCurrentUser: (): Promise<User> => 
    fetchApi<User>('/users/me'),
};

export const sitesApi = {
  getAllSites: (): Promise<Site[]> => 
    fetchApi<Site[]>('/sites/all'),
    
  getSiteById: (id: string): Promise<Site> => 
    fetchApi<Site>(`/sites/${id}`),
    
  createSite: (siteUrl: string): Promise<{
    site_id: string;
    message: string;
  }> => 
    fetchApi<{
      site_id: string;
      message: string;
    }>('/sites/', {
      method: 'POST',
      body: JSON.stringify({ 
        site_url: siteUrl
      }),
    }),
    
  deleteSite: (id: string): Promise<{ success: boolean, message: string }> => 
    fetchApi<{ success: boolean, message: string }>(`/sites/${id}`, {
      method: 'DELETE',
    }),
    
  getSiteAnalytics: (id: string, from: Date, to: Date): Promise<SiteAnalytics> => 
    fetchApi<SiteAnalytics>(`/sites/${id}/analytics?from=${formatDate(from)}&to=${formatDate(to)}`),
};
