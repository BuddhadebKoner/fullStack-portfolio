"use client";

import { useState } from 'react';
import { useProjects, ProjectData } from '@/hooks/useProjects';

interface ProjectsManagementProps {
  onRefresh?: () => void;
}

interface ProjectFormData {
  title: string;
  desc: string;
  img: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
  isPublished: boolean;
  order: number;
}

export default function ProjectsManagement({ onRefresh }: ProjectsManagementProps) {
  const { projects, isLoading, error, refetch, createProject, updateProject, deleteProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    desc: '',
    img: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    category: 'web',
    featured: false,
    isPublished: true,
    order: 0
  });
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRefresh = async () => {
    await refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      desc: '',
      img: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      category: 'web',
      featured: false,
      isPublished: true,
      order: 0
    });
    setTechInput('');
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: ProjectData) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      desc: project.desc,
      img: project.img || '',
      technologies: project.technologies || [],
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      category: project.category,
      featured: project.featured,
      isPublished: project.isPublished,
      order: project.order
    });
    setTechInput(project.technologies?.join(', ') || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const technologies = techInput.split(',').map(tech => tech.trim()).filter(tech => tech);
    const projectData = { ...formData, technologies };

    try {
      if (editingProject) {
        updateProject.mutate({ id: editingProject._id, data: projectData });
      } else {
        createProject.mutate(projectData);
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProject.mutate(id);
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      const newTechs = techInput.split(',').map(tech => tech.trim()).filter(tech => tech);
      setFormData(prev => ({
        ...prev,
        technologies: [...new Set([...prev.technologies, ...newTechs])]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Project Management</h3>
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h3 className="text-white text-xl sm:text-2xl font-semibold">Project Management</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            {showForm ? 'Cancel' : '+ Add Project'}
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

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-[#262626] rounded-lg border border-[#404040] p-4 sm:p-6">
          <h4 className="text-white text-lg sm:text-xl font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                  <option value="ai">AI</option>
                  <option value="tool">Tool</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Image URL *</label>
              <input
                type="url"
                value={formData.img}
                onChange={(e) => setFormData(prev => ({ ...prev, img: e.target.value }))}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Live URL</label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Technologies</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Enter technologies separated by commas"
                  className="flex-1 px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs sm:text-sm flex items-center gap-1"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="text-blue-400 hover:text-blue-300 w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#404040] rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center text-white text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2 w-4 h-4 text-blue-600 bg-[#1a1a1a] border-[#404040] rounded focus:ring-blue-500"
                  />
                  Featured Project
                </label>
              </div>
              <div className="flex items-center">
                <label className="flex items-center text-white text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="mr-2 w-4 h-4 text-blue-600 bg-[#1a1a1a] border-[#404040] rounded focus:ring-blue-500"
                  />
                  Published
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#404040]">
              <button
                type="submit"
                disabled={isSubmitting || createProject.isPending || updateProject.isPending}
                className="px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
              >
                {isSubmitting || createProject.isPending || updateProject.isPending ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
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
      
      {/* Projects List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2 text-sm sm:text-base">Loading projects...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[#404040]">
            <p className="text-white font-medium text-sm sm:text-base">Total Projects: {projects?.length || 0}</p>
          </div>
          <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
            {projects?.map((project: ProjectData, index: number) => (
              <div key={project._id || index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-medium">{project.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.featured 
                          ? 'bg-yellow-600/20 text-yellow-400' 
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {project.featured ? 'Featured' : 'Regular'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.isPublished 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {project.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-[#a0a0a0] text-sm mb-2">{project.desc?.substring(0, 150)}...</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <span className="text-[#666] text-xs">+{project.technologies.length - 3} more</span>
                      )}
                    </div>
                    <p className="text-xs text-[#666]">
                      Category: {project.category} | Order: {project.order}
                    </p>
                    {(project.githubUrl || project.liveUrl) && (
                      <div className="flex gap-2 mt-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 text-xs"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id, project.title)}
                      disabled={deleteProject.isPending}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
                    >
                      {deleteProject.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(!projects || projects.length === 0) && (
              <div className="p-8 text-center">
                <p className="text-[#a0a0a0] mb-4">No projects found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
