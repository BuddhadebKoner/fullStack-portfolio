interface SkillsCardProps {
  skills: string[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <div className="bg-[#232323] rounded-xl p-5 flex flex-col gap-3">
      <h3 className="text-lg font-semibold mb-1">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-[#181818] text-white px-3 py-1 rounded-lg text-sm font-medium mb-1"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
