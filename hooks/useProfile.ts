import { useState, useEffect } from 'react';
import { ProfileData, ProfileApiResponse, ProfileFormData } from '@/types/profile';

interface UseProfileReturn {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  fetchProfile: () => Promise<void>;
  saveProfile: (data: ProfileFormData) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/profile');
      const result: ProfileApiResponse = await response.json();

      console.log('Profile fetch result:', result);

      if (result.success && result.data) {
        setProfile(result.data);
        setIsCreating(false);
      } else if (response.status === 404) {
        // Profile not found, user needs to create one
        setProfile(null);
        setIsCreating(true);
      } else {
        throw new Error(result.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (data: ProfileFormData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/profile', {
        method: 'PUT', // Always use PUT since our API now handles upsert
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: ProfileApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save profile');
      }

      setProfile(result.data!);
      setIsCreating(false); // After successful save, we're no longer in creating mode
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    isCreating,
    fetchProfile,
    saveProfile,
    refreshProfile,
  };
}
