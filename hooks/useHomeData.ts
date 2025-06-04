import { useState, useEffect } from 'react';

export interface HomeProfile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  city?: string;
  country?: string;
  email?: string;
}

export interface HomeBlog {
  title: string;
  desc: string;
  slug?: string;
  views?: number;
  likes?: number;
  createdAt?: string;
}

export interface HomeProject {
  title: string;
  desc: string;
  img: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  featured?: boolean;
}

export interface HomeWorkExperience {
  company: string;
  position: string;
  companyLogo?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies?: string[];
}

export interface HomeStats {
  totalBlogs: number;
  totalProjects: number;
  totalSkills: number;
  totalExperience: number;
}

export interface HomePageData {
  profile: HomeProfile | null;
  skills: string[];
  blogs: HomeBlog[];
  projects: HomeProject[];
  workExperience: HomeWorkExperience[];
  stats: HomeStats;
}

interface HomeApiResponse {
  success: boolean;
  data?: HomePageData;
  error?: string;
}

interface UseHomeDataReturn {
  data: HomePageData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHomeData(): UseHomeDataReturn {
  const [data, setData] = useState<HomePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/home');
       const result: HomeApiResponse = await response.json();


      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch home page data');
      }
    } catch (error) {
      console.error('Error fetching home page data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch home page data');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchHomeData();
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch
  };
}
