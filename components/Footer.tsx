"use client";

import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut
} from '@clerk/nextjs';
import Link from 'next/link';
import { useAdmin } from '@/contexts/AdminContext';
import { MdSettings, MdLogin } from 'react-icons/md';

interface FooterProps {
  year?: number;
  name?: string;
}

export default function Footer({ year = 2025 }: FooterProps) {
  const { isAdmin, isLoading } = useAdmin();

  return (
    <footer className="mt-auto relative z-50 w-full">
      {/* Improved glass background with better visibility */}
      <div className="relative bg-black/80 backdrop-blur-lg border-t border-white/20 min-h-[80px]">
        {/* Enhanced glassmorphism overlay with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--main-primary)]/20 via-transparent to-[var(--main-secondary)]/20"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Copyright section with improved visibility */}
            <div className="text-center sm:text-left">
              <p className="text-white text-sm font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-relaxed">
                Copyright © {year}{' '}
                <span className="text-[var(--main-primary)] font-bold tracking-wider drop-shadow-[0_1px_4px_rgba(255,129,99,0.5)]">
                  buddhadeb
                </span>
              </p>
            </div>

            {/* Authentication section with enhanced buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <SignedIn>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Enhanced User Button with better visibility */}
                  <div className="relative group">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          userButtonPopoverActionButton: "text-white hover:bg-white/20 transition-colors duration-200",
                          userButtonPopoverFooter: "hidden"
                        }
                      }}
                    />
                  </div>

                  {/* Enhanced Admin Button with better contrast */}
                  {isAdmin && !isLoading && (
                    <Link
                      href="/admin"
                      className="relative group inline-flex items-center"
                    >
                      <div className="relative bg-black/80 backdrop-blur-md border border-white/30 px-4 py-3 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-black/90 hover:border-[var(--main-primary)]/60 hover:scale-105 hover:shadow-lg min-h-[44px]">
                        <MdSettings className="w-4 h-4 transition-transform group-hover:rotate-12 flex-shrink-0" />
                        <span>Admin</span>
                      </div>
                    </Link>
                  )}
                </div>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="relative group inline-flex items-center">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--main-primary)] to-[var(--main-secondary)] rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition duration-300"></div>
                    <div className="relative bg-black/80 backdrop-blur-md border border-white/30 px-6 py-3 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-black/90 hover:border-[var(--main-primary)]/60 hover:scale-105 hover:shadow-lg min-h-[44px]">
                      <MdLogin className="w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                      <span>Sign In</span>
                    </div>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* Subtle animated pattern with reduced opacity */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>
        </div>
      </div>
    </footer>
  );
}