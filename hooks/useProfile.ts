import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  profileQueries, 
  profileMutations, 
  type ProfileData,
  type ProfileFormData
} from '@/lib/query-functions';
import { queryKeys } from '@/lib/query-keys';

// Re-export types for convenience
export { type ProfileData, type ProfileFormData } from '@/lib/query-functions';

interface UseProfileReturn {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  refetch: () => void;
  isFetching: boolean;
  saveProfile: (data: ProfileFormData) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(profileQueries.data());

  // Save profile mutation (create or update)
  const saveProfileMutation = useMutation({
    ...profileMutations.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  const isCreating = !profile; // If no profile exists, we're in creation mode

  const saveProfile = async (data: ProfileFormData) => {
    try {
      await saveProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  const refreshProfile = async () => {
    await refetch();
  };

  return {
    profile: profile || null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch profile') : null,
    isCreating,
    refetch,
    isFetching,
    saveProfile,
    refreshProfile,
  };
}
