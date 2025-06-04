"use client";

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import DashboardOverview from './DashboardOverview';
import BlogsManagement from './admin-management/BlogsManagement';
import ProjectsManagement from './admin-management/ProjectsManagement';
import SkillsManagement from './admin-management/SkillsManagement';
import WorkExperienceManagement from './admin-management/WorkExperienceManagement';
import ProfileManagement from './admin-management/ProfileManagement';
import AnalyticsManagement from './admin-management/AnalyticsManagement';
import ChatManagement from './admin-management/ChatManagement';
import AdminActivitiesManagement from './admin-management/AdminActivitiesManagement';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { user } = useUser();
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');

  // If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#404040] shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Access Denied</h3>
            <p className="text-[#a0a0a0] mb-6">You don&apos;t have admin privileges to access this panel.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'blogs', label: 'Blogs', icon: '📝' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'skills', label: 'Skills', icon: '💡' },
    { id: 'work-experience', label: 'Work Experience', icon: '💼' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'chat', label: 'Chat Messages', icon: '💬' },
    { id: 'activities', label: 'Activities', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'blogs':
        return <BlogsManagement />;
      case 'projects':
        return <ProjectsManagement />;
      case 'skills':
        return <SkillsManagement />;
      case 'work-experience':
        return <WorkExperienceManagement />;
      case 'profile':
        return <ProfileManagement />;
      case 'analytics':
        return <AnalyticsManagement />;
      case 'chat':
        return <ChatManagement />;
      case 'activities':
        return <AdminActivitiesManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#404040] shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#404040]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">Admin Panel</h2>
              <p className="text-[#a0a0a0] text-sm">
                Welcome back, {user?.firstName || 'Admin'} 
                <span className="ml-2 px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">
                  Admin
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#262626] hover:bg-[#333] rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-[#262626] border-r border-[#404040] p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-[#a0a0a0] hover:bg-[#333] hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder component for settings tab
function SettingsManagement() {
  return (
    <div className="space-y-6">
      <h3 className="text-white text-2xl font-semibold">Settings</h3>
      <div className="space-y-4">
        <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
          <h4 className="text-white font-semibold mb-4">Site Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-[#e0e0e0] text-sm mb-2">Site Title</label>
              <input
                type="text"
                defaultValue="Portfolio Website"
                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#e0e0e0] text-sm mb-2">Site Description</label>
              <textarea
                defaultValue="A modern portfolio website"
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Save Changes
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
          <h4 className="text-white font-semibold mb-4">Data Management</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Refresh All Data
            </button>
            <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
              Export Data
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Backup
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
