"use client";

import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut
} from '@clerk/nextjs';
import Link from 'next/link';
import { useAdmin } from '@/contexts/AdminContext';

interface FooterProps {
  year?: number;
  name?: string;
}

export default function Footer({ year = 2025 }: FooterProps) {
  const { isAdmin, isLoading } = useAdmin();

  return (
    <>
      <footer className="w-full border-t border-gray-800 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[#e0e0e0] text-sm">Copyright © {year} buddhadeb</p>
            </div>

            <div className="flex items-center gap-4">
              <SignedIn>
                <UserButton />
                {/* Only show admin button if user is admin */}
                {isAdmin && !isLoading && (
                  <Link
                    href="/admin"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                  </Link>
                )}
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                    Sign Up
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
