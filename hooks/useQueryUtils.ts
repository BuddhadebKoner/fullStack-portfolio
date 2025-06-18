import { useQueryClient } from '@tanstack/react-query';
import { createQueryUtils } from '@/lib/query-utils';

/**
 * Hook to access query utilities
 */
export function useQueryUtils() {
  const queryClient = useQueryClient();
  return createQueryUtils(queryClient);
}
