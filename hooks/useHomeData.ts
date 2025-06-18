import { useQuery } from '@tanstack/react-query';
import { homeQueries, type HomePageData } from '@/lib/query-functions';

interface UseHomeDataReturn {
  data: HomePageData | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  isStale: boolean;
}

export function useHomeData(): UseHomeDataReturn {
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
    isStale,
  } = useQuery({
    ...homeQueries.data(),
    refetchInterval: false,
  });

  return {
    data,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch home page data') : null,
    refetch,
    isFetching,
    isStale,
  };
}

// Re-export types for backward compatibility
export type {
  HomeProfile,
  HomeBlog,
  HomeProject,
  HomeWorkExperience,
  HomeStats,
  HomePageData,
} from '@/lib/query-functions';
