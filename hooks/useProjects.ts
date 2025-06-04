import { useState, useEffect } from 'react';

export interface ProjectData {
  _id: string;
  title: string;
  desc: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  img: string; // Changed from imageUrl to img to match model
  category: string;
  order: number;
  featured: boolean; // Changed from isFeatured to featured to match model
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectApiResponse {
  success: boolean;
  data?: ProjectData[];
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UseProjectsReturn {
  projects: ProjectData[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  createProject: (projectData: Partial<ProjectData>) => Promise<boolean>;
  updateProject: (id: string, projectData: Partial<ProjectData>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/projects');
      const result: ProjectApiResponse = await response.json();

      if (result.success && result.data) {
        setProjects(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  const createProject = async (projectData: Partial<ProjectData>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result: ProjectApiResponse = await response.json();

      if (result.success) {
        await refreshProjects(); // Refresh the list after creating
        return true;
      } else {
        setError(result.error || 'Failed to create project');
        return false;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project');
      return false;
    }
  };

  const updateProject = async (id: string, projectData: Partial<ProjectData>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result: ProjectApiResponse = await response.json();

      if (result.success) {
        await refreshProjects(); // Refresh the list after updating
        return true;
      } else {
        setError(result.error || 'Failed to update project');
        return false;
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to update project');
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      const result: ProjectApiResponse = await response.json();

      if (result.success) {
        await refreshProjects(); // Refresh the list after deleting
        return true;
      } else {
        setError(result.error || 'Failed to delete project');
        return false;
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete project');
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
