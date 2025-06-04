"use client";

import { useChatMessages } from '@/hooks/useChatMessages';

interface ChatManagementProps {
  onRefresh?: () => void;
}

export default function ChatManagement({ onRefresh }: ChatManagementProps) {
  const { chatMessages, isLoading, error, refreshChatMessages } = useChatMessages();

  const handleRefresh = async () => {
    await refreshChatMessages();
    if (onRefresh) onRefresh();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">Chat Messages</h3>
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
        <h3 className="text-white text-2xl font-semibold">Chat Messages</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh Messages'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading chat messages...</p>
        </div>
      ) : (
        <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
          <div className="p-4 border-b border-[#404040]">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">Total Messages: {chatMessages.length}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400">
                  {chatMessages.filter(msg => msg.isRead).length} read
                </span>
                <span className="text-blue-400">
                  {chatMessages.filter(msg => msg.isReplied).length} replied
                </span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
            {chatMessages.map((message, index) => (
              <div key={message._id || index} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{message.name}</p>
                    <p className="text-[#a0a0a0] text-sm">{message.email}</p>
                    {message.subject && (
                      <p className="text-blue-400 text-sm font-medium">{message.subject}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      message.isRead 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                    {message.isReplied && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-600/20 text-blue-400">
                        Replied
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2 line-clamp-3">
                  {message.message}
                </p>
                <div className="flex items-center justify-between text-xs text-[#666]">
                  <span>{new Date(message.createdAt).toLocaleString()}</span>
                  {message.repliedAt && (
                    <span>Replied: {new Date(message.repliedAt).toLocaleString()}</span>
                  )}
                </div>
                {message.reply && (
                  <div className="mt-3 p-3 bg-[#1a1a1a] rounded border-l-2 border-blue-500">
                    <p className="text-[#a0a0a0] text-sm">{message.reply}</p>
                  </div>
                )}
              </div>
            ))}
            {chatMessages.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-[#a0a0a0]">No chat messages found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
