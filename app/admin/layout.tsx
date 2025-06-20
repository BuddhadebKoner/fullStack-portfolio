"use client";

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#a0a0a0]">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#404040] shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-[#a0a0a0] mb-6">You don&apos;t have admin privileges to access this page.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/blogs', label: 'Blogs', icon: '📝' },
    { href: '/admin/projects', label: 'Projects', icon: '🚀' },
    { href: '/admin/skills', label: 'Skills', icon: '💡' },
    { href: '/admin/work-experience', label: 'Work Experience', icon: '💼' },
    { href: '/admin/profile', label: 'Profile', icon: '👤' },
    { href: '/admin/chat', label: 'Chat Management', icon: '💬' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => isActive(item.href));
    return currentItem ? currentItem.label : 'Admin Panel';
  };

  const getCurrentPageIcon = () => {
    const currentItem = navItems.find(item => isActive(item.href));
    return currentItem ? currentItem.icon : '📊';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#404040] sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 bg-[#262626] hover:bg-[#333] rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">A</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-white text-xl lg:text-2xl font-bold truncate">Admin Panel</h1>
              <div className="hidden sm:flex items-center text-sm text-[#a0a0a0]">
                <span className="truncate">Welcome back, {user?.firstName || 'Admin'}</span>
                <span className="ml-2 px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full whitespace-nowrap">
                  Admin
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-[#262626] hover:bg-[#333] text-white rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)] lg:h-[calc(100vh-89px)] relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          w-64 lg:w-72 bg-[#1a1a1a] border-r border-[#404040] p-4 lg:p-6
          lg:relative lg:translate-x-0 lg:block
          ${sidebarOpen ? 'fixed z-40 h-full shadow-2xl' : 'hidden lg:block'}
          transition-transform duration-300 ease-in-out overflow-y-auto
        `}>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-[#a0a0a0] hover:bg-[#262626] hover:text-white hover:transform hover:scale-[1.01]'
                }`}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {isActive(item.href) && (
                  <div className="w-2 h-2 bg-white rounded-full ml-auto flex-shrink-0" />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Mobile user info */}
          <div className="lg:hidden mt-6 pt-4 border-t border-[#404040]">
            <div className="flex items-center gap-2 text-xs text-[#a0a0a0]">
              <span className="truncate">Welcome, {user?.firstName || 'Admin'}</span>
              <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 rounded-full whitespace-nowrap">
                Admin
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile tab indicator */}
          <div className="lg:hidden mb-4 mx-4 mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-[#404040] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">{getCurrentPageIcon()}</span>
                <span className="text-white font-medium truncate">{getCurrentPageTitle()}</span>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex-shrink-0 w-8 h-8 bg-[#262626] hover:bg-[#333] rounded-lg flex items-center justify-center transition-colors"
                aria-label="Open navigation menu"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div className="min-h-0 max-w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
