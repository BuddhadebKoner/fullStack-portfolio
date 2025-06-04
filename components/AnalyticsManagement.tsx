"use client";

import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsManagementProps {
  onRefresh?: () => void;
}

export default function AnalyticsManagement({ onRefresh }: AnalyticsManagementProps) {
  const { analytics, isLoading, error, refreshAnalytics } = useAnalytics();

  const handleRefresh = async () => {
    await refreshAnalytics();
    if (onRefresh) onRefresh();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Analytics</h3>
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
        <h3 className="text-white text-2xl font-semibold">Analytics</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh Analytics'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading analytics...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-lg">👁️</span>
                </div>
                <div>
                  <p className="text-[#a0a0a0] text-sm">Page Views</p>
                  <p className="text-white text-2xl font-semibold">
                    {analytics.totalPageViews || analytics.pageViews || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-400 text-lg">👥</span>
                </div>
                <div>
                  <p className="text-[#a0a0a0] text-sm">Unique Visitors</p>
                  <p className="text-white text-2xl font-semibold">
                    {analytics.totalUniqueVisitors || analytics.uniqueVisitors || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400 text-lg">📊</span>
                </div>
                <div>
                  <p className="text-[#a0a0a0] text-sm">Total Users</p>
                  <p className="text-white text-2xl font-semibold">
                    {analytics.totalUsers || analytics.avgTotalUsers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
              <h4 className="text-white text-lg font-semibold mb-4">Content Analytics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Blog Views</span>
                  <span className="text-white">{analytics.totalBlogViews || analytics.blogViews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Project Views</span>
                  <span className="text-white">{analytics.totalProjectViews || analytics.projectViews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">New Users</span>
                  <span className="text-white">{analytics.totalNewUsers || analytics.newUsers || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
              <h4 className="text-white text-lg font-semibold mb-4">Additional Metrics</h4>
              <div className="space-y-3">
                {analytics.bounceRate && (
                  <div className="flex justify-between">
                    <span className="text-[#a0a0a0]">Bounce Rate</span>
                    <span className="text-white">{analytics.bounceRate}%</span>
                  </div>
                )}
                {analytics.avgSessionDuration && (
                  <div className="flex justify-between">
                    <span className="text-[#a0a0a0]">Avg Session Duration</span>
                    <span className="text-white">{analytics.avgSessionDuration}s</span>
                  </div>
                )}
                {analytics.date && (
                  <div className="flex justify-between">
                    <span className="text-[#a0a0a0]">Last Updated</span>
                    <span className="text-white text-sm">
                      {new Date(analytics.date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          {analytics.topPages && analytics.topPages.length > 0 && (
            <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
              <h4 className="text-white text-lg font-semibold mb-4">Top Pages</h4>
              <div className="space-y-2">
                {analytics.topPages.slice(0, 5).map((page: any, index: number) => (
                  <div key={index} className="flex justify-between py-2 border-b border-[#404040] last:border-b-0">
                    <span className="text-[#a0a0a0]">{page.page}</span>
                    <span className="text-white">{page.views} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#a0a0a0]">No analytics data available</p>
        </div>
      )}
    </div>
  );
}
