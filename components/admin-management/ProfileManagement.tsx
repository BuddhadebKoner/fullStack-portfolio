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
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <h3 className="text-white text-xl sm:text-2xl font-semibold">Profile Information</h3>
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
              <p className="text-red-400 font-medium text-sm sm:text-base">Error Loading Profile</p>
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
        <h3 className="text-white text-xl sm:text-2xl font-semibold">Profile Information</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Loading...' : '🔄 Refresh'}
          </button>
          <button 
            onClick={() => setShowProfileForm(!showProfileForm)}
            className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            {showProfileForm ? 'View Profile' : (isCreating ? '+ Create Profile' : '✏️ Edit Profile')}
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
            <div className="space-y-4 sm:space-y-6">
              {/* Profile Overview Card */}
              <div className="bg-[#262626] rounded-lg p-4 sm:p-6 border border-[#404040]">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {profile?.avatar ? (
                      <Image 
                        src={profile.avatar} 
                        alt="Profile" 
                        width={96}
                        height={96}
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-white text-2xl sm:text-3xl font-bold">
                        {profile?.firstName?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <h4 className="text-white text-lg sm:text-xl font-semibold">
                      {profile?.firstName} {profile?.lastName}
                    </h4>
                    <p className="text-[#a0a0a0] text-sm sm:text-base leading-relaxed">
                      {profile?.bio || 'No bio set'}
                    </p>
                    <p className="text-[#a0a0a0] text-xs sm:text-sm">{profile?.email}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        profile?.isPublic 
                          ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                          : 'bg-red-600/20 text-red-400 border border-red-600/30'
                      }`}>
                        {profile?.isPublic ? '🌐 Public' : '🔒 Private'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        profile?.isAvailable 
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' 
                          : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                      }`}>
                        {profile?.isAvailable ? '✅ Available' : '⏸️ Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Profile Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-[#262626] rounded-lg p-4 sm:p-5 border border-[#404040]">
                  <h5 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Contact Information
                  </h5>
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-white font-medium min-w-0 sm:min-w-[60px]">Phone:</span> 
                      <span className="text-[#a0a0a0] break-all">{profile?.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-white font-medium min-w-0 sm:min-w-[60px]">Location:</span> 
                      <span className="text-[#a0a0a0]">{profile?.city}, {profile?.country}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                      <span className="text-white font-medium min-w-0 sm:min-w-[60px] flex-shrink-0">Address:</span> 
                      <span className="text-[#a0a0a0] break-words">{profile?.address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#262626] rounded-lg p-4 sm:p-5 border border-[#404040]">
                  <h5 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-600/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    Resume
                  </h5>
                  <div className="space-y-2 text-sm sm:text-base">
                    {profile?.resumeUrl ? (
                      <a 
                        href={profile.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-600/30 text-xs sm:text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Resume PDF
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-600/20 text-gray-400 rounded-lg border border-gray-600/30 text-xs sm:text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        No resume link set
                      </div>
                    )}  
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {profile?.socialLinks && (
                <div className="bg-[#262626] rounded-lg p-4 sm:p-5 border border-[#404040]">
                  <h5 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </span>
                    Social Links
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(profile.socialLinks).map(([platform, url]) => 
                      url ? (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-600/30 text-xs sm:text-sm font-medium capitalize"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {platform}
                        </a>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : isCreating ? (
            <div className="text-center py-6 sm:py-8">
              <div className="bg-[#262626] rounded-lg p-6 sm:p-8 border border-[#404040] max-w-2xl mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Welcome! Let&apos;s create your profile
                </h4>
                <p className="text-[#a0a0a0] text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
                  You haven&apos;t created your profile yet. Click the &quot;Create Profile&quot; button to get started and showcase your information.
                </p>
                <button 
                  onClick={() => setShowProfileForm(true)}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="bg-[#262626] rounded-lg p-6 sm:p-8 border border-[#404040] max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-[#a0a0a0] text-sm sm:text-base">No profile data found</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
