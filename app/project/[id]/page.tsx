'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProject } from '@/hooks/useProjects';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { project, isLoading, error, isFetching } = useProject(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6">
            <h3 className="text-red-400 text-lg font-semibold mb-2">Error Loading Project</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6">
            <h2 className="text-red-400 text-lg font-semibold mb-2">
              Project Not Found
            </h2>
            <p className="text-red-300 mb-4">The project you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white font-sans">
      {/* Show subtle loading indicator for background fetches */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg px-3 py-2 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-blue-400 text-sm">Updating...</span>
          </div>
        </div>
      )}

      <div className="px-3 md:px-0 py-10 flex flex-col items-center">
        <div className="w-full max-w-4xl mt-10">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#aaa] hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Project Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{project.title}</h1>
            <p className="text-lg md:text-xl text-[#ccc] leading-relaxed mb-6">{project.desc}</p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#aaa] mb-6 pb-6 border-b border-[#333]">
              <span>Category: <span className="text-[#ccc]">{project.category}</span></span>
              <span>•</span>
              <span>Order: <span className="text-[#ccc]">{project.order}</span></span>
              <span>•</span>
              <span className={project.featured ? 'text-yellow-400' : 'text-[#ccc]'}>
                {project.featured ? '🌟 Featured' : 'Regular'}
              </span>
              <span>•</span>
              <span className={project.isPublished ? 'text-green-400' : 'text-red-400'}>
                {project.isPublished ? '✅ Published' : '❌ Draft'}
              </span>
            </div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-2 mb-8">
                <h3 className="text-sm font-semibold text-[#aaa] mb-3 uppercase tracking-wider">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, idx: number) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-[#333] text-sm rounded-full text-[#ccc] hover:bg-[#444] transition-colors"
                    >
                      #{tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
                >
                  <FiGithub className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Project Image */}
          {project.img && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <Image
                width={800}
                height={450}
                src={project.img}
                alt={project.title}
                className="w-full h-64 md:h-80 object-cover"
                priority
              />
            </div>
          )}

          {/* Project Details */}
          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Project Details</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-[#aaa] mb-2">Created</h4>
                <p className="text-[#ccc]">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[#aaa] mb-2">Last Updated</h4>
                <p className="text-[#ccc]">
                  {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
