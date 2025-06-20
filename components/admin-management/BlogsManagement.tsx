"use client";

import { useState, useMemo } from 'react';
import { useBlogs, BlogData } from '@/hooks/useBlogs';
import BlogAnalytics from '@/components/BlogAnalytics';

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
  const [activeTab, setActiveTab] = useState<'management' | 'analytics'>('management');
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

  const handleRefresh = () => {
    refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

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
    setEditingBlog(null);
    setShowCreateForm(false);
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

  const handleDelete = (id: string, title: string) => {
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

    try {
      if (editingBlog) {
        updateBlog.mutate({ id: editingBlog._id, data: blogData });
      } else {
        createBlog.mutate(blogData);
      }
      resetForm();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error submitting blog:', error);
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
          {activeTab === 'management' && (
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              {showCreateForm ? 'Cancel' : '+ Create New Blog'}
            </button>
          )}
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('management')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'management'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📝 Blog Management
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📊 Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'analytics' ? (
        <BlogAnalytics blogs={blogs} />
      ) : (
        <>
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
            <div className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-4 sm:p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.desc}
                    onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter blog description"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter blog content (Markdown supported)"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="react, javascript, tutorial"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-[#262626] border-[#404040] rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="text-white text-sm">
                    Publish immediately
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={createBlog.isPending || updateBlog.isPending}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                  >
                    {createBlog.isPending || updateBlog.isPending ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Blogs List */}
          <div className="bg-[#1a1a1a] border border-[#404040] rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-[#404040]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-white text-lg font-semibold">
                  Blogs ({filteredBlogs.length})
                </h4>
                <div className="text-sm text-[#a0a0a0]">
                  Total: {blogs.length} | Published: {blogs.filter(b => b.isPublished).length} | Draft: {blogs.filter(b => !b.isPublished).length}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[#a0a0a0]">Loading blogs...</p>
                </div>
              ) : filteredBlogs.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-[#262626]">
                    <tr>
                      <th className="text-left py-3 px-4 text-[#a0a0a0] font-medium text-sm">Title</th>
                      <th className="text-left py-3 px-4 text-[#a0a0a0] font-medium text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-[#a0a0a0] font-medium text-sm">Views</th>
                      <th className="text-left py-3 px-4 text-[#a0a0a0] font-medium text-sm">Likes</th>
                      <th className="text-left py-3 px-4 text-[#a0a0a0] font-medium text-sm">Created</th>
                      <th className="text-left py-3 px-4 text-[#a0a0a0] font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((blog, index) => (
                      <tr key={blog._id} className={`border-b border-[#404040] hover:bg-[#262626] transition-colors ${index % 2 === 0 ? 'bg-[#1e1e1e]' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            <p className="text-white font-medium text-sm truncate">{blog.title}</p>
                            <p className="text-[#a0a0a0] text-xs truncate mt-1">{blog.desc}</p>
                            {blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {blog.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                                {blog.tags.length > 3 && (
                                  <span className="text-[#a0a0a0] text-xs">+{blog.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleTogglePublish(blog)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              blog.isPublished 
                                ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                                : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                            }`}
                          >
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-[#a0a0a0] text-sm">{blog.views}</td>
                        <td className="py-3 px-4 text-[#a0a0a0] text-sm">{blog.likes}</td>
                        <td className="py-3 px-4 text-[#a0a0a0] text-sm">{formatDate(blog.createdAt)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(blog)}
                              className="px-2 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded text-xs transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog._id, blog.title)}
                              className="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
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
        </>
      )}
    </div>
  );
}
