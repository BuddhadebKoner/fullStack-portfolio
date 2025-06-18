"use client";

import { useState, useMemo } from 'react';
import { useBlogs, BlogData } from '@/hooks/useBlogs';

interface BlogsManagementProps {
  onRefresh?: () => void;
}

interface BlogFormData {
  title: string;
  desc: string;
  content: string;
  tags: string[];
  imageUrl: string;
  isPublished: boolean;
}

export default function BlogsManagement({ onRefresh }: BlogsManagementProps) {
  const { blogs = [], isLoading, error, refetch, createBlog, updateBlog, deleteBlog } = useBlogs();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    desc: '',
    content: '',
    tags: [],
    imageUrl: '',
    isPublished: false,
  });
  const [tagsInput, setTagsInput] = useState('');

  // Filter and search blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = searchTerm === '' || 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'published' && blog.isPublished) ||
        (statusFilter === 'draft' && !blog.isPublished);
      
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchTerm, statusFilter]);

  const resetForm = () => {
    setFormData({
      title: '',
      desc: '',
      content: '',
      tags: [],
      imageUrl: '',
      isPublished: false,
    });
    setTagsInput('');
    setShowCreateForm(false);
    setEditingBlog(null);
  };

  const handleEdit = (blog: BlogData) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      desc: blog.desc,
      content: blog.content || '',
      tags: blog.tags,
      imageUrl: blog.imageUrl || '',
      isPublished: blog.isPublished,
    });
    setTagsInput(blog.tags.join(', '));
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBlog.mutate(id);
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  const handleTogglePublish = async (blog: BlogData) => {
    updateBlog.mutate({ id: blog._id, data: { isPublished: !blog.isPublished } });
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const blogData = { ...formData, tags };

    if (editingBlog) {
      updateBlog.mutate({ id: editingBlog._id, data: blogData });
    } else {
      createBlog.mutate(blogData);
    }

    resetForm();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleRefresh = async () => {
    refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <h3 className="text-white text-xl sm:text-2xl font-semibold">Blog Management</h3>
          <button 
            onClick={handleRefresh}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium self-start sm:self-auto"
          >
            🔄 Retry
          </button>
        </div>
        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-medium text-sm sm:text-base">Error Loading Blogs</p>
              <p className="text-red-300 text-xs sm:text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h3 className="text-white text-xl sm:text-2xl font-semibold">Blog Management</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            {showCreateForm ? 'Cancel' : '+ Create New Blog'}
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blogs by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
          className="px-3 sm:px-4 py-2.5 sm:py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base min-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-[#262626] rounded-lg border border-[#404040] p-4 sm:p-6">
          <h4 className="text-white text-lg sm:text-xl font-semibold mb-4">
            {editingBlog ? 'Edit Blog' : 'Create New Blog'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Description *</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 h-20 sm:h-24 resize-none text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 h-28 sm:h-32 resize-none text-sm sm:text-base"
                placeholder="Blog content (supports markdown)"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter tags separated by commas (e.g., javascript, react, nodejs)"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-[#1a1a1a] border-[#404040] rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublished" className="text-white font-medium text-sm sm:text-base">
                Publish immediately
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#404040]">
              <button
                type="submit"
                disabled={createBlog.isPending || updateBlog.isPending}
                className="px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
              >
                {(createBlog.isPending || updateBlog.isPending) ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 sm:px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Blogs List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading blogs...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[#404040] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <p className="text-white font-medium text-sm sm:text-base">
              Total Blogs: {blogs.length} | Showing: {filteredBlogs.length}
            </p>
            <div className="text-xs sm:text-sm text-[#a0a0a0]">
              {blogs.filter(b => b.isPublished).length} Published • {blogs.filter(b => !b.isPublished).length} Draft
            </div>
          </div>
          <div className="divide-y divide-[#404040] max-h-80 sm:max-h-96 overflow-y-auto">
            {filteredBlogs.map((blog: BlogData, index: number) => (
              <div key={blog._id || index} className="p-3 sm:p-4 hover:bg-[#2a2a2a] transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 lg:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{blog.title}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                        blog.isPublished 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-[#a0a0a0] text-xs sm:text-sm mb-3 line-clamp-2">
                      {blog.desc?.substring(0, 120)}...
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[#666] mb-2">
                      <span>Views: {blog.views || 0}</span>
                      <span>Likes: {blog.likes || 0}</span>
                      <span className="hidden sm:inline">Created: {formatDate(blog.createdAt)}</span>
                      <span className="sm:hidden">Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
                      {blog.updatedAt !== blog.createdAt && (
                        <>
                          <span className="hidden sm:inline">Updated: {formatDate(blog.updatedAt)}</span>
                          <span className="sm:hidden">Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row lg:flex-col gap-2 lg:gap-2 lg:ml-4 self-start">
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      disabled={updateBlog.isPending}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-[70px] sm:min-w-[80px] disabled:opacity-50 ${
                        blog.isPublished
                          ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                          : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      }`}
                    >
                      {blog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-2 sm:px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-[50px] sm:min-w-[60px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      disabled={deleteBlog.isPending}
                      className="px-2 sm:px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-[55px] sm:min-w-[65px] disabled:opacity-50"
                    >
                      {deleteBlog.isPending ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredBlogs.length === 0 && blogs.length > 0 && (
              <div className="p-8 text-center">
                <p className="text-[#a0a0a0]">No blogs match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
            {blogs.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-[#a0a0a0]">No blogs found</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Create Your First Blog
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
