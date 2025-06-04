"use client";

import { useProjects, ProjectData } from '@/hooks/useProjects';

interface ProjectsManagementProps {
  onRefresh?: () => void;
}

export default function ProjectsManagement({ onRefresh }: ProjectsManagementProps) {
  const { projects, isLoading, error, refreshProjects } = useProjects();

  const handleRefresh = async () => {
    await refreshProjects();
    if (onRefresh) onRefresh();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Project Management</h3>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-2xl font-semibold">Project Management</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh Projects'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading projects...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-[#404040]">
            <p className="text-white font-medium">Total Projects: {projects.length}</p>
          </div>
          <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
            {projects.map((project: ProjectData, index: number) => (
              <div key={project._id || index} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{project.title}</p>
                  <p className="text-[#a0a0a0] text-sm">{project.desc?.substring(0, 100)}...</p>
                  <p className="text-xs text-[#666] mt-1">
                    Category: {project.category || 'N/A'} | Tech: {project.technologies?.join(', ') || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.isFeatured 
                      ? 'bg-yellow-600/20 text-yellow-400' 
                      : 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {project.isFeatured ? 'Featured' : 'Regular'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.isPublished 
                      ? 'bg-green-600/20 text-green-400' 
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {project.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-[#a0a0a0]">No projects found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
