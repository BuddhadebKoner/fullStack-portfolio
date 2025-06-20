import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  skillQueries, 
  skillMutations, 
  type SkillData
} from '@/lib/query-functions';
import { queryKeys } from '@/lib/query-keys';

// Re-export SkillData for convenience
export { type SkillData } from '@/lib/query-functions';

interface CreateSkillData {
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order?: number;
  isVisible?: boolean;
}

interface UpdateSkillData {
  name?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order?: number;
  isVisible?: boolean;
}

interface UseSkillsReturn {
  skills: SkillData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  refreshSkills: () => Promise<void>;
  createSkill: (skillData: CreateSkillData) => Promise<boolean>;
  updateSkill: (id: string, skillData: UpdateSkillData) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
}

export function useSkills(): UseSkillsReturn {
  const queryClient = useQueryClient();

  const {
    data: skills = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(skillQueries.all());

  // Create skill mutation
  const createSkillMutation = useMutation({
    ...skillMutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Update skill mutation
  const updateSkillMutation = useMutation({
    ...skillMutations.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    ...skillMutations.delete,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
      queryClient.removeQueries({ queryKey: queryKeys.skills.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  const refreshSkills = async () => {
    await refetch();
  };

  const createSkill = async (skillData: CreateSkillData): Promise<boolean> => {
    try {
      await createSkillMutation.mutateAsync(skillData);
      return true;
    } catch (error) {
      console.error('Error creating skill:', error);
      return false;
    }
  };

  const updateSkill = async (id: string, skillData: UpdateSkillData): Promise<boolean> => {
    try {
      await updateSkillMutation.mutateAsync({ id, data: skillData });
      return true;
    } catch (error) {
      console.error('Error updating skill:', error);
      return false;
    }
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    try {
      await deleteSkillMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error('Error deleting skill:', error);
      return false;
    }
  };

  return {
    skills,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch skills') : null,
    refetch,
    isFetching,
    refreshSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
}
