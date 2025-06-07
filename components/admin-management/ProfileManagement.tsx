"use client";

import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';
import Image from 'next/image';
import ProfileForm from '../ProfileForm';
import { ProfileFormData } from '@/types/profile';

interface ProfileManagementProps {
  onRefresh?: () => void;
}

export default function ProfileManagement({ onRefresh }: ProfileManagementProps) {
  const { profile, isLoading, error, isCreating, saveProfile, refreshProfile } = useProfile();
  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleRefresh = async () => {
    await refreshProfile();
    if (onRefresh) onRefresh();
  };

  const handleSubmit = async (formData: ProfileFormData) => {
    try {
      await saveProfile(formData);
      setShowProfileForm(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Profile Information</h3>
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
        <h3 className="text-white text-2xl font-semibold">Profile Information</h3>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {isLoading ? 'Loading...' : 'Refresh Profile'}
          </button>
          <button 
            onClick={() => setShowProfileForm(!showProfileForm)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            {showProfileForm ? 'View Profile' : (isCreating ? 'Create Profile' : 'Edit Profile')}
          </button>
        </div>
      </div>
      
      {showProfileForm ? (
        <ProfileForm
          initialData={profile}
          mode={isCreating ? 'create' : 'edit'}
          onCancel={() => setShowProfileForm(false)}
          onSubmit={handleSubmit}
        />
      ) : (
        <>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-[#a0a0a0] mt-2">Loading profile...</p>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Profile Overview Card */}
              <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    {profile.avatar ? (
                      <Image 
                        src={profile.avatar} 
                        alt="Profile" 
                        width={80}
                        height={80}
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {profile.firstName?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-xl font-semibold mb-2">
                      {profile.firstName} {profile.lastName}
                    </h4>
                    <p className="text-[#a0a0a0] mb-2">{profile.bio || 'No bio set'}</p>
                    <p className="text-[#a0a0a0] text-sm mb-3">{profile.email}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        profile.isPublic 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {profile.isPublic ? 'Public' : 'Private'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        profile.isAvailable 
                          ? 'bg-emerald-600/20 text-emerald-400' 
                          : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {profile.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#262626] rounded-lg p-4 border border-[#404040]">
                  <h5 className="text-white font-medium mb-3">Contact Information</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-[#a0a0a0]">
                      <span className="text-white">Phone:</span> {profile.phone || 'Not provided'}
                    </p>
                    <p className="text-[#a0a0a0]">
                      <span className="text-white">Location:</span> {profile.city}, {profile.country}
                    </p>
                    <p className="text-[#a0a0a0]">
                      <span className="text-white">Address:</span> {profile.address || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#262626] rounded-lg p-4 border border-[#404040]">
                  <h5 className="text-white font-medium mb-3">Resume</h5>
                  <div className="space-y-2 text-sm">
                    {profile.resumeUrl ? (
                      <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Resume PDF</a>
                    ) : (
                      <span className="text-[#a0a0a0]">No resume link set</span>
                    )}  
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {profile.socialLinks && (
                <div className="bg-[#262626] rounded-lg p-4 border border-[#404040]">
                  <h5 className="text-white font-medium mb-3">Social Links</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {Object.entries(profile.socialLinks).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 capitalize"
                        >
                          {platform}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : isCreating ? (
            <div className="text-center py-8">
              <div className="bg-[#262626] rounded-lg p-8 border border-[#404040]">
                <h4 className="text-white text-xl font-semibold mb-4">Welcome! Let&apos;s create your profile</h4>
                <p className="text-[#a0a0a0] mb-6">
                  You haven&apos;t created your profile yet. Click the &quot;Create Profile&quot; button above to get started.
                </p>
                <button 
                  onClick={() => setShowProfileForm(true)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create Your Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#a0a0a0]">No profile data found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
