import { useState, useEffect } from 'react';

export interface WorkExperienceData {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  achievements?: string[];
  order: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkExperienceApiResponse {
  success: boolean;
  data?: WorkExperienceData[];
  error?: string;
}

interface UseWorkExperienceReturn {
  workExperience: WorkExperienceData[];
  isLoading: boolean;
  error: string | null;
  fetchWorkExperience: () => Promise<void>;
  refreshWorkExperience: () => Promise<void>;
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

  useEffect(() => {
    fetchWorkExperience();
  }, []);

  return {
    workExperience,
    isLoading,
    error,
    fetchWorkExperience,
    refreshWorkExperience,
  };
}
