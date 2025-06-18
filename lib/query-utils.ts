import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { fetchHomeData, type HomePageData } from './query-functions';

/**
 * Utility functions for managing query cache
 */
export class QueryUtils {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Prefetch home data
   */
  async prefetchHomeData() {
    await this.queryClient.prefetchQuery({
      queryKey: queryKeys.home.data(),
      queryFn: fetchHomeData,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }

  /**
   * Invalidate home data cache
   */
  invalidateHomeData() {
    return this.queryClient.invalidateQueries({
      queryKey: queryKeys.home.all,
    });
  }

  /**
   * Manually update home data cache
   */
  setHomeData(data: HomePageData) {
    this.queryClient.setQueryData(queryKeys.home.data(), data);
  }

  /**
   * Get cached home data
   */
  getHomeData(): HomePageData | undefined {
    return this.queryClient.getQueryData(queryKeys.home.data());
  }

  /**
   * Remove home data from cache
   */
  removeHomeData() {
    this.queryClient.removeQueries({
      queryKey: queryKeys.home.all,
    });
  }

  /**
   * Check if home data is loading
   */
  isHomeDataLoading() {
    return this.queryClient.isFetching({
      queryKey: queryKeys.home.data(),
    }) > 0;
  }

  /**
   * Refetch home data
   */
  refetchHomeData() {
    return this.queryClient.refetchQueries({
      queryKey: queryKeys.home.data(),
    });
  }
}

/**
 * Create a query utils instance
 */
export const createQueryUtils = (queryClient: QueryClient) => {
  return new QueryUtils(queryClient);
};
