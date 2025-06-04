import { useState, useEffect } from 'react';

export interface SkillData {
  _id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SkillApiResponse {
  success: boolean;
  data?: SkillData | SkillData[];
  error?: string;
  message?: string;
}

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
  fetchSkills: () => Promise<void>;
  refreshSkills: () => Promise<void>;
  createSkill: (skillData: CreateSkillData) => Promise<boolean>;
  updateSkill: (id: string, skillData: UpdateSkillData) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
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

      if (result.success && Array.isArray(result.data)) {
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

  const createSkill = async (skillData: CreateSkillData): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      });

      const result: SkillApiResponse = await response.json();

      if (result.success) {
        await refreshSkills(); // Refresh the list after creating
        return true;
      } else {
        setError(result.error || 'Failed to create skill');
        return false;
      }
    } catch (error) {
      console.error('Error creating skill:', error);
      setError(error instanceof Error ? error.message : 'Failed to create skill');
      return false;
    }
  };

  const updateSkill = async (id: string, skillData: UpdateSkillData): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      });

      const result: SkillApiResponse = await response.json();

      if (result.success) {
        await refreshSkills(); // Refresh the list after updating
        return true;
      } else {
        setError(result.error || 'Failed to update skill');
        return false;
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      setError(error instanceof Error ? error.message : 'Failed to update skill');
      return false;
    }
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });

      const result: SkillApiResponse = await response.json();

      if (result.success) {
        await refreshSkills(); // Refresh the list after deleting
        return true;
      } else {
        setError(result.error || 'Failed to delete skill');
        return false;
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete skill');
      return false;
    }
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
    createSkill,
    updateSkill,
    deleteSkill,
  };
}
