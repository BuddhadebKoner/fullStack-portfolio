"use client";

import Header from "@/components/Header";
import SkillsCard from "@/components/SkillsCard";
import ConnectCard from "@/components/ConnectCard";
import BlogsSection from "@/components/BlogsSection";
import WorkExperience from "@/components/WorkExperience";
import ProjectsSection from "@/components/ProjectsSection";
import { useHomeData } from "@/hooks/useHomeData";

export default function Home() {
  const { data: homeData, isLoading, error } = useHomeData();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6">
            <h2 className="text-red-400 text-lg font-semibold mb-2">
              Error Loading Portfolio
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


  console.log("Home Data:", homeData);

  return (
    <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center">
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
  );
} 