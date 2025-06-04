import { useState, useEffect } from 'react';

export interface AnalyticsData {
  _id: string;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  totalUsers: number;
  newUsers: number;
  blogViews: number;
  projectViews: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  topPages?: Array<{ page: string; views: number }>;
  referringSources?: Array<{ source: string; visits: number }>;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsApiResponse {
  success: boolean;
  data?: AnalyticsData | any;
  error?: string;
}

interface UseAnalyticsReturn {
  analytics: AnalyticsData | any;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsData | any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/analytics');
      const result: AnalyticsApiResponse = await response.json();

      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    await fetchAnalytics();
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
    refreshAnalytics,
  };
}
