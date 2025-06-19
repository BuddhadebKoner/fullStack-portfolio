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
    <div className="bg-[#232323] rounded-xl p-5 flex flex-col gap-3">
      <h3 className="text-lg font-semibold mb-1">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-[#181818] text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
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
