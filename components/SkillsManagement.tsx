"use client";

import { useSkills, SkillData } from '@/hooks/useSkills';

interface SkillsManagementProps {
  onRefresh?: () => void;
}

export default function SkillsManagement({ onRefresh }: SkillsManagementProps) {
  const { skills, isLoading, error, refreshSkills } = useSkills();

  const handleRefresh = async () => {
    await refreshSkills();
    if (onRefresh) onRefresh();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Skills Management</h3>
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
        <h3 className="text-white text-2xl font-semibold">Skills Management</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh Skills'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading skills...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-[#404040]">
            <p className="text-white font-medium">Total Skills: {skills.length}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {skills.map((skill: SkillData, index: number) => (
              <div key={skill._id || index} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#404040]">
                <div className="flex items-center gap-3 mb-2">
                  {skill.icon && <span className="text-2xl">{skill.icon}</span>}
                  <div>
                    <p className="text-white font-medium">{skill.name}</p>
                    <p className="text-[#a0a0a0] text-sm">{skill.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    skill.level === 'Expert' ? 'bg-green-600/20 text-green-400' :
                    skill.level === 'Advanced' ? 'bg-blue-600/20 text-blue-400' :
                    skill.level === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {skill.level}
                  </span>
                  {skill.experience && (
                    <span className="text-xs text-[#666]">
                      {skill.experience}+ years
                    </span>
                  )}
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="col-span-full p-8 text-center">
                <p className="text-[#a0a0a0]">No skills found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
