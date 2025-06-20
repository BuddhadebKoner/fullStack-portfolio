"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useBlogsPaginated } from '@/hooks/useBlogs';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';

export default function AllBlogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 8; // 8 blogs per page for a nice grid

  const { blogs, pagination, isLoading, error, isFetching } = useBlogsPaginated({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    published: true, // Only show published blogs
    sort: '-createdAt', // Sort by newest first
  });

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

  if (isLoading && !blogs && !searchQuery) {
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-primary)' }}>All Blogs</h1>
            <p className="text-[#888]">Discover all my latest thoughts and insights</p>
          </div>

          {/* Loading State */}
          <div className="text-center py-20">
            <div className="glass-card p-8 rounded-xl relative overflow-hidden">
              <div className="glass-grid-pattern opacity-10" />
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 relative z-10" style={{ borderColor: 'var(--main-primary)' }}></div>
              <p className="text-white text-lg relative z-10">Loading blogs...</p>
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-primary)' }}>All Blogs</h1>
            <p className="text-[#888]">Discover all my latest thoughts and insights</p>
          </div>

          {/* Error State */}
          <div className="text-center py-20">
            <div className="glass-card p-6 rounded-lg max-w-md mx-auto relative overflow-hidden">
              <div className="glass-grid-pattern opacity-10" />
              <h2 className="text-lg font-semibold mb-2 relative z-10" style={{ color: 'var(--main-primary)' }}>
                Error Loading Blogs
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-primary)' }}>All Blogs</h1>
          <p className="text-[#888]">Discover all my latest thoughts and insights</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search blogs..."
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
                Showing {Math.min((currentPage - 1) * pageSize + 1, pagination.total)} - {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} blogs
              </p>
            )}
          </div>
        )}

        {/* Blogs Grid */}
        {blogs && blogs.length > 0 ? (
          <>
            <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {blogs.map((blog, idx) => (
                  <BlogCard
                    key={blog.slug || idx}
                    title={blog.title}
                    desc={blog.desc}
                    slug={blog.slug}
                    views={blog.views}
                    likes={blog.likes}
                    tags={blog.tags}
                    author={blog.author}
                    createdAt={blog.createdAt}
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
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto relative overflow-hidden">
              <div className="glass-grid-pattern opacity-10" />
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold mb-2 relative z-10" style={{ color: 'var(--main-primary)' }}>
                {searchQuery ? 'No blogs found' : 'No Blogs Yet'}
              </h2>
              <p className="text-[#888] mb-4 relative z-10">
                {searchQuery 
                  ? `No blogs match your search for "${searchQuery}". Try a different search term.`
                  : "I haven't published any blogs yet. Check back soon for exciting content!"
                }
              </p>
              {searchQuery ? (
                <button
                  onClick={handleClearSearch}
                  className="glass-button inline-block px-6 py-3 rounded-lg transition-colors text-white"
                >
                  Clear Search
                </button>
              ) : (
                <Link 
                  href="/"
                  className="glass-button inline-block px-6 py-3 rounded-lg transition-colors text-white"
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