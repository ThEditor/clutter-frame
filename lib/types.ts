export interface User {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  site_url: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  token?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface TopPagesStats {
  page: string;
  count: number;
}

export interface DeviceStats {
  device_type: string;
  count: number;
}

export interface TopReferrersStats {
  referrer: string;
  count: number;
}

export interface VisitorGraphStats {
  day: string;
  unique_visitors: number;
}

export interface SiteAnalytics {
  top_pages: TopPagesStats[];
  device_stats: DeviceStats[];
  page_views: number;
  top_referrers: TopReferrersStats[];
  unique_visitors: number,
  visitor_graph: VisitorGraphStats[];
}
