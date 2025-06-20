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
      <div 
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        <div className="glass-background" />
        <div className="fixed inset-0 opacity-20">
          <div className="glass-grid-pattern" />
        </div>
        <div className="text-center glass-card p-8 rounded-xl relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--main-primary)' }}></div>
          <p className="text-white text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        <div className="glass-background" />
        <div className="fixed inset-0 opacity-20">
          <div className="glass-grid-pattern" />
        </div>
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="glass-card p-6 rounded-lg relative overflow-hidden">
            <div className="glass-grid-pattern opacity-10" />
            <h3 className="text-lg font-semibold mb-2 relative z-10" style={{ color: 'var(--main-primary)' }}>Error Loading Project</h3>
            <p className="mb-4 relative z-10" style={{ color: 'var(--main-secondary)' }}>{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="glass-button px-4 py-2 rounded-lg transition-colors text-white"
              >
                Go Back
              </button>
              <Link
                href="/"
                className="glass-button px-4 py-2 rounded-lg transition-colors text-white"
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
      <div 
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        <div className="glass-background" />
        <div className="fixed inset-0 opacity-20">
          <div className="glass-grid-pattern" />
        </div>
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="glass-card p-6 rounded-lg relative overflow-hidden">
            <div className="glass-grid-pattern opacity-10" />
            <h2 className="text-lg font-semibold mb-2 relative z-10" style={{ color: 'var(--main-primary)' }}>
              Project Not Found
            </h2>
            <p className="mb-4 relative z-10" style={{ color: 'var(--main-secondary)' }}>The project you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/')}
              className="glass-button px-4 py-2 rounded-lg transition-colors text-white"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white font-sans relative"
      style={{ backgroundColor: 'var(--max-bg)' }}
    >
      <div className="glass-background" />
      <div className="fixed inset-0 opacity-20">
        <div className="glass-grid-pattern" />
      </div>
      
      {/* Show subtle loading indicator for background fetches */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="glass-card px-3 py-2 flex items-center space-x-2 relative overflow-hidden">
            <div className="glass-grid-pattern opacity-10" />
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 relative z-10" style={{ borderColor: 'var(--main-primary)' }}></div>
            <span className="text-sm relative z-10" style={{ color: 'var(--main-primary)' }}>Updating...</span>
          </div>
        </div>
      )}

      <div className="px-3 md:px-0 py-10 flex flex-col items-center relative z-10">
        <div className="w-full max-w-4xl">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="glass-button flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-white"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Project Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--main-primary)' }}>{project.title}</h1>
              <p className="text-lg md:text-xl text-[#ccc] leading-relaxed mb-6">{project.desc}</p>

              {/* Meta Information */}
              <div className="glass-card p-4 rounded-lg mb-6 relative overflow-hidden">
                <div className="glass-grid-pattern opacity-10" />
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#aaa] relative z-10">
                  <span>Category: <span className="text-[#ccc]" style={{ color: 'var(--main-secondary)' }}>{project.category}</span></span>
                  <span>•</span>
                  <span>Order: <span className="text-[#ccc]" style={{ color: 'var(--main-secondary)' }}>{project.order}</span></span>
                  <span>•</span>
                  <span className={project.featured ? 'text-yellow-400' : 'text-[#ccc]'}>
                    {project.featured ? '🌟 Featured' : 'Regular'}
                  </span>
                  <span>•</span>
                  <span className={project.isPublished ? 'text-green-400' : 'text-red-400'}>
                    {project.isPublished ? '✅ Published' : '❌ Draft'}
                  </span>
                </div>
              </div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--main-secondary)' }}>Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="glass-button px-3 py-1 text-sm rounded-full text-white transition-colors"
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
                    className="glass-button flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white"
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
                    className="glass-button flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white"
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
            <div className="glass-card rounded-xl p-6 relative overflow-hidden">
              <div className="glass-grid-pattern opacity-10" />
              <h3 className="text-xl font-semibold mb-4 relative z-10" style={{ color: 'var(--main-primary)' }}>Project Details</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm relative z-10">
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--main-secondary)' }}>Created</h4>
                  <p className="text-[#ccc]">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--main-secondary)' }}>Last Updated</h4>
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
