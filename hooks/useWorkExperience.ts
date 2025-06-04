import { useState, useEffect } from 'react';

export interface WorkExperienceData {
  _id: string;
  company: string;
  position: string;
  companyLogo?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies: string[];
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkExperienceApiResponse {
  success: boolean;
  data?: WorkExperienceData[];
  error?: string;
}

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
  fetchWorkExperience: () => Promise<void>;
  refreshWorkExperience: () => Promise<void>;
  createWorkExperience: (data: CreateWorkExperienceData) => Promise<{ success: boolean; data?: WorkExperienceData; error?: string }>;
  updateWorkExperience: (id: string, data: UpdateWorkExperienceData) => Promise<{ success: boolean; data?: WorkExperienceData; error?: string }>;
  deleteWorkExperience: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useWorkExperience(): UseWorkExperienceReturn {
  const [workExperience, setWorkExperience] = useState<WorkExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkExperience = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/work-experience');
      const result: WorkExperienceApiResponse = await response.json();

      if (result.success && result.data) {
        setWorkExperience(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch work experience');
      }
    } catch (error) {
      console.error('Error fetching work experience:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch work experience');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWorkExperience = async () => {
    await fetchWorkExperience();
  };

  const createWorkExperience = async (data: CreateWorkExperienceData) => {
    try {
      const response = await fetch('/api/work-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchWorkExperience(); // Refresh the list
      }

      return result;
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
      const response = await fetch(`/api/work-experience/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchWorkExperience(); // Refresh the list
      }

      return result;
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
      const response = await fetch(`/api/work-experience/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchWorkExperience(); // Refresh the list
      }

      return result;
    } catch (error) {
      console.error('Error deleting work experience:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete work experience'
      };
    }
  };

  useEffect(() => {
    fetchWorkExperience();
  }, []);

  return {
    workExperience,
    isLoading,
    error,
    fetchWorkExperience,
    refreshWorkExperience,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
  };
}
