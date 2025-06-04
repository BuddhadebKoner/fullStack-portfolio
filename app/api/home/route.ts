import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Profile, Blog, Project, Skill, WorkExperience, type IProfile, type IBlog, type IProject, type ISkill, type IWorkExperience } from '@/models';

// GET /api/home - Get all home page data
export async function GET(request: NextRequest) {
   try {
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');

      // Fetch all data in parallel for better performance
      const [
         publicProfile,
         publishedBlogs,
         publishedProjects,
         visibleSkills,
         visibleWorkExperience
      ] = await Promise.all([
         // Get public profile
         Profile.findOne({ isPublic: true })
            .select('-userId')
            .lean(),

         // Get published blogs (limited)
         Blog.find({ isPublished: true })
            .select('title desc slug views likes createdAt')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean(),

         // Get published and featured projects
         Project.find({ isPublished: true })
            .select('title desc img technologies githubUrl liveUrl category featured order')
            .sort({ featured: -1, order: 1, createdAt: -1 })
            .lean(),

         // Get visible skills
         Skill.find({ isVisible: true })
            .select('name category level order')
            .sort({ order: 1, name: 1 })
            .lean(),

         // Get visible work experience
         WorkExperience.find({ isVisible: true })
            .select('company position companyLogo startDate endDate isCurrent description technologies order')
            .sort({ isCurrent: -1, order: 1, startDate: -1 })
            .lean()
      ]);

      // Transform skills data to match the expected format (just names for the skills card)
      const skillNames = visibleSkills.map(skill => skill.name);

      // Transform blogs data to match the expected format
      const blogsData = publishedBlogs.map(blog => ({
         title: blog.title,
         desc: blog.desc,
         slug: blog.slug,
         views: blog.views || 0,
         likes: blog.likes || 0,
         createdAt: blog.createdAt
      }));

      // Transform projects data to match the expected format
      const projectsData = publishedProjects.map(project => ({
         title: project.title,
         desc: project.desc,
         img: project.img,
         technologies: project.technologies || [],
         githubUrl: project.githubUrl,
         liveUrl: project.liveUrl,
         category: project.category,
         featured: project.featured || false
      }));

      // Transform work experience data
      const workExperienceData = visibleWorkExperience.map(exp => ({
         company: exp.company,
         position: exp.position,
         companyLogo: exp.companyLogo,
         startDate: exp.startDate,
         endDate: exp.endDate,
         isCurrent: exp.isCurrent,
         description: exp.description,
         technologies: exp.technologies || []
      }));

      const responseData = {
         profile: publicProfile ? {
            firstName: (publicProfile as any).firstName,
            lastName: (publicProfile as any).lastName,
            bio: (publicProfile as any).bio,
            avatar: (publicProfile as any).avatar,
            socialLinks: (publicProfile as any).socialLinks,
            city: (publicProfile as any).city,
            country: (publicProfile as any).country,
            email: (publicProfile as any).email,
         } : null,
         skills: skillNames,
         blogs: blogsData,
         projects: projectsData,
         workExperience: workExperienceData,
         stats: {
            totalBlogs: publishedBlogs.length,
            totalProjects: publishedProjects.length,
            totalSkills: visibleSkills.length,
            totalExperience: workExperienceData.filter(exp => exp.isCurrent || exp.endDate).length
         }
      };

      return NextResponse.json({
         success: true,
         data: responseData
      });

   } catch (error: any) {
      console.error('Error fetching home page data:', error);
      return NextResponse.json(
         { success: false, error: 'Failed to fetch home page data' },
         { status: 500 }
      );
   }
}
