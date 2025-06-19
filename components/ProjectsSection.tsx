import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import ProjectCard from "./ProjectCard";
import { ProjectData } from "../hooks/useProjects";

interface Project {
  title: string;
  desc: string;
  img: string;
}

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const router = useRouter();

  const handleCardClick = async (title: string) => {
    try {
      // Fetch the specific project details from the API to get the ID
      const response = await fetch('/api/projects');
      const result = await response.json();

      if (result.success && result.data) {
        const project = result.data.find((p: ProjectData) => p.title === title);
        if (project && project._id) {
          // Navigate to the project page
          router.push(`/project/${project._id}`);
        } else {
          console.error('Project not found or missing ID');
        }
      }
    } catch (error) {
      console.error('Error finding project:', error);
    }
  };

  return (
    <div className="w-full max-w-5xl mb-16">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-xl">Projects</h3>
        <Link 
          href="/project"
          className="text-sm text-[#888] hover:text-white transition-colors px-3 py-1 border border-[#333] rounded-full hover:border-[#555]"
        >
          View All
        </Link>
      </div>
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
    </div>
  );
}
