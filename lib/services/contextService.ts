// contextService.ts
// Provides context data for the chatbot in a structured way (MCP-style)
import { connectToDatabase } from '@/lib/db';
import { Profile, Project, Skill, WorkExperience, Blog } from '@/models';
import type { IProfile, IProject, ISkill, IWorkExperience, IBlog } from '@/models';

export interface ChatContext {
  profile?: IProfile | null;
  skills?: ISkill[];
  projects?: IProject[];
  workExperience?: IWorkExperience[];
  blogs?: IBlog[];
}

export async function getChatContext({
  includeProfile = false,
  includeSkills = false,
  includeProjects = false,
  includeWorkExperience = false,
  includeBlogs = false,
}: {
  includeProfile?: boolean;
  includeSkills?: boolean;
  includeProjects?: boolean;
  includeWorkExperience?: boolean;
  includeBlogs?: boolean;
}): Promise<ChatContext> {
  await connectToDatabase();
  const context: ChatContext = {};

  if (includeProfile) {
    context.profile = (await Profile.findOne().lean()) as unknown as IProfile | null;
  }
  if (includeSkills) {
    context.skills = (await Skill.find({ isVisible: true }).sort({ order: 1 }).lean()) as unknown as ISkill[];
  }
  if (includeProjects) {
    context.projects = (await Project.find({ isPublished: true }).sort({ order: 1 }).lean()) as unknown as IProject[];
  }
  if (includeWorkExperience) {
    context.workExperience = (await WorkExperience.find({ isVisible: true }).sort({ order: 1 }).lean()) as unknown as IWorkExperience[];
  }
  if (includeBlogs) {
    context.blogs = (await Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).lean()) as unknown as IBlog[];
  }

  return context;
}
