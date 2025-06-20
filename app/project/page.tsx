"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useProjectsPaginated } from '@/hooks/useProjects';
import ProjectCard from '@/components/ProjectCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/navigation';

export default function AllProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 8 //8 projects per page for a nice grid
  const router = useRouter();

  const { projects, pagination, isLoading, error, isFetching } = useProjectsPaginated({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    published: true, // Only show published projects
    sort: 'order', // Sort by order field
  });

  const handleCardClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (isLoading && !projects && !searchQuery) {
    return (
      <div 
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        <div className="glass-background" />
        <div className="fixed inset-0 opacity-20">
          <div className="glass-grid-pattern" />
        </div>
        <div className="w-full max-w-6xl relative z-10">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="glass-button inline-flex items-center px-3 py-2 rounded-lg transition-colors mb-4 text-white"
            >
              <svg width="20" height="20" fill="none" className="mr-2">
                <path d="M13 16l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-primary)' }}>All Projects</h1>
            <p className="text-[#888]">Explore my complete portfolio of work</p>
          </div>

          {/* Loading State */}
          <div className="text-center py-20">
            <div className="glass-card p-8 rounded-xl relative overflow-hidden">
              <div className="glass-grid-pattern opacity-10" />
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 relative z-10" style={{ borderColor: 'var(--main-primary)' }}></div>
              <p className="text-white text-lg relative z-10">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        <div className="glass-background" />
        <div className="fixed inset-0 opacity-20">
          <div className="glass-grid-pattern" />
        </div>
        <div className="w-full max-w-6xl relative z-10">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="glass-button inline-flex items-center px-3 py-2 rounded-lg transition-colors mb-4 text-white"
            >
              <svg width="20" height="20" fill="none" className="mr-2">
                <path d="M13 16l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-primary)' }}>All Projects</h1>
            <p className="text-[#888]">Explore my complete portfolio of work</p>
          </div>

          {/* Error State */}
          <div className="text-center py-20">
            <div className="glass-card p-6 rounded-lg max-w-md mx-auto relative overflow-hidden">
              <div className="glass-grid-pattern opacity-10" />
              <h2 className="text-lg font-semibold mb-2 relative z-10" style={{ color: 'var(--main-primary)' }}>
                Error Loading Projects
              </h2>
              <p className="mb-4 relative z-10" style={{ color: 'var(--main-secondary)' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="glass-button px-4 py-2 rounded-lg transition-colors text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center relative"
      style={{ backgroundColor: 'var(--max-bg)' }}
    >
      <div className="glass-background" />
      <div className="fixed inset-0 opacity-20">
        <div className="glass-grid-pattern" />
      </div>
      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="glass-button inline-flex items-center px-3 py-2 rounded-lg transition-colors mb-4 text-white"
          >
            <svg width="20" height="20" fill="none" className="mr-2">
              <path d="M13 16l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-primary)' }}>All Projects</h1>
          <p className="text-[#888]">Explore my complete portfolio of work</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search projects..."
          />
        </div>

        {/* Results Summary */}
        {pagination && (
          <div className="mb-6 text-[#888] text-sm">
            {searchQuery ? (
              <p>
                Found {pagination.total} result{pagination.total !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </p>
            ) : (
              <p>
                Showing {Math.min((currentPage - 1) * pageSize + 1, pagination.total)} - {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} projects
              </p>
            )}
          </div>
        )}

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <>
            <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {projects.map((project, idx) => (
                  <ProjectCard
                    key={project._id || idx}
                    title={project.title}
                    desc={project.desc}
                    img={project.img}
                    index={idx}
                    onClick={() => handleCardClick(project._id)}
                  />
                ))}
              </div>
            </div>

            {/* Loading indicator for filtering - positioned as overlay */}
            {isFetching && (
              <div className="fixed bottom-6 right-6 z-50">
                <div className="glass-card px-4 py-3 shadow-lg relative overflow-hidden">
                  <div className="glass-grid-pattern opacity-10" />
                  <div className="flex items-center relative z-10">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: 'var(--main-primary)' }}></div>
                    <span className="text-white text-sm">Searching...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
                isLoading={isFetching}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-[#232323] rounded-xl p-8 border border-[#242424] max-w-md mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No projects found' : 'No Projects Yet'}
              </h2>
              <p className="text-[#888] mb-4">
                {searchQuery 
                  ? `No projects match your search for "${searchQuery}". Try a different search term.`
                  : "I haven't added any projects yet. Check back soon for exciting work!"
                }
              </p>
              {searchQuery ? (
                <button
                  onClick={handleClearSearch}
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              ) : (
                <Link 
                  href="/"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Explore Other Sections
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}