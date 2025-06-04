import ProjectCard from "./ProjectCard";

interface Project {
  title: string;
  desc: string;
  img: string;
}

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div className="w-full max-w-5xl mb-16">
      <h3 className="font-semibold text-xl mb-4">Projects</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {projects.map((project, idx) => (
          <ProjectCard
            key={idx}
            title={project.title}
            desc={project.desc}
            img={project.img}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
