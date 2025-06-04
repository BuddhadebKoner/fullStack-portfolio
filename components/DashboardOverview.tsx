"use client";

import { useBlogs } from '@/hooks/useBlogs';
import { useProjects } from '@/hooks/useProjects';
import { useSkills } from '@/hooks/useSkills';
import { useWorkExperience } from '@/hooks/useWorkExperience';
import { useAdminActivities } from '@/hooks/useAdminActivities';

interface DashboardOverviewProps {
  onRefresh?: () => void;
}

export default function DashboardOverview({ onRefresh }: DashboardOverviewProps) {
  const { blogs, isLoading: blogsLoading } = useBlogs();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { skills, isLoading: skillsLoading } = useSkills();
  const { workExperience, isLoading: workExperienceLoading } = useWorkExperience();
  const { adminActivities, isLoading: activitiesLoading } = useAdminActivities();

  const isLoading = blogsLoading || projectsLoading || skillsLoading || workExperienceLoading || activitiesLoading;

  return (
    <div className="space-y-6">
      <h3 className="text-white text-2xl font-semibold">Dashboard Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-lg">📝</span>
            </div>
            <div>
              <p className="text-[#a0a0a0] text-sm">Total Blogs</p>
              <p className="text-white text-2xl font-semibold">
                {blogsLoading ? '...' : blogs.length}
              </p>
            </div>
          </div>
          <div className="text-green-400 text-sm">
            {blogsLoading ? '...' : blogs.filter((blog: any) => blog.isPublished).length} published
          </div>
        </div>

        <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <span className="text-emerald-400 text-lg">🚀</span>
            </div>
            <div>
              <p className="text-[#a0a0a0] text-sm">Total Projects</p>
              <p className="text-white text-2xl font-semibold">
                {projectsLoading ? '...' : projects.length}
              </p>
            </div>
          </div>
          <div className="text-green-400 text-sm">
            {projectsLoading ? '...' : projects.filter((project: any) => project.isFeatured).length} featured
          </div>
        </div>

        <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-lg">💡</span>
            </div>
            <div>
              <p className="text-[#a0a0a0] text-sm">Skills</p>
              <p className="text-white text-2xl font-semibold">
                {skillsLoading ? '...' : skills.length}
              </p>
            </div>
          </div>
          <div className="text-green-400 text-sm">Across all categories</div>
        </div>

        <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 text-lg">💼</span>
            </div>
            <div>
              <p className="text-[#a0a0a0] text-sm">Work Experience</p>
              <p className="text-white text-2xl font-semibold">
                {workExperienceLoading ? '...' : workExperience.length}
              </p>
            </div>
          </div>
          <div className="text-green-400 text-sm">Career positions</div>
        </div>
      </div>

      <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
        <h4 className="text-white text-lg font-semibold mb-4">Recent Admin Activities</h4>
        <div className="space-y-3">
          {activitiesLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-[#a0a0a0] mt-2 text-sm">Loading activities...</p>
            </div>
          ) : (
            <>
              {adminActivities.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-white text-sm">{activity.action || 'Unknown action'}</p>
                    <p className="text-[#a0a0a0] text-xs">{activity.details || 'No details'}</p>
                  </div>
                  <span className="text-[#a0a0a0] text-xs">
                    {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Unknown time'}
                  </span>
                </div>
              ))}
              {adminActivities.length === 0 && (
                <p className="text-[#a0a0a0] text-sm">No recent activities</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
