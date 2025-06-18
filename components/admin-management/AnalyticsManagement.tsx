"use client";

import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsManagementProps {
  onRefresh?: () => void;
}

interface TopPage {
  page: string;
  views: number;
}

export default function AnalyticsManagement({ onRefresh }: AnalyticsManagementProps) {
  const { analytics, isLoading, error, refreshAnalytics } = useAnalytics();

  const handleRefresh = async () => {
    await refreshAnalytics();
    if (onRefresh) onRefresh();
  };

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <h3 className="text-white text-xl sm:text-2xl font-semibold">Analytics Dashboard</h3>
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
              <p className="text-red-400 font-medium text-sm sm:text-base">Error Loading Analytics</p>
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
        <h3 className="text-white text-xl sm:text-2xl font-semibold">Analytics Dashboard</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm sm:text-base font-medium self-start sm:self-auto"
        >
          {isLoading ? 'Loading...' : '🔄 Refresh Analytics'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-6 sm:py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2 text-sm sm:text-base">Loading analytics...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#262626] rounded-lg p-4 sm:p-6 border border-[#404040]">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[#a0a0a0] text-xs sm:text-sm">Page Views</p>
                  <p className="text-white text-lg sm:text-2xl font-semibold truncate">
                    {analytics.totalPageViews || analytics.pageViews || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#262626] rounded-lg p-4 sm:p-6 border border-[#404040]">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[#a0a0a0] text-xs sm:text-sm">Unique Visitors</p>
                  <p className="text-white text-lg sm:text-2xl font-semibold truncate">
                    {analytics.totalUniqueVisitors || analytics.uniqueVisitors || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#262626] rounded-lg p-4 sm:p-6 border border-[#404040] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[#a0a0a0] text-xs sm:text-sm">Total Users</p>
                  <p className="text-white text-lg sm:text-2xl font-semibold truncate">
                    {analytics.totalUsers || analytics.avgTotalUsers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#262626] rounded-lg p-4 sm:p-6 border border-[#404040]">
              <h4 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-orange-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </span>
                Content Analytics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#404040]/50 last:border-b-0">
                  <span className="text-[#a0a0a0] text-sm sm:text-base">Blog Views</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analytics.totalBlogViews || analytics.blogViews || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#404040]/50 last:border-b-0">
                  <span className="text-[#a0a0a0] text-sm sm:text-base">Project Views</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analytics.totalProjectViews || analytics.projectViews || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#a0a0a0] text-sm sm:text-base">New Users</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analytics.totalNewUsers || analytics.newUsers || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#262626] rounded-lg p-4 sm:p-6 border border-[#404040]">
              <h4 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-cyan-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                Additional Metrics
              </h4>
              <div className="space-y-3">
                {analytics.bounceRate && (
                  <div className="flex justify-between items-center py-2 border-b border-[#404040]/50">
                    <span className="text-[#a0a0a0] text-sm sm:text-base">Bounce Rate</span>
                    <span className="text-white font-medium text-sm sm:text-base">{analytics.bounceRate}%</span>
                  </div>
                )}
                {analytics.avgSessionDuration && (
                  <div className="flex justify-between items-center py-2 border-b border-[#404040]/50">
                    <span className="text-[#a0a0a0] text-sm sm:text-base">Avg Session Duration</span>
                    <span className="text-white font-medium text-sm sm:text-base">{analytics.avgSessionDuration}s</span>
                  </div>
                )}
                {analytics.date && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#a0a0a0] text-sm sm:text-base">Last Updated</span>
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {new Date(analytics.date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          {analytics.topPages && analytics.topPages.length > 0 && (
            <div className="bg-[#262626] rounded-lg p-4 sm:p-6 border border-[#404040]">
              <h4 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </span>
                Top Pages
              </h4>
              <div className="space-y-2">
                {analytics.topPages.slice(0, 5).map((page: TopPage, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 sm:py-3 border-b border-[#404040]/50 last:border-b-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-xs text-blue-400 font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-[#a0a0a0] text-sm sm:text-base truncate">{page.page}</span>
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base flex-shrink-0 ml-3">{page.views} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="bg-[#262626] rounded-lg p-6 sm:p-8 border border-[#404040] max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-[#a0a0a0] text-sm sm:text-base">No analytics data available</p>
          </div>
        </div>
      )}
    </div>
  );
}
