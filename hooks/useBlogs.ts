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
  data?: BlogData[] | BlogData;
  error?: string;
  message?: string;
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
  createBlog: (blogData: Partial<BlogData>) => Promise<boolean>;
  updateBlog: (id: string, blogData: Partial<BlogData>) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  getBlog: (id: string) => Promise<BlogData | null>;
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
        const blogArray = Array.isArray(result.data) ? result.data : [result.data];
        setBlogs(blogArray);
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

  const createBlog = async (blogData: Partial<BlogData>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const result: BlogApiResponse = await response.json();

      if (result.success) {
        await refreshBlogs(); // Refresh the list after creating
        return true;
      } else {
        setError(result.error || 'Failed to create blog');
        return false;
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error instanceof Error ? error.message : 'Failed to create blog');
      return false;
    }
  };

  const updateBlog = async (id: string, blogData: Partial<BlogData>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const result: BlogApiResponse = await response.json();

      if (result.success) {
        await refreshBlogs(); // Refresh the list after updating
        return true;
      } else {
        setError(result.error || 'Failed to update blog');
        return false;
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      setError(error instanceof Error ? error.message : 'Failed to update blog');
      return false;
    }
  };

  const deleteBlog = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      const result: BlogApiResponse = await response.json();

      if (result.success) {
        await refreshBlogs(); // Refresh the list after deleting
        return true;
      } else {
        setError(result.error || 'Failed to delete blog');
        return false;
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete blog');
      return false;
    }
  };

  const getBlog = async (id: string): Promise<BlogData | null> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/blogs/${id}`);
      const result: BlogApiResponse = await response.json();

      if (result.success && result.data) {
        return Array.isArray(result.data) ? result.data[0] : result.data;
      } else {
        setError(result.error || 'Failed to fetch blog');
        return null;
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch blog');
      return null;
    }
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
    createBlog,
    updateBlog,
    deleteBlog,
    getBlog,
  };
}
