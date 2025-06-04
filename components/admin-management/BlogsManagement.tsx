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
  const { blogs, isLoading, error, refreshBlogs, createBlog, updateBlog, deleteBlog } = useBlogs();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const success = await deleteBlog(id);
      if (success && onRefresh) {
        onRefresh();
      }
    }
  };

  const handleTogglePublish = async (blog: BlogData) => {
    const success = await updateBlog(blog._id, { isPublished: !blog.isPublished });
    if (success && onRefresh) {
      onRefresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const blogData = { ...formData, tags };

    try {
      let success = false;
      if (editingBlog) {
        success = await updateBlog(editingBlog._id, blogData);
      } else {
        success = await createBlog(blogData);
      }

      if (success) {
        resetForm();
        if (onRefresh) onRefresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    await refreshBlogs();
    if (onRefresh) onRefresh();
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Blog Management</h3>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-2xl font-semibold">Blog Management</h3>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            {showCreateForm ? 'Cancel' : 'Create New Blog'}
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blogs by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-[#262626] rounded-lg border border-[#404040] p-6">
          <h4 className="text-white text-xl font-semibold mb-4">
            {editingBlog ? 'Edit Blog' : 'Create New Blog'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Description *</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500 h-32 resize-none"
                placeholder="Blog content (supports markdown)"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-blue-500"
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
              <label htmlFor="isPublished" className="text-white font-medium">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
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
          <div className="p-4 border-b border-[#404040] flex justify-between items-center">
            <p className="text-white font-medium">
              Total Blogs: {blogs.length} | Showing: {filteredBlogs.length}
            </p>
            <div className="text-sm text-[#a0a0a0]">
              {blogs.filter(b => b.isPublished).length} Published • {blogs.filter(b => !b.isPublished).length} Draft
            </div>
          </div>
          <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
            {filteredBlogs.map((blog: BlogData, index: number) => (
              <div key={blog._id || index} className="p-4 hover:bg-[#2a2a2a] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-white font-medium">{blog.title}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        blog.isPublished 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-[#a0a0a0] text-sm mb-2">{blog.desc?.substring(0, 150)}...</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#666]">
                      <span>Views: {blog.views || 0}</span>
                      <span>Likes: {blog.likes || 0}</span>
                      <span>Created: {formatDate(blog.createdAt)}</span>
                      {blog.updatedAt !== blog.createdAt && (
                        <span>Updated: {formatDate(blog.updatedAt)}</span>
                      )}
                    </div>
                    {blog.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {blog.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 4 && (
                          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                            +{blog.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        blog.isPublished
                          ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                          : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      }`}
                    >
                      {blog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm transition-colors"
                    >
                      Delete
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
