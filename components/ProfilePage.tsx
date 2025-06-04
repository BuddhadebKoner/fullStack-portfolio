"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProfileForm from './ProfileForm';
import { useProfile } from '@/hooks/useProfile';
import { ProfileFormData } from '@/types/profile';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const {
    profile,
    isLoading,
    error,
    isCreating,
    saveProfile,
    refreshProfile
  } = useProfile();

  const handleSubmit = async (formData: ProfileFormData) => {
    try {
      await saveProfile(formData);
      
      // Show success message (you can implement a toast notification here)
      console.log('Profile saved successfully');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error; // Re-throw to let ProfileForm handle the error display
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      router.push('/'); // Redirect to home if canceling profile creation
    } else {
      // Reset form to original data
      refreshProfile();
    }
  };

  // Show loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6">
            <h2 className="text-red-400 text-lg font-semibold mb-2">Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={refreshProfile}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized state
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-white text-xl font-semibold mb-4">Access Denied</h2>
          <p className="text-[#a0a0a0] mb-6">You need to be signed in to view this page.</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isCreating ? 'Create Your Profile' : 'Edit Profile'}
          </h1>
          <p className="text-[#a0a0a0]">
            {isCreating 
              ? 'Complete your profile to showcase your skills and experience.' 
              : 'Update your profile information and settings.'
            }
          </p>
        </div>

        <ProfileForm
          initialData={profile}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode={isCreating ? 'create' : 'edit'}
          className="max-w-none"
        />
      </div>
    </div>
  );
}
