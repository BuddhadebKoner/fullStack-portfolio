"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useWorkExperience, WorkExperienceData } from '@/hooks/useWorkExperience';

interface WorkExperienceManagementProps {
  onRefresh?: () => void;
}

interface WorkExperienceFormData {
  company: string;
  position: string;
  companyLogo?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies: string[];
  order: number;
  isVisible: boolean;
}

export default function WorkExperienceManagement({ onRefresh }: WorkExperienceManagementProps) {
  const { 
    workExperience, 
    isLoading, 
    error, 
    refreshWorkExperience,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
  } = useWorkExperience();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkExperienceFormData>({
    company: '',
    position: '',
    companyLogo: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: [],
    order: 0,
    isVisible: true
  });
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleRefresh = async () => {
    await refreshWorkExperience();
    if (onRefresh) onRefresh();
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      companyLogo: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      technologies: [],
      order: 0,
      isVisible: true
    });
    setTechInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (experience: WorkExperienceData) => {
    setFormData({
      company: experience.company,
      position: experience.position,
      companyLogo: experience.companyLogo || '',
      startDate: experience.startDate.split('T')[0],
      endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
      isCurrent: experience.isCurrent,
      description: experience.description || '',
      technologies: experience.technologies,
      order: experience.order,
      isVisible: experience.isVisible
    });
    setEditingId(experience._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        endDate: formData.isCurrent ? undefined : formData.endDate,
      };

      let result;
      if (editingId) {
        result = await updateWorkExperience(editingId, data);
      } else {
        result = await createWorkExperience(data);
      }

      if (result.success) {
        resetForm();
        await handleRefresh();
      } else {
        alert(result.error || 'Failed to save work experience');
      }
    } catch (error) {
      console.error('Error saving work experience:', error);
      alert('Failed to save work experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete the position at ${company}?`)) {
      return;
    }

    try {
      const result = await deleteWorkExperience(id);
      if (result.success) {
        await handleRefresh();
      } else {
        alert(result.error || 'Failed to delete work experience');
      }
    } catch (error) {
      console.error('Error deleting work experience:', error);
      alert('Failed to delete work experience');
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Work Experience</h3>
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
        <h3 className="text-white text-2xl font-semibold">Work Experience</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Add Experience
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#404040] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white text-xl font-semibold">
                  {editingId ? 'Edit Work Experience' : 'Add New Work Experience'}
                </h4>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.companyLogo}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyLogo: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      disabled={formData.isCurrent}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                    className="rounded bg-[#262626] border-[#404040] text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-300">
                    This is my current position
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Technologies
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechnology();
                        }
                      }}
                      placeholder="Add technology"
                      className="flex-1 px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 text-sm rounded flex items-center gap-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="text-blue-300 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                      className="rounded bg-[#262626] border-[#404040] text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-300">
                      Visible on portfolio
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading work experience...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-[#404040]">
            <p className="text-white font-medium">Total Positions: {workExperience.length}</p>
          </div>
          <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
            {workExperience.map((experience: WorkExperienceData, index: number) => (
              <div key={experience._id || index} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {experience.companyLogo && (
                        <Image 
                          src={experience.companyLogo} 
                          alt={`${experience.company} logo`}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded object-cover"
                        />
                      )}
                      <p className="text-white font-medium">{experience.position}</p>
                      {experience.isCurrent && (
                        <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {!experience.isVisible && (
                        <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-[#a0a0a0] text-sm">{experience.company}</p>
                    <p className="text-xs text-[#666] mt-1">
                      {new Date(experience.startDate).toLocaleDateString()} - {
                        experience.isCurrent ? 'Present' : 
                        experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(experience)}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded hover:bg-blue-600/30 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(experience._id, experience.company)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 text-sm rounded hover:bg-red-600/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {experience.description && (
                  <p className="text-[#a0a0a0] text-sm mb-2">{experience.description.substring(0, 150)}{experience.description.length > 150 ? '...' : ''}</p>
                )}
                {experience.technologies && experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {experience.technologies.slice(0, 5).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {experience.technologies.length > 5 && (
                      <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 text-xs rounded">
                        +{experience.technologies.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {workExperience.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-[#a0a0a0]">No work experience found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add Your First Experience
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
