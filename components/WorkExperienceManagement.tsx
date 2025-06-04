"use client";

import { useWorkExperience, WorkExperienceData } from '@/hooks/useWorkExperience';

interface WorkExperienceManagementProps {
  onRefresh?: () => void;
}

export default function WorkExperienceManagement({ onRefresh }: WorkExperienceManagementProps) {
  const { workExperience, isLoading, error, refreshWorkExperience } = useWorkExperience();

  const handleRefresh = async () => {
    await refreshWorkExperience();
    if (onRefresh) onRefresh();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Work Experience</h3>
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
        <h3 className="text-white text-2xl font-semibold">Work Experience</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh Experience'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading work experience...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-[#404040]">
            <p className="text-white font-medium">Total Positions: {workExperience.length}</p>
          </div>
          <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
            {workExperience.map((experience: WorkExperienceData, index: number) => (
              <div key={experience._id || index} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{experience.jobTitle}</p>
                    <p className="text-[#a0a0a0] text-sm">{experience.company} • {experience.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#666]">
                      {new Date(experience.startDate).toLocaleDateString()} - {
                        experience.isCurrent ? 'Present' : 
                        experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'N/A'
                      }
                    </p>
                    {experience.isCurrent && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2">{experience.description?.substring(0, 150)}...</p>
                {experience.technologies && experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {experience.technologies.slice(0, 5).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {experience.technologies.length > 5 && (
                      <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 text-xs rounded">
                        +{experience.technologies.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {workExperience.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-[#a0a0a0]">No work experience found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
