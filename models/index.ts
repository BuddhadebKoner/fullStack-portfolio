// Export all models for easy importing
export { default as Blog, type IBlog } from './blog.model';
export { default as Project, type IProject } from './project.model';
export { default as Skill, type ISkill } from './skill.model';
export { default as WorkExperience, type IWorkExperience } from './workExperience.model';
export { default as Profile, type IProfile } from './profile.model';
export { default as Analytics, type IAnalytics } from './analytics.model';
export { default as AdminActivity, type IAdminActivity } from './adminActivity.model';
export { default as ChatMessage, type IChatMessage } from './chatMessage.model';
export { default as SiteSettings, type ISiteSettings } from './siteSettings.model';

// Type definitions for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Common query types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
  search?: string;
}

// Model aggregation types
export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalLikes: number;
  popularTags: { tag: string; count: number }[];
}

export interface ProjectStats {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  categoriesCount: { category: string; count: number }[];
}

export interface AnalyticsSummary {
  todayViews: number;
  monthlyViews: number;
  totalUsers: number;
  newUsersThisMonth: number;
  topPages: { path: string; views: number }[];
  topReferrers: { source: string; visits: number }[];
}
