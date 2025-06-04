interface WorkExperienceData {
  company: string;
  position: string;
  companyLogo?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies?: string[];
}

interface WorkExperienceProps {
  workExperience?: WorkExperienceData[];
}

export default function WorkExperience({ workExperience = [] }: WorkExperienceProps) {
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // If no work experience data, show a placeholder or hide the section
  if (workExperience.length === 0) {
    return (
      <div className="w-full max-w-5xl mb-10">
        <h3 className="font-semibold text-xl mb-4">Work Experience</h3>
        <div className="bg-[#232323] p-5 rounded-xl border border-[#232323] text-center">
          <p className="text-[#b5b5b5] text-sm">No work experience available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mb-10">
      <h3 className="font-semibold text-xl mb-4">Work Experience</h3>
      <div className="space-y-4">
        {workExperience.map((experience, index) => (
          <div 
            key={index} 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#232323] p-5 rounded-xl border border-[#232323]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
                {experience.companyLogo ? (
                  <img 
                    src={experience.companyLogo} 
                    alt={`${experience.company} logo`} 
                    className="w-8 h-8 object-contain" 
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-semibold">
                      {experience.company.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-base">{experience.company}</div>
                <div className="text-[#b5b5b5] text-sm">{experience.position}</div>
                {experience.technologies && experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {experience.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {experience.technologies.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 text-xs rounded">
                        +{experience.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-[#b5b5b5] text-sm mt-3 sm:mt-0 flex items-center gap-2">
              <span>
                {formatDate(experience.startDate)} - {
                  experience.isCurrent ? 'Present' : 
                  experience.endDate ? formatDate(experience.endDate) : 'Present'
                }
              </span>
              {experience.isCurrent && (
                <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                  Current
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
