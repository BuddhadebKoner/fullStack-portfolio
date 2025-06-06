"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const { user, isLoaded } = useUser();

  // Check if user has admin role in metadata
  const isAdmin = user?.publicMetadata?.role === 'admin' ||
    (user?.unsafeMetadata as any)?.role === 'admin';
  const isLoading = !isLoaded;

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
