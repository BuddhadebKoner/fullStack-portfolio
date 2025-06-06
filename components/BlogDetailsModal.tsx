import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Image from 'next/image';
import { BlogData } from '../hooks/useBlogs';

interface BlogDetailsModalProps {
   isOpen: boolean;
   onClose: () => void;
   blog: BlogData | null;
   loading: boolean;
}

// Custom code block component for ReactMarkdown
const MarkdownCodeBlock: React.FC<{
   inline: boolean;
   className?: string;
   children: React.ReactNode;
}> = ({ inline, className, children, ...props }) => {
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
      return <code className={className} {...props}>{children}</code>;
   }
   return (
      <div className="relative group my-2">
         <pre ref={codeRef} className={className + ' rounded-lg p-4 bg-[#181818] overflow-x-auto'} {...props}>{children}</pre>
         <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-100 transition bg-[#232323] border border-[#444] text-xs px-2 py-1 rounded text-[#ccc] hover:bg-[#333] cursor-pointer"
            aria-label="Copy code"
         >
            {copied ? 'Copied!' : 'Copy'}
         </button>
      </div>
   );
};

const BlogDetailsModal: React.FC<BlogDetailsModalProps> = ({ isOpen, onClose, blog, loading }) => {
   const [likeLoading, setLikeLoading] = useState(false);
   const [likes, setLikes] = useState(blog?.likes || 0);

   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = '';
      }
      return () => {
         document.body.style.overflow = '';
      };
   }, [isOpen]);

   // update likes if blog changes
   React.useEffect(() => {
      setLikes(blog?.likes || 0);
   }, [blog]);

   const handleLike = async () => {
      if (!blog?._id || likeLoading) return;
      setLikeLoading(true);
      try {
         const res = await fetch(`/api/blogs/${blog._id}/like`, { method: 'POST' });
         const data = await res.json();
         if (data.success && data.data?.likes !== undefined) {
            setLikes(data.data.likes);
         }
      } catch (e) {
         console.error('Failed to like blog:', e);
      } finally {
         setLikeLoading(false);
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div className="bg-[#1a1a1a] rounded-2xl border border-[#404040] shadow-2xl w-full max-w-2xl p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
            <button
               className="absolute top-3 right-3 text-[#aaa] hover:text-white text-2xl font-bold"
               onClick={onClose}
               aria-label="Close"
            >
               &times;
            </button>
            {loading ? (
               <div className="text-center py-10 text-[#aaa]">Loading...</div>
            ) : blog ? (
               <>
                  <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                  <div className="text-[#b5b5b5] mb-4">{blog.desc}</div>
                  {blog.tags && blog.tags.length > 0 && (
                     <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.map((tag: string, idx: number) => (
                           <span key={idx} className="px-2 py-1 bg-[#333] text-xs rounded-full text-[#ccc]">{tag}</span>
                        ))}
                     </div>
                  )}
                  <div className="text-sm text-[#888] mb-2">
                     <span>By {blog.author || 'Admin'}</span> &middot; <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  {blog.imageUrl && (
                     <Image
                        width={600}
                        height={300}
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-48 object-cover rounded-lg mb-4 border border-[#333]"
                     />
                  )}
                  <div className="prose prose-invert max-w-none mb-4">
                     <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                           code({ className, children, ...props }) {
                              // ReactMarkdown v8+ passes 'inline' as a boolean prop, but types may not include it
                              // @ts-expect-error: inline is present at runtime
                              const inline = props.inline ?? !className;
                              return (
                                 <MarkdownCodeBlock inline={!!inline} className={className} {...props}>
                                    {children}
                                 </MarkdownCodeBlock>
                              );
                           }
                        }}
                     >
                        {blog.content || ''}
                     </ReactMarkdown>
                  </div>
                  <div className="flex gap-4 text-xs text-[#888] items-center">
                     <span>👁 {blog.views}</span>
                     <button
                        onClick={handleLike}
                        disabled={likeLoading}
                        className="flex items-center gap-1 text-[#888] hover:text-pink-400 transition disabled:opacity-60"
                        aria-label="Like this blog"
                     >
                        <span>❤</span> <span>{likes}</span>
                     </button>
                  </div>
               </>
            ) : (
               <div className="text-center py-10 text-[#f66]">Failed to load blog details. Please try again later.</div>
            )}
         </div>
      </div>
   );
};

export default BlogDetailsModal;
