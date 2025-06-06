import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectDetailsModal from "./ProjectDetailsModal";
import { useProjects, ProjectData } from "../hooks/useProjects";

interface Project {
  title: string;
  desc: string;
  img: string;
}

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { projects: allProjects, fetchProjects } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCardClick = async (title: string) => {
    setLoading(true);
    setModalOpen(true);
    // Find the project by title (or use a unique id if available)
    let project = allProjects.find((p) => p.title === title);
    if (!project) {
      await fetchProjects();
      project = allProjects.find((p) => p.title === title);
    }
    setSelectedProject(project ?? null);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mb-16">
      <h3 className="font-semibold text-xl mb-4">Projects</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.title + idx}
            title={project.title}
            desc={project.desc}
            img={project.img}
            index={idx}
            onClick={() => handleCardClick(project.title)}
          />
        ))}
      </div>
      <ProjectDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} project={selectedProject} loading={loading} />
    </div>
  );
}
