'use client';

import React, { useState } from 'react';
import { useAdminChat } from '@/hooks/useAdminChat';
import { format, parseISO } from 'date-fns';
import { 
  MessageSquare, 
  User, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Users,
  Bot
} from 'lucide-react';

const AdminChatManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [senderFilter, setSenderFilter] = useState<'all' | 'user' | 'assistant'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { 
    messages, 
    pagination, 
    sessionStats, 
    isLoading, 
    error,
    refetch,
  } = useAdminChat({
    page: currentPage,
    limit: 20,
    search: searchTerm,
    sender: senderFilter,
    sortBy: 'createdAt',
    sortOrder: sortOrder
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (filter: 'all' | 'user' | 'assistant') => {
    setSenderFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading chat data: {error}</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
          Chat Management
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-200" />
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Total Messages</p>
              <p className="text-2xl font-bold text-white">
                {pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-200" />
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Active Sessions</p>
              <p className="text-2xl font-bold text-white">
                {sessionStats?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-purple-200" />
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">AI Responses</p>
              <p className="text-2xl font-bold text-white">
                {messages?.filter(m => m.sender === 'assistant').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search messages, users, or sessions..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sender Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                senderFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('user')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                senderFilter === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => handleFilterChange('assistant')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                senderFilter === 'assistant'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              AI
            </button>
          </div>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Session Stats */}
      {sessionStats && sessionStats.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Most Active Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionStats.map((session) => (
              <div key={session._id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Session</span>
                  <span className="text-xs text-blue-400">
                    {session.messageCount} messages
                  </span>
                </div>
                <p className="text-sm font-medium text-white truncate mb-2">
                  {session.userInfo?.name || 'Anonymous User'}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {session.userInfo?.email || 'No email'}
                </p>
                <p className="text-xs text-gray-500">
                  Last: {format(parseISO(session.lastMessage), 'MMM dd, HH:mm')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Messages</h3>
        </div>
        
        <div className="divide-y divide-gray-700">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <div key={message._id} className="p-6 hover:bg-gray-750">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}>
                    {message.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-white">
                        {message.sender === 'user' ? 
                          (message.metadata?.userInfo?.name || 'Anonymous User') : 
                          'AI Assistant'
                        }
                      </span>
                      <span className="text-xs text-gray-400">
                        Session: {message.sessionId.slice(-8)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(parseISO(message.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                      {message.isRead === false && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {message.message}
                    </p>
                    
                    {message.metadata?.userInfo?.email && (
                      <p className="text-xs text-gray-500 mt-2">
                        {message.metadata.userInfo.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No messages found</p>
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="mt-2 text-blue-400 hover:text-blue-300"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} messages
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                <span className="px-3 py-2 text-sm text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatManagement;
