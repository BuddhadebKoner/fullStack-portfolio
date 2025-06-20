import React, { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import BlogCard from "./BlogCard";
import { BlogData } from "../hooks/useBlogs";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface BlogsSectionProps {
  blogs: BlogData[];
}

export default function BlogsSection({ blogs }: BlogsSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="w-full max-w-5xl mb-10 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-xl" style={{ color: 'var(--main-primary)' }}>Blogs</h3>
        <div className="flex items-center gap-3">
          <Link 
            href="/blog"
            className="glass-button text-sm px-3 py-1 rounded-full text-white transition-colors"
          >
            View All
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={() => swiperRef.current?.slidePrev()}
              className="glass-button rounded p-1 transition"
            >
              <svg width="20" height="20" fill="none">
                <path d="M13 16l-5-5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button 
              onClick={() => swiperRef.current?.slideNext()}
              className="glass-button rounded p-1 transition"
            >
              <svg width="20" height="20" fill="none">
                <path d="M7 16l5-5-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {blogs.length > 0 ? (
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
          }}
          className="blogs-swiper"
        >
          {blogs.map((blog, idx) => (
            <SwiperSlide key={blog.slug || idx}>
              <BlogCard 
                title={blog.title} 
                desc={blog.desc}
                slug={blog.slug}
                views={blog.views}
                likes={blog.likes}
                tags={blog.tags}
                author={blog.author}
                createdAt={blog.createdAt}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#888] text-lg">No blogs available yet</p>
        </div>
      )}
    </div>
  );
}
