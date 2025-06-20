import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export interface ChatAnalytics {
  totalMessages: number;
  uniqueSessions: number;
  messagesByDate: Array<{
    _id: { date: string; sender: string };
    count: number;
  }>;
  messageTypes: Array<{
    _id: string;
    count: number;
  }>;
  activeUsers: Array<{
    _id: string;
    messageCount: number;
    lastMessage: string;
    userName?: string;
  }>;
}

export interface BlogAnalytics {
  totalBlogs: number;
  publishedBlogs: number;
  totalViews: number;
  totalLikes: number;
  blogsByDate: Array<{
    _id: string;
    count: number;
    totalViews: number;
    totalLikes: number;
  }>;
  topBlogs: Array<{
    _id: string;
    title: string;
    views: number;
    likes: number;
    createdAt: string;
    publishedAt?: string;
    tags: string[];
  }>;
  engagement: Array<{
    _id: string;
    averageViews: number;
    averageLikes: number;
    blogCount: number;
  }>;
  tagStats: Array<{
    _id: string;
    count: number;
    totalViews: number;
    totalLikes: number;
  }>;
}

export interface AnalyticsData {
  chat: ChatAnalytics;
  blogs: BlogAnalytics;
  timeRange: number;
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  error?: string;
}

export const fetchAnalytics = async (timeRange: number = 30): Promise<AnalyticsData> => {
  const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
  const result: AnalyticsResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch analytics');
  }

  return result.data;
};

interface UseAnalyticsReturn {
  analytics: AnalyticsData | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
}

export function useAnalytics(timeRange: number = 30): UseAnalyticsReturn {
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.admin.analytics(timeRange),
    queryFn: () => fetchAnalytics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  return {
    analytics,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch analytics') : null,
    refetch,
    isFetching,
  };
}
