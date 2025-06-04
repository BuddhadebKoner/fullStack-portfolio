import { useState, useEffect } from 'react';

export interface BlogData {
  _id: string;
  title: string;
  desc: string;
  content?: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  slug: string;
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogApiResponse {
  success: boolean;
  data?: BlogData[];
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UseBlogsReturn {
  blogs: BlogData[];
  isLoading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  refreshBlogs: () => Promise<void>;
}

export function useBlogs(): UseBlogsReturn {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/blogs');
      const result: BlogApiResponse = await response.json();

      if (result.success && result.data) {
        setBlogs(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBlogs = async () => {
    await fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    isLoading,
    error,
    fetchBlogs,
    refreshBlogs,
  };
}
