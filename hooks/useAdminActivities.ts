import { useState, useEffect } from 'react';

export interface AdminActivityData {
  _id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminActivityApiResponse {
  success: boolean;
  data?: AdminActivityData[];
  error?: string;
}

interface UseAdminActivitiesReturn {
  adminActivities: AdminActivityData[];
  isLoading: boolean;
  error: string | null;
  fetchAdminActivities: () => Promise<void>;
  refreshAdminActivities: () => Promise<void>;
}

export function useAdminActivities(): UseAdminActivitiesReturn {
  const [adminActivities, setAdminActivities] = useState<AdminActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/activities');
      const result: AdminActivityApiResponse = await response.json();

      if (result.success && result.data) {
        setAdminActivities(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch admin activities');
      }
    } catch (error) {
      console.error('Error fetching admin activities:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch admin activities');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAdminActivities = async () => {
    await fetchAdminActivities();
  };

  useEffect(() => {
    fetchAdminActivities();
  }, []);

  return {
    adminActivities,
    isLoading,
    error,
    fetchAdminActivities,
    refreshAdminActivities,
  };
}
