import Image from 'next/image';

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
      <div className="w-full max-w-5xl mb-10 relative z-10">
        <h3 className="font-semibold text-xl mb-4" style={{ color: 'var(--main-primary)' }}>Work Experience</h3>
        <div className="glass-card p-5 rounded-xl text-center relative overflow-hidden">
          <div className="glass-grid-pattern opacity-10" />
          <p className="text-[#b5b5b5] text-sm relative z-10">No work experience available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mb-10 relative z-10">
      <h3 className="font-semibold text-xl mb-4" style={{ color: 'var(--main-primary)' }}>Work Experience</h3>
      <div className="space-y-4">
        {workExperience.map((experience, index) => (
          <div 
            key={index} 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between glass-card p-5 rounded-xl relative overflow-hidden"
          >
            <div className="glass-grid-pattern opacity-10" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
                {experience.companyLogo ? (
                  <Image 
                    src={experience.companyLogo} 
                    alt={`${experience.company} logo`} 
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain rounded-full" 
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-semibold">
                      {experience.company.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="relative z-10">
                <div className="font-semibold text-base" style={{ color: 'var(--main-primary)' }}>{experience.company}</div>
                <div className="text-[#b5b5b5] text-sm">{experience.position}</div>
                {experience.technologies && experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {experience.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="glass-button px-2 py-0.5 text-xs rounded text-white"
                      >
                        {tech}
                      </span>
                    ))}
                    {experience.technologies.length > 3 && (
                      <span className="glass-button px-2 py-0.5 text-xs rounded text-white">
                        +{experience.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-[#b5b5b5] text-sm mt-3 sm:mt-0 flex items-center gap-2 relative z-10">
              <span style={{ color: 'var(--main-secondary)' }}>
                {formatDate(experience.startDate)} - {
                  experience.isCurrent ? 'Present' : 
                  experience.endDate ? formatDate(experience.endDate) : 'Present'
                }
              </span>
              {experience.isCurrent && (
                <span className="glass-button px-2 py-0.5 text-xs rounded-full text-white">
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
