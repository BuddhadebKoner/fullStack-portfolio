import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  workExperienceQueries, 
  workExperienceMutations, 
  type WorkExperienceData
} from '@/lib/query-functions';
import { queryKeys } from '@/lib/query-keys';

// Re-export WorkExperienceData for convenience
export { type WorkExperienceData } from '@/lib/query-functions';

interface CreateWorkExperienceData {
  company: string;
  position: string;
  companyLogo?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  technologies?: string[];
  order?: number;
  isVisible?: boolean;
}

interface UpdateWorkExperienceData extends Partial<CreateWorkExperienceData> {}

interface UseWorkExperienceReturn {
  workExperience: WorkExperienceData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  refreshWorkExperience: () => Promise<void>;
  createWorkExperience: (data: CreateWorkExperienceData) => Promise<{ success: boolean; data?: WorkExperienceData; error?: string }>;
  updateWorkExperience: (id: string, data: UpdateWorkExperienceData) => Promise<{ success: boolean; data?: WorkExperienceData; error?: string }>;
  deleteWorkExperience: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useWorkExperience(): UseWorkExperienceReturn {
  const queryClient = useQueryClient();

  const {
    data: workExperience = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(workExperienceQueries.all());

  // Create work experience mutation
  const createWorkExperienceMutation = useMutation({
    ...workExperienceMutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workExperience.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Update work experience mutation
  const updateWorkExperienceMutation = useMutation({
    ...workExperienceMutations.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workExperience.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.workExperience.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Delete work experience mutation
  const deleteWorkExperienceMutation = useMutation({
    ...workExperienceMutations.delete,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workExperience.all });
      queryClient.removeQueries({ queryKey: queryKeys.workExperience.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  const refreshWorkExperience = async () => {
    await refetch();
  };

  const createWorkExperience = async (data: CreateWorkExperienceData) => {
    try {
      const result = await createWorkExperienceMutation.mutateAsync(data);
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error creating work experience:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create work experience'
      };
    }
  };

  const updateWorkExperience = async (id: string, data: UpdateWorkExperienceData) => {
    try {
      const result = await updateWorkExperienceMutation.mutateAsync({ id, data });
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error updating work experience:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update work experience'
      };
    }
  };

  const deleteWorkExperience = async (id: string) => {
    try {
      await deleteWorkExperienceMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting work experience:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete work experience'
      };
    }
  };

  return {
    workExperience,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch work experience') : null,
    refetch,
    isFetching,
    refreshWorkExperience,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
  };
}
