import React from "react";
import BlogCard from "./BlogCard";
import { BlogData } from "../hooks/useBlogs";

interface BlogsSectionProps {
  blogs: BlogData[];
}

export default function BlogsSection({ blogs }: BlogsSectionProps) {
  return (
    <div className="w-full max-w-5xl mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-xl">Blogs</h3>
        <div className="flex gap-2">
          <button className="bg-[#232323] rounded p-1 border border-[#242424] hover:bg-[#333] transition">
            <svg width="20" height="20" fill="none">
              <path d="M13 16l-5-5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="bg-[#232323] rounded p-1 border border-[#242424] hover:bg-[#333] transition">
            <svg width="20" height="20" fill="none">
              <path d="M7 16l5-5-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {blogs.length > 0 ? (
          blogs.map((blog, idx) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-[#888] text-lg">No blogs available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
