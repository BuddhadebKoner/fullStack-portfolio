"use client";

import Header from "@/components/Header";
import SkillsCard from "@/components/SkillsCard";
import ConnectCard from "@/components/ConnectCard";
import BlogsSection from "@/components/BlogsSection";
import WorkExperience from "@/components/WorkExperience";
import ProjectsSection from "@/components/ProjectsSection";
import { useHomeData } from "@/hooks/useHomeData";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: homeData, isLoading, error, isFetching } = useHomeData();

  // Show loading state only for initial load, not for background refetches
  if (isLoading) {
    return (
      <div
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        {/* Glassmorphism Background Pattern */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--main-primary)] via-transparent to-[var(--main-secondary)]" />
          <div className="glass-grid-pattern" />
        </div>
        <div className="text-center glass-card p-8 rounded-xl relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--main-primary)' }}></div>
          <p className="text-white text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        {/* Glassmorphism Background Pattern */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--main-primary)] via-transparent to-[var(--main-secondary)]" />
          <div className="glass-grid-pattern" />
        </div>
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="glass-card p-6 rounded-lg relative overflow-hidden">
            <div className="glass-grid-pattern opacity-10" />
            <h2 className="text-lg font-semibold mb-2 relative z-10" style={{ color: 'var(--main-primary)' }}>
              Error Loading Portfolio
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
    );
  }

  const skills = homeData?.skills || [];
  const blogs = (homeData?.blogs || []).map((blog) => ({
    _id: blog.slug,
    title: blog.title,
    desc: blog.desc,
    content: blog.content,
    author: blog.author,
    tags: blog.tags,
    imageUrl: blog.imageUrl,
    slug: blog.slug,
    isPublished: blog.isPublished,
    publishedAt: blog.publishedAt ? String(blog.publishedAt) : undefined,
    views: blog.views,
    likes: blog.likes,
    createdAt: blog.createdAt ? String(blog.createdAt) : '',
    updatedAt: blog.updatedAt ? String(blog.updatedAt) : '',
  }));
  const projects = homeData?.projects || [];

  return (
    <>
      <div
        className="min-h-screen text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        {/* Enhanced Glassmorphism Background */}
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

        {/* Header */}
        <Header profile={homeData?.profile} />

        {/* Skills and Connect */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <SkillsCard skills={skills} />
          <ConnectCard profile={homeData?.profile} />
        </div>

        {/* Blogs */}
        <BlogsSection blogs={blogs} />

        {/* Work Experience */}
        <WorkExperience workExperience={homeData?.workExperience} />

        {/* Projects */}
        <ProjectsSection projects={projects} />

      </div>
      {/* Footer */}
      <Footer />
    </>
  );
} 