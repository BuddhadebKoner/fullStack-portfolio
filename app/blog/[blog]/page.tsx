'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaEye,
  FaHeart
} from 'react-icons/fa';
import { useBlogBySlug, useBlogLike } from '@/hooks/useBlogs';
import { CodeSectionForBlog } from '@/components/CodeSectionForBlog';

// Custom code block component for ReactMarkdown
interface MarkdownCodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

const MarkdownCodeBlock: React.FC<MarkdownCodeBlockProps> = ({ className, children, inline, ...props }) => {
  if (inline) {
    return (
      <code
        className={`${className} px-1.5 py-0.5 bg-[#333] text-[#f8f8f2] rounded text-sm font-mono`}
        {...props}
      >
        {children}
      </code>
    );
  }

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className?.replace('language-', '') || 'text';
  const codeString = String(children).replace(/\n$/, '');

  // Use CodeSectionForBlog for code blocks
  return (
    <CodeSectionForBlog
      code={codeString}
      language={language}
      filename={`example.${language}`}
    />
  );
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.blog as string;

  // Use TanStack Query hooks
  const { blog, isLoading, error, isFetching } = useBlogBySlug(slug);
  const { likeBlog, isLiking } = useBlogLike();

  const handleUpvote = () => {
    if (blog?._id && !isLiking) {
      likeBlog(blog._id);
    }
  };

  // Show loading state only for initial load
  if (isLoading) {
    return (
      <div 
        className="min-h-screen text-white font-sans px-3 md:px-0 pb-10 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: 'var(--max-bg)' }}
      >
        <div className="glass-background" />
        <div className="fixed inset-0 opacity-20">
          <div className="glass-grid-pattern" />
        </div>
        <div className="text-center glass-card p-8 rounded-xl relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--main-primary)' }}></div>
          <p className="text-white text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div 
        className="min-h-screen text-white font-sans px-3 md:px-0 pb-10 flex flex-col items-center justify-center relative"
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
              Blog Not Found
            </h2>
            <p className="mb-4 relative z-10" style={{ color: 'var(--main-secondary)' }}>{error || 'The requested blog could not be found.'}</p>
            <button
              onClick={() => router.push('/')}
              className="glass-button px-4 py-2 rounded-lg transition-colors cursor-pointer text-white"
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

      <div className="px-3 md:px-0 pb-10 flex flex-col items-center relative z-10">
        <div className="w-full max-w-4xl mt-10">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 glass-button px-3 py-2 rounded-lg transition-colors cursor-pointer text-white"
          >
            <FaArrowLeft size={20} />
            Back
          </button>

          {/* Blog Header */}
          <article className="mb-8">
            {/* Blog Image */}
            {blog.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <Image
                  width={800}
                  height={450}
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-64 md:h-80 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Title */}
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--main-primary)' }}>
                {blog.title}
              </h1>

              {/* Description */}
              {blog.desc && (
                <p className="text-lg md:text-xl text-[#ccc] leading-relaxed mb-6">
                  {blog.desc}
                </p>
              )}
            </header>

            {/* Meta Information */}
            <div className="glass-card p-4 rounded-lg mb-6 relative overflow-hidden">
              <div className="glass-grid-pattern opacity-10" />
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#aaa] relative z-10">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <FaUser size={16} />
                  <span style={{ color: 'var(--main-secondary)' }}>By {blog.author || 'Admin'}</span>
                </div>

              {/* Published Date */}
              {blog.publishedAt && (
                <div className="flex items-center gap-2">
                  <FaCalendarAlt size={16} />
                  <span>Published {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}

              {/* Created Date */}
              {blog.createdAt && (
                <div className="flex items-center gap-2">
                  <FaCheckCircle size={16} />
                  <span>Created {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              )}

              {/* Views and Likes */}
              <div className="flex items-center gap-4 ml-auto">
                {blog.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <FaEye size={16} />
                    <span>{blog.views} views</span>
                  </div>
                )}
                <button
                  onClick={handleUpvote}
                  disabled={isLiking}
                  className="glass-button flex items-center gap-1 px-3 py-1 rounded transition-colors cursor-pointer disabled:opacity-50 text-white"
                >
                  <FaHeart size={16} />
                  <span>{blog.likes} upvotes</span>
                </button>
              </div>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--main-secondary)' }}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="glass-button px-3 py-1 text-sm rounded-full text-white transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Publication Status */}
            <div className="mb-8">
              <span className={`glass-button inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${blog.isPublished ? '' : 'opacity-75'}`}>
                {blog.isPublished ? '✓ Published' : '⏳ Draft'}
              </span>
            </div>
          </article>

          {/* Blog Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: MarkdownCodeBlock,
                pre: ({ children }) => {
                  // Handle pre elements directly to avoid nesting issues
                  return <>{children}</>;
                },
                p: ({ children, node }) => {
                  // Check if this paragraph contains a code block
                  const hasCodeBlock = node?.children?.some((child: { type: string; tagName?: string }) =>
                    child.type === 'element' &&
                    (child.tagName === 'code' || child.tagName === 'pre')
                  );

                  // If it contains a code block, render as fragment to avoid invalid nesting
                  if (hasCodeBlock) {
                    return <div className="my-4">{children}</div>;
                  }

                  return <p className="mb-4 leading-relaxed text-[#ccc]">{children}</p>;
                },
                h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-white border-b border-[#333] pb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl md:text-2xl font-bold mt-6 mb-3 text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg md:text-xl font-bold mt-4 mb-2 text-white">{children}</h3>,
                h4: ({ children }) => <h4 className="text-base md:text-lg font-semibold mt-3 mb-2 text-white">{children}</h4>,
                h5: ({ children }) => <h5 className="text-sm md:text-base font-semibold mt-2 mb-1 text-white">{children}</h5>,
                h6: ({ children }) => <h6 className="text-xs md:text-sm font-semibold mt-2 mb-1 text-white">{children}</h6>,
                ul: ({ children }) => <ul className="mb-4 list-disc list-inside space-y-2 text-[#ccc] pl-4">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 list-decimal list-inside space-y-2 text-[#ccc] pl-4">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-[#ccc] bg-[#1a1a1a] p-4 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse border border-[#333]">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-[#333]">{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr className="border-b border-[#333]">{children}</tr>,
                th: ({ children }) => <th className="border border-[#333] px-4 py-2 text-left font-semibold text-white">{children}</th>,
                td: ({ children }) => <td className="border border-[#333] px-4 py-2 text-[#ccc]">{children}</td>,
                hr: () => <hr className="border-[#333] my-6" />,
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-[#ccc]">{children}</em>,
              }}
            >
              {blog.content || 'No content available for this blog.'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}