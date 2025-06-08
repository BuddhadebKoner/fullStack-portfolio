'use client';

import React, { useEffect, useState } from 'react';
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
import { BlogData } from '@/hooks/useBlogs';

// Custom code block component for ReactMarkdown
interface MarkdownCodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

const MarkdownCodeBlock: React.FC<MarkdownCodeBlockProps> = ({ className, children, inline, ...props }) => {
  const codeRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

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

  return (
    <div className="relative group my-4">
      <pre
        ref={codeRef}
        className={`${className} rounded-lg p-4 bg-[#282828] border border-[#404040] overflow-x-auto text-sm`}
        {...props}
      >
        <code className="text-[#f8f8f2] font-mono">{children}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#404040] border border-[#555] text-xs px-2 py-1 rounded text-[#ccc] hover:bg-[#505050] cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likes, setLikes] = useState(0);

  const slug = params.blog as string;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs?slug=${slug}`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          const blogData = data.data[0];
          setBlog(blogData);
          setLikes(blogData.likes || 0);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const handleUpvote = async () => {
    if (!blog?._id || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/blogs/${blog._id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data?.likes !== undefined) {
        setLikes(data.data.likes);
      }
    } catch (e) {
      console.error('Failed to upvote blog:', e);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6">
            <h2 className="text-red-400 text-lg font-semibold mb-2">
              Blog Not Found
            </h2>
            <p className="text-red-300 mb-4">{error || 'The requested blog could not be found.'}</p>
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
      <div className="px-3 md:px-0 py-10 flex flex-col items-center">

        <div className="w-full max-w-4xl mt-10">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-[#aaa] hover:text-white transition-colors"
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
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
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#aaa] mb-6 pb-6 border-b border-[#333]">
              {/* Author */}
              <div className="flex items-center gap-2">
                <FaUser size={16} />
                <span>By {blog.author || 'Admin'}</span>
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
                  disabled={likeLoading}
                  className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <FaHeart size={16} />
                  <span>{likes} upvotes</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#aaa] mb-3 uppercase tracking-wider">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#333] text-sm rounded-full text-[#ccc] hover:bg-[#444] transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Publication Status */}
            <div className="mb-8">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${blog.isPublished
                  ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                  : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/50'
                }`}>
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
                h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-white border-b border-[#333] pb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl md:text-2xl font-bold mt-6 mb-3 text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg md:text-xl font-bold mt-4 mb-2 text-white">{children}</h3>,
                h4: ({ children }) => <h4 className="text-base md:text-lg font-semibold mt-3 mb-2 text-white">{children}</h4>,
                h5: ({ children }) => <h5 className="text-sm md:text-base font-semibold mt-2 mb-1 text-white">{children}</h5>,
                h6: ({ children }) => <h6 className="text-xs md:text-sm font-semibold mt-2 mb-1 text-white">{children}</h6>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-[#ccc]">{children}</p>,
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