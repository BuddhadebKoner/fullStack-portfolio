"use client";

import { useUser } from '@clerk/nextjs';

export function AdminUtility() {
  const { user } = useUser();

  const setAdminRole = async () => {
    if (!user) return;
    
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: 'admin'
        }
      });
      
      // Force a page reload to update the context
      window.location.reload();
    } catch (error) {
      console.error('Error setting admin role:', error);
    }
  };

  const removeAdminRole = async () => {
    if (!user) return;
    
    try {
      const newMetadata = { ...user.unsafeMetadata };
      delete (newMetadata as any).role;
      
      await user.update({
        unsafeMetadata: newMetadata
      });
      
      // Force a page reload to update the context
      window.location.reload();
    } catch (error) {
      console.error('Error removing admin role:', error);
    }
  };

  const isCurrentlyAdmin = user?.unsafeMetadata?.role === 'admin';

  return (
    <div className="fixed bottom-4 left-4 bg-[#1a1a1a] border border-[#404040] rounded-lg p-4 text-white text-sm">
      <h4 className="font-semibold mb-2">Admin Utility (Development)</h4>
      <p className="text-[#a0a0a0] mb-2">
        Current role: {isCurrentlyAdmin ? 'Admin' : 'User'}
      </p>
      <div className="flex gap-2">
        <button
          onClick={setAdminRole}
          disabled={isCurrentlyAdmin}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
        >
          Set Admin
        </button>
        <button
          onClick={removeAdminRole}
          disabled={!isCurrentlyAdmin}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
        >
          Remove Admin
        </button>
      </div>
    </div>
  );
}
