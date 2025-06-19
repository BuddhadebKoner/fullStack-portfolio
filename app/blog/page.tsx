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
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#888] hover:text-white transition-colors mb-4"
            >
              <svg width="20" height="20" fill="none" className="mr-2">
                <path d="M13 16l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">All Blogs</h1>
            <p className="text-[#888]">Discover all my latest thoughts and insights</p>
          </div>

          {/* Loading State */}
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#888] hover:text-white transition-colors mb-4"
            >
              <svg width="20" height="20" fill="none" className="mr-2">
                <path d="M13 16l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">All Blogs</h1>
            <p className="text-[#888]">Discover all my latest thoughts and insights</p>
          </div>

          {/* Error State */}
          <div className="text-center py-20">
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-red-400 text-lg font-semibold mb-2">
                Error Loading Blogs
              </h2>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
    <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#888] hover:text-white transition-colors mb-4"
          >
            <svg width="20" height="20" fill="none" className="mr-2">
              <path d="M13 16l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">All Blogs</h1>
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
              <div className="fixed bottom-6 right-6 z-50 bg-[#232323] border border-[#333] rounded-lg px-4 py-3 shadow-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-white text-sm">Searching...</span>
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
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No blogs found' : 'No Blogs Yet'}
              </h2>
              <p className="text-[#888] mb-4">
                {searchQuery 
                  ? `No blogs match your search for "${searchQuery}". Try a different search term.`
                  : "I haven't published any blogs yet. Check back soon for exciting content!"
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