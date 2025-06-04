import { UserProfile } from '@clerk/nextjs';
import Link from 'next/link';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[#161616] text-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="px-4 py-2 bg-[#262626] hover:bg-[#333] rounded-lg border border-[#404040] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#404040] p-6">
          <UserProfile 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white",
                headerSubtitle: "text-[#a0a0a0]",
                profileSectionTitle: "text-white",
                profileSectionContent: "text-[#e0e0e0]",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                formFieldInput: "bg-[#262626] border-[#404040] text-white",
                formFieldLabel: "text-[#e0e0e0]",
                breadcrumbsItem: "text-[#a0a0a0]",
                breadcrumbsItemDivider: "text-[#404040]",
                navbarButton: "text-[#e0e0e0] hover:bg-[#262626]",
                pageScrollBox: "bg-transparent",
                page: "bg-transparent",
                accordionTriggerButton: "text-white hover:bg-[#262626]",
                accordionContent: "text-[#e0e0e0]",
                menuButton: "text-[#e0e0e0] hover:bg-[#262626]",
                menuList: "bg-[#262626] border-[#404040]",
                menuItem: "text-[#e0e0e0] hover:bg-[#333]",
              }
            }}
            routing="path"
            path="/user-profile"
          />
        </div>
      </div>
    </div>
  );
}
