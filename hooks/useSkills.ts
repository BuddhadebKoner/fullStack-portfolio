import { useState, useEffect } from 'react';

export interface SkillData {
  _id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string;
  description?: string;
  experience?: number;
  isPublic: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SkillApiResponse {
  success: boolean;
  data?: SkillData[];
  error?: string;
}

interface UseSkillsReturn {
  skills: SkillData[];
  isLoading: boolean;
  error: string | null;
  fetchSkills: () => Promise<void>;
  refreshSkills: () => Promise<void>;
}

export function useSkills(): UseSkillsReturn {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/skills');
      const result: SkillApiResponse = await response.json();

      if (result.success && result.data) {
        setSkills(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch skills');
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch skills');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSkills = async () => {
    await fetchSkills();
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    isLoading,
    error,
    fetchSkills,
    refreshSkills,
  };
}
