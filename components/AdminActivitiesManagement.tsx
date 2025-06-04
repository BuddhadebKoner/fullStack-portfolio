import { useAdminActivities } from '@/hooks/useAdminActivities';

export default function AdminActivitiesManagement() {
  const { adminActivities, isLoading, error, refreshAdminActivities } = useAdminActivities();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-white text-2xl font-semibold">Admin Activities</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-white text-2xl font-semibold">Admin Activities</h3>
        <div className="bg-[#262626] rounded-lg border border-[#404040] p-6 text-center">
          <p className="text-red-400 mb-4">Error loading activities: {error}</p>
          <button 
            onClick={refreshAdminActivities}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-2xl font-semibold">Admin Activities</h3>
        <button 
          onClick={refreshAdminActivities}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Refresh Activities
        </button>
      </div>
      
      <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
        <div className="p-4 border-b border-[#404040]">
          <p className="text-white font-medium">Total Activities: {adminActivities.length}</p>
        </div>
        <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
          {adminActivities.map((activity, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium">{activity.action || 'Unknown Action'}</p>
                  <p className="text-[#a0a0a0] text-sm">{activity.details || 'No details available'}</p>
                  <p className="text-xs text-[#666] mt-1">
                    User: {activity.userId || 'System'} | 
                    IP: {activity.ipAddress || 'Unknown'}
                  </p>
                </div>
                <span className="text-[#a0a0a0] text-xs">
                  {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Unknown time'}
                </span>
              </div>
            </div>
          ))}
          {adminActivities.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-[#a0a0a0]">No activities found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
