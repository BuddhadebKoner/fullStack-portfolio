import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogQueries, blogMutations, type BlogData } from '@/lib/query-functions';
import { queryKeys } from '@/lib/query-keys';

interface UseBlogsReturn {
  blogs: BlogData[] | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  createBlog: {
    mutate: (blogData: Partial<BlogData>) => void;
    isPending: boolean;
    error: Error | null;
  };
  updateBlog: {
    mutate: (variables: { id: string; data: Partial<BlogData> }) => void;
    isPending: boolean;
    error: Error | null;
  };
  deleteBlog: {
    mutate: (id: string) => void;
    isPending: boolean;
    error: Error | null;
  };
}

export function useBlogs(): UseBlogsReturn {
  const queryClient = useQueryClient();

  const {
    data: blogs,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(blogQueries.all());

  // Create blog mutation
  const createBlogMutation = useMutation({
    ...blogMutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Update blog mutation
  const updateBlogMutation = useMutation({
    ...blogMutations.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    ...blogMutations.delete,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
      queryClient.removeQueries({ queryKey: queryKeys.blogs.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  return {
    blogs,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch blogs') : null,
    refetch,
    isFetching,
    createBlog: {
      mutate: createBlogMutation.mutate,
      isPending: createBlogMutation.isPending,
      error: createBlogMutation.error,
    },
    updateBlog: {
      mutate: updateBlogMutation.mutate,
      isPending: updateBlogMutation.isPending,
      error: updateBlogMutation.error,
    },
    deleteBlog: {
      mutate: deleteBlogMutation.mutate,
      isPending: deleteBlogMutation.isPending,
      error: deleteBlogMutation.error,
    },
  };
}

// Hook for single blog by ID
interface UseBlogReturn {
  blog: BlogData | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
}

export function useBlog(id: string): UseBlogReturn {
  const {
    data: blog,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(blogQueries.byId(id));

  return {
    blog,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch blog') : null,
    refetch,
    isFetching,
  };
}

// Hook for single blog by slug
export function useBlogBySlug(slug: string): UseBlogReturn {
  const {
    data: blog,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(blogQueries.bySlug(slug));

  return {
    blog,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch blog') : null,
    refetch,
    isFetching,
  };
}

// Hook for liking a blog
interface UseBlogLikeReturn {
  likeBlog: (blogId: string) => void;
  isLiking: boolean;
  error: Error | null;
}

export function useBlogLike(): UseBlogLikeReturn {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    ...blogMutations.like,
    onSuccess: (data, blogId) => {
      // Update the blog cache with new likes count
      queryClient.setQueryData(queryKeys.blogs.detail(blogId), (oldData: BlogData | undefined) => {
        if (oldData) {
          return { ...oldData, likes: data.likes };
        }
        return oldData;
      });
      
      // Also update the blogs list cache
      queryClient.setQueryData(queryKeys.blogs.lists(), (oldData: BlogData[] | undefined) => {
        if (oldData) {
          return oldData.map(blog => 
            blog._id === blogId ? { ...blog, likes: data.likes } : blog
          );
        }
        return oldData;
      });

      // Invalidate home data to update blog likes there too
      queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
    },
  });

  return {
    likeBlog: likeMutation.mutate,
    isLiking: likeMutation.isPending,
    error: likeMutation.error,
  };
}

// Re-export types for backward compatibility
export type { BlogData };
