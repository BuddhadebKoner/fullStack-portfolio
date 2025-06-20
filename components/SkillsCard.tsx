import Image from "next/image";
import { useState } from "react";

interface SkillsCardProps {
  skills: string[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const getIconUrl = (skill: string) => {
    const skillName = skill.toLowerCase().replace(/\s+/g, "");
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skillName}/${skillName}-original.svg`;
  };

  const handleImageError = (skill: string) => {
    setFailedImages((prev) => new Set(prev).add(skill));
  };

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3 relative z-10">
      <div className="glass-grid-pattern opacity-20" />
        <h3 className="text-lg font-semibold mb-1 relative z-10" style={{ color: 'var(--main-primary)' }}>Skills</h3>
      <div className="flex flex-wrap gap-2 relative z-10">
        {skills.map((skill) => (
          <span
            key={skill}
            className="glass-button text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            {!failedImages.has(skill) && (
              <Image
                src={getIconUrl(skill)}
                alt={`${skill} icon`}
                width={18}
                height={18}
                className="flex-shrink-0"
                onError={() => handleImageError(skill)}
              />
            )}
            <span className="whitespace-nowrap">{skill}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
