  import { queryKeys } from './query-keys';

// Types from existing useHomeData.ts
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
  resumeUrl?: string;
}

export interface HomeBlog {
  title: string;
  desc: string;
  content?: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  slug: string;
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
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

/**
 * Fetch home page data
 */
export const fetchHomeData = async (): Promise<HomePageData> => {
  const response = await fetch('/api/home', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: HomeApiResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch home page data');
  }

  return result.data;
};

/**
 * Query function for home data using TanStack Query
 */
export const homeQueries = {
  // Get home page data
  data: () => ({
    queryKey: queryKeys.home.data(),
    queryFn: fetchHomeData,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes when unused
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when internet connection is restored
    refetchInterval: false, // Don't poll automatically
  }),
} as const;

/**
 * Mutation functions for home data
 */
export const homeMutations = {
  // Example: Update profile data
  updateProfile: {
    mutationFn: async (profileData: Partial<HomeProfile>) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // This would be used in the component to invalidate cache
    },
  },
} as const;

// Blog types
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

// Project types
export interface ProjectData {
  _id: string;
  title: string;
  desc: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  img: string;
  category: string;
  order: number;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
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

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
  tags?: string[];
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Fetch all blogs (without pagination - for backward compatibility)
 */
export const fetchBlogs = async (): Promise<BlogData[]> => {
  const response = await fetch('/api/blogs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: BlogApiResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch blogs');
  }

  return Array.isArray(result.data) ? result.data : [result.data];
};

/**
 * Fetch blogs with pagination
 */
export const fetchBlogsPaginated = async (params: PaginationParams = {}): Promise<PaginatedResponse<BlogData>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) {
    searchParams.set('page', params.page.toString());
  }
  if (params.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  if (params.search) {
    searchParams.set('search', params.search);
  }
  if (params.published !== undefined) {
    searchParams.set('published', params.published.toString());
  }
  if (params.tags && params.tags.length > 0) {
    searchParams.set('tags', params.tags.join(','));
  }
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  const response = await fetch(`/api/blogs?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch blogs');
  }

  return {
    data: Array.isArray(result.data) ? result.data : [result.data],
    pagination: result.pagination || {
      page: 1,
      limit: 10,
      total: Array.isArray(result.data) ? result.data.length : 1,
      pages: 1
    }
  };
};

/**
 * Fetch single blog by ID
 */
export const fetchBlogById = async (id: string): Promise<BlogData> => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: BlogApiResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch blog');
  }

  return Array.isArray(result.data) ? result.data[0] : result.data;
};

/**
 * Fetch blog by slug
 */
export const fetchBlogBySlug = async (slug: string): Promise<BlogData> => {
  const response = await fetch(`/api/blogs?slug=${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: BlogApiResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Blog not found');
  }

  const blogArray = Array.isArray(result.data) ? result.data : [result.data];
  if (blogArray.length === 0) {
    throw new Error('Blog not found');
  }

  return blogArray[0];
};

/**
 * Fetch all projects (without pagination - for backward compatibility)
 */
export const fetchProjects = async (): Promise<ProjectData[]> => {
  const response = await fetch('/api/projects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ProjectApiResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch projects');
  }

  return result.data;
};

/**
 * Fetch projects with pagination
 */
export const fetchProjectsPaginated = async (params: PaginationParams = {}): Promise<PaginatedResponse<ProjectData>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) {
    searchParams.set('page', params.page.toString());
  }
  if (params.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  if (params.search) {
    searchParams.set('search', params.search);
  }
  if (params.published !== undefined) {
    searchParams.set('published', params.published.toString());
  }
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  const response = await fetch(`/api/projects?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch projects');
  }

  return {
    data: result.data || [],
    pagination: result.pagination || {
      page: 1,
      limit: 10,
      total: result.data ? result.data.length : 0,
      pages: 1
    }
  };
};

/**
 * Fetch single project by ID
 */
export const fetchProjectById = async (id: string): Promise<ProjectData> => {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ProjectApiResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch project');
  }

  return Array.isArray(result.data) ? result.data[0] : result.data;
};

/**
 * Like a blog
 */
export const likeBlog = async (blogId: string): Promise<{ likes: number }> => {
  const response = await fetch(`/api/blogs/${blogId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to like blog');
  }

  return { likes: result.data.likes };
};

/**
 * Blog query functions
 */
export const blogQueries = {
  // Get all blogs
  all: () => ({
    queryKey: queryKeys.blogs.lists(),
    queryFn: fetchBlogs,
    staleTime: 2 * 60 * 1000, // 2 minutes for blog lists
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  }),

  // Get blogs with pagination
  paginated: (params: PaginationParams) => ({
    queryKey: queryKeys.blogs.paginated(params),
    queryFn: () => fetchBlogsPaginated(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for blog lists
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    keepPreviousData: true, // Keep previous data while fetching new page
  }),

  // Get blog by ID
  byId: (id: string) => ({
    queryKey: queryKeys.blogs.detail(id),
    queryFn: () => fetchBlogById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes for individual blogs
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!id, // Only fetch if ID exists
  }),

  // Get blog by slug
  bySlug: (slug: string) => ({
    queryKey: queryKeys.blogs.detail(slug),
    queryFn: () => fetchBlogBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes for individual blogs
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!slug, // Only fetch if slug exists
  }),
} as const;

/**
 * Project query functions
 */
export const projectQueries = {
  // Get all projects
  all: () => ({
    queryKey: queryKeys.projects.lists(),
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes for project lists
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  }),

  // Get projects with pagination
  paginated: (params: PaginationParams) => ({
    queryKey: queryKeys.projects.paginated(params),
    queryFn: () => fetchProjectsPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes for project lists
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    keepPreviousData: true, // Keep previous data while fetching new page
  }),

  // Get project by ID
  byId: (id: string) => ({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => fetchProjectById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes for individual projects
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!id, // Only fetch if ID exists
  }),
} as const;

/**
 * Blog mutation functions
 */
export const blogMutations = {
  // Like a blog
  like: {
    mutationFn: (blogId: string) => likeBlog(blogId),
  },

  // Create blog
  create: {
    mutationFn: async (blogData: Partial<BlogData>) => {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  },

  // Update blog
  update: {
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogData> }) => {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  },

  // Delete blog
  delete: {
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  },
} as const;

/**
 * Project mutation functions
 */
export const projectMutations = {
  // Create project
  create: {
    mutationFn: async (projectData: Partial<ProjectData>) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  },

  // Update project
  update: {
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectData> }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  },

  // Delete project
  delete: {
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  },
} as const;
