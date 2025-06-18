"use client";

import React, { useState } from 'react';
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#262626] p-4 sm:p-6 rounded-lg border border-[#404040]">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600/50 rounded-lg">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h3 className="text-white text-lg sm:text-xl font-semibold">💼 Work Experience Management</h3>
            <p className="text-[#a0a0a0] text-sm sm:text-base mt-1">Manage your professional work history and positions</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
          >
            + Add Experience
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-[#404040]">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#404040] w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-0">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h4 className="text-white text-lg sm:text-xl font-semibold">
                  {editingId ? '✏️ Edit Work Experience' : '+ Add New Work Experience'}
                </h4>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white text-2xl self-end sm:self-auto"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter job position"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.companyLogo}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyLogo: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      disabled={formData.isCurrent}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                    className="w-4 h-4 rounded bg-[#262626] border-[#404040] text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <label className="text-sm sm:text-base text-gray-300 cursor-pointer">
                    This is my current position
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technologies
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
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
                      placeholder="Enter technology name"
                      className="flex-1 px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                    >
                      + Add Tech
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-600/30 text-xs sm:text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 text-blue-400 hover:text-blue-300 font-bold text-sm"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2.5 bg-[#262626] border border-[#404040] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                      className="w-4 h-4 rounded bg-[#262626] border-[#404040] text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <label className="text-sm sm:text-base text-gray-300">
                      Visible on portfolio
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-[#404040]">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      editingId ? '💾 Update Experience' : '+ Create Experience'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Work Experience List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading work experience...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-[#404040]">
            <p className="text-white font-medium text-sm sm:text-base">📊 Total Positions: {workExperience.length}</p>
          </div>
          <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
            {workExperience.map((experience: WorkExperienceData, index: number) => (
              <div key={experience._id || index} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 mb-2">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {experience.companyLogo && (
                          <Image 
                            src={experience.companyLogo} 
                            alt={`${experience.company} logo`}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded object-cover"
                          />
                        )}
                        <p className="text-white font-medium text-sm sm:text-base">{experience.position}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
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
                    </div>
                    <p className="text-[#a0a0a0] text-sm">{experience.company}</p>
                    <p className="text-xs text-[#666] mt-1">
                      {new Date(experience.startDate).toLocaleDateString()} - {
                        experience.isCurrent ? 'Present' : 
                        experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="flex gap-2 self-start">
                    <button
                      onClick={() => handleEdit(experience)}
                      className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-sm rounded hover:bg-blue-600/30 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(experience._id, experience.company)}
                      className="px-3 py-1.5 bg-red-600/20 text-red-400 text-sm rounded hover:bg-red-600/30 transition-colors"
                    >
                      🗑️ Delete
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
                <p className="text-[#a0a0a0] text-sm sm:text-base">📋 No work experience found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  + Add Your First Experience
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
