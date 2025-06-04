"use client";

import { useState } from 'react';
import { useSkills, SkillData } from '@/hooks/useSkills';

interface SkillsManagementProps {
  onRefresh?: () => void;
}

interface SkillFormData {
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order: number;
  isVisible: boolean;
}

const SKILL_CATEGORIES = [
  'frontend',
  'backend', 
  'database',
  'devops',
  'mobile',
  'ai',
  'tools',
  'other'
];

const SKILL_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert'
];

export default function SkillsManagement({ onRefresh }: SkillsManagementProps) {
  const { skills, isLoading, error, refreshSkills, createSkill, updateSkill, deleteSkill } = useSkills();
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: 'other',
    level: 'intermediate',
    order: 0,
    isVisible: true
  });
  
  // Loading states for operations
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = async () => {
    await refreshSkills();
    if (onRefresh) onRefresh();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      level: 'intermediate',
      order: 0,
      isVisible: true
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (skill: SkillData) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      order: skill.order,
      isVisible: skill.isVisible
    });
    setShowEditModal(true);
  };

  const handleDelete = (skill: SkillData) => {
    setSelectedSkill(skill);
    setShowDeleteModal(true);
  };

  const submitCreate = async () => {
    setIsCreating(true);
    try {
      const success = await createSkill(formData);
      if (success) {
        setShowCreateModal(false);
        resetForm();
        if (onRefresh) onRefresh();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const submitUpdate = async () => {
    if (!selectedSkill) return;
    
    setIsUpdating(true);
    try {
      const success = await updateSkill(selectedSkill._id, formData);
      if (success) {
        setShowEditModal(false);
        setSelectedSkill(null);
        resetForm();
        if (onRefresh) onRefresh();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const submitDelete = async () => {
    if (!selectedSkill) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteSkill(selectedSkill._id);
      if (success) {
        setShowDeleteModal(false);
        setSelectedSkill(null);
        if (onRefresh) onRefresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Skills Management</h3>
          <div className="flex gap-2">
            <button 
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Add Skill
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {isLoading ? 'Loading...' : 'Refresh Skills'}
            </button>
          </div>
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
        <h3 className="text-white text-2xl font-semibold">Skills Management</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Add Skill
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {isLoading ? 'Loading...' : 'Refresh Skills'}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading skills...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-[#404040]">
            <p className="text-white font-medium">Total Skills: {skills.length}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {skills.map((skill: SkillData, index: number) => (
              <div key={skill._id || index} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#404040]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{skill.name}</p>
                    <p className="text-[#a0a0a0] text-sm capitalize">{skill.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Edit skill"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(skill)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete skill"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                    skill.level === 'expert' ? 'bg-green-600/20 text-green-400' :
                    skill.level === 'advanced' ? 'bg-blue-600/20 text-blue-400' :
                    skill.level === 'intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {skill.level}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#666]">Order: {skill.order}</span>
                    <span className={`w-2 h-2 rounded-full ${skill.isVisible ? 'bg-green-500' : 'bg-red-500'}`} title={skill.isVisible ? 'Visible' : 'Hidden'}></span>
                  </div>
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="col-span-full p-8 text-center">
                <p className="text-[#a0a0a0]">No skills found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#262626] rounded-lg border border-[#404040] p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-xl font-semibold mb-4">Add New Skill</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter skill name"
                />
              </div>
              
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {SKILL_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {SKILL_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Display order"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isVisible" className="text-[#a0a0a0] text-sm">Visible on public profile</label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-[#404040] hover:bg-[#505050] text-white rounded-lg transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={submitCreate}
                disabled={isCreating || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create Skill'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#262626] rounded-lg border border-[#404040] p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-xl font-semibold mb-4">Edit Skill</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter skill name"
                />
              </div>
              
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {SKILL_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {SKILL_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[#a0a0a0] text-sm mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Display order"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsVisible" className="text-[#a0a0a0] text-sm">Visible on public profile</label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-[#404040] hover:bg-[#505050] text-white rounded-lg transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={submitUpdate}
                disabled={isUpdating || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Update Skill'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#262626] rounded-lg border border-[#404040] p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-xl font-semibold mb-4">Delete Skill</h3>
            
            <p className="text-[#a0a0a0] mb-6">
              Are you sure you want to delete the skill &quot;<span className="text-white font-medium">{selectedSkill.name}</span>&quot;? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-[#404040] hover:bg-[#505050] text-white rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={submitDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Skill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
