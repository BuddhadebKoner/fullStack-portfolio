import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectQueries, projectMutations, type ProjectData } from '@/lib/query-functions';
import { queryKeys } from '@/lib/query-keys';

interface UseProjectsReturn {
  projects: ProjectData[] | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  createProject: {
    mutate: (projectData: Partial<ProjectData>) => void;
    isPending: boolean;
    error: Error | null;
  };
  updateProject: {
    mutate: (variables: { id: string; data: Partial<ProjectData> }) => void;
    isPending: boolean;
    error: Error | null;
  };
  deleteProject: {
    mutate: (id: string) => void;
    isPending: boolean;
    error: Error | null;
  };
}

export function useProjects(): UseProjectsReturn {
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(projectQueries.all());

  // Create project mutation
  const createProjectMutation = useMutation({
    ...projectMutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    ...projectMutations.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    ...projectMutations.delete,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.removeQueries({ queryKey: queryKeys.projects.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  return {
    projects,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch projects') : null,
    refetch,
    isFetching,
    createProject: {
      mutate: createProjectMutation.mutate,
      isPending: createProjectMutation.isPending,
      error: createProjectMutation.error,
    },
    updateProject: {
      mutate: updateProjectMutation.mutate,
      isPending: updateProjectMutation.isPending,
      error: updateProjectMutation.error,
    },
    deleteProject: {
      mutate: deleteProjectMutation.mutate,
      isPending: deleteProjectMutation.isPending,
      error: deleteProjectMutation.error,
    },
  };
}

// Hook for single project by ID
interface UseProjectReturn {
  project: ProjectData | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
}

export function useProject(id: string): UseProjectReturn {
  const {
    data: project,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(projectQueries.byId(id));

  return {
    project,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch project') : null,
    refetch,
    isFetching,
  };
}

// Re-export types for backward compatibility
export type { ProjectData };
