import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Profile, Blog, Project, Skill, WorkExperience } from '@/models';

interface BlogData {
   title: string;
   desc: string;
   slug: string;
   views: number;
   likes: number;
   createdAt: Date;
}

interface ProjectData {
   title: string;
   desc: string;
   img: string;
   technologies: string[];
   githubUrl: string;
   liveUrl: string;
   category: string;
   featured: boolean;
}

interface WorkExperienceData {
   company: string;
   position: string;
   companyLogo: string;
   startDate: Date;
   endDate: Date | null;
   isCurrent: boolean;
   description: string;
   technologies: string[];
}

interface MongoProfile {
   firstName?: string;
   lastName?: string;
   bio?: string;
   avatar?: string;
   socialLinks?: Record<string, string>;
   city?: string;
   country?: string;
   email?: string;
   [key: string]: unknown;
}

export async function GET(request: NextRequest) {
   try {
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '5');

      const [
         publicProfile,
         publishedBlogs,
         publishedProjects,
         visibleSkills,
         visibleWorkExperience
      ] = await Promise.all([
         Profile.findOne({ isPublic: true })
            .select('firstName lastName bio avatar socialLinks city country email resumeUrl')
            .lean() as Promise<MongoProfile | null>,

         Blog.find({ isPublished: true })
            .select('title desc slug views likes createdAt')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean(),

         Project.find({ isPublished: true })
            .select('title desc img technologies githubUrl liveUrl category featured order')
            .sort({ featured: -1, order: 1, createdAt: -1 })
            .lean(),

         Skill.find({ isVisible: true })
            .select('name category level order')
            .sort({ order: 1, name: 1 })
            .lean(),

         WorkExperience.find({ isVisible: true })
            .select('company position companyLogo startDate endDate isCurrent description technologies order')
            .sort({ isCurrent: -1, order: 1, startDate: -1 })
            .lean()
      ]);

      const skillNames = (visibleSkills as unknown as Array<{ name: string }>).map(skill => skill.name);

      const blogsData: BlogData[] = (publishedBlogs as Array<Partial<BlogData>>).map((blog) => ({
         title: blog.title ?? '',
         desc: blog.desc ?? '',
         slug: blog.slug ?? '',
         views: blog.views ?? 0,
         likes: blog.likes ?? 0,
         createdAt: blog.createdAt ?? new Date(0)
      }));

      const projectsData: ProjectData[] = (publishedProjects as Array<Partial<ProjectData>>).map((project) => ({
         title: project.title ?? '',
         desc: project.desc ?? '',
         img: project.img ?? '',
         technologies: project.technologies ?? [],
         githubUrl: project.githubUrl ?? '',
         liveUrl: project.liveUrl ?? '',
         category: project.category ?? '',
         featured: project.featured ?? false
      }));

      const workExperienceData: WorkExperienceData[] = (visibleWorkExperience as Array<Partial<WorkExperienceData>>).map((exp) => ({
         company: exp.company ?? '',
         position: exp.position ?? '',
         companyLogo: exp.companyLogo ?? '',
         startDate: exp.startDate ?? new Date(0),
         endDate: exp.endDate ?? null,
         isCurrent: exp.isCurrent ?? false,
         description: exp.description ?? '',
         technologies: exp.technologies ?? []
      }));

      const responseData = {
         profile: publicProfile ? {
            firstName: publicProfile.firstName || '',
            lastName: publicProfile.lastName || '',
            bio: publicProfile.bio || '',
            avatar: publicProfile.avatar || '',
            socialLinks: publicProfile.socialLinks || {},
            city: publicProfile.city || '',
            country: publicProfile.country || '',
            email: publicProfile.email || '',
            resumeUrl: publicProfile.resumeUrl || '',
         } : null,
         skills: skillNames,
         blogs: blogsData,
         projects: projectsData,
         workExperience: workExperienceData,
         stats: {
            totalBlogs: blogsData.length,
            totalProjects: projectsData.length,
            totalSkills: skillNames.length,
            totalExperience: workExperienceData.filter(exp => exp.isCurrent || exp.endDate).length
         }
      };

      return NextResponse.json({
         success: true,
         data: responseData
      });

   } catch (error: unknown) {
      console.error('Error fetching home page data:', error);
      return NextResponse.json(
         { success: false, error: 'Failed to fetch home page data' },
         { status: 500 }
      );
   }
}
