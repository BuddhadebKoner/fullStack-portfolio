import React, { useEffect } from 'react';
import Image from 'next/image';
import { ProjectData } from '../hooks/useProjects';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
  loading: boolean;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, project, loading }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#404040] shadow-2xl w-full max-w-2xl p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-[#aaa] hover:text-white text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {loading ? (
          <div className="text-center py-10 text-[#aaa]">Loading...</div>
        ) : project ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
            <div className="text-[#b5b5b5] mb-4">{project.desc}</div>
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.map((tech: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-[#333] text-xs rounded-full text-[#ccc]">{tech}</span>
                ))}
              </div>
            )}
            <div className="text-sm text-[#888] mb-2">
              <span>Category: {project.category}</span> &middot; <span>Order: {project.order}</span>
            </div>
            {project.img && (
              <Image
                width={600}
                height={300}
                src={project.img}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg mb-4 border border-[#333]"
              />
            )}
            <div className="flex gap-4 text-xs text-[#888] items-center mb-2">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Live Demo</a>
              )}
            </div>
            <div className="flex gap-4 text-xs text-[#888] items-center">
              <span>{project.featured ? '🌟 Featured' : ''}</span>
              <span>{project.isPublished ? '✅ Published' : '❌ Draft'}</span>
              <span>Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}</span>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-[#f66]">Failed to load project details. Please try again later.</div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
