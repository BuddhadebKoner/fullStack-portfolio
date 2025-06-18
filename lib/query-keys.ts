/**
 * Query keys for TanStack Query
 * Centralized location for all query keys to ensure consistency
 */

// Define a type for filter objects
type FilterParams = Record<string, string | number | boolean | undefined>;

export const queryKeys = {
  // Home page data
  home: {
    all: ['home'] as const,
    data: () => [...queryKeys.home.all, 'data'] as const,
  },
  
  // Profile data
  profile: {
    all: ['profile'] as const,
    data: () => [...queryKeys.profile.all, 'data'] as const,
    public: () => [...queryKeys.profile.all, 'public'] as const,
  },
  
  // Blogs
  blogs: {
    all: ['blogs'] as const,
    lists: () => [...queryKeys.blogs.all, 'list'] as const,
    list: (filters: FilterParams) => [...queryKeys.blogs.lists(), filters] as const,
    details: () => [...queryKeys.blogs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.blogs.details(), id] as const,
  },
  
  // Projects
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: FilterParams) => [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  
  // Skills
  skills: {
    all: ['skills'] as const,
    lists: () => [...queryKeys.skills.all, 'list'] as const,
    list: (filters: FilterParams) => [...queryKeys.skills.lists(), filters] as const,
    details: () => [...queryKeys.skills.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.skills.details(), id] as const,
  },
  
  // Work Experience
  workExperience: {
    all: ['workExperience'] as const,
    lists: () => [...queryKeys.workExperience.all, 'list'] as const,
    list: (filters: FilterParams) => [...queryKeys.workExperience.lists(), filters] as const,
    details: () => [...queryKeys.workExperience.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.workExperience.details(), id] as const,
  },
  
  // Analytics
  analytics: {
    all: ['analytics'] as const,
    data: () => [...queryKeys.analytics.all, 'data'] as const,
  },
} as const;
