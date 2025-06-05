"use client";

import { useState, useEffect } from 'react';
import { FaRobot, FaUser, FaTrash, FaEye, FaComments, FaClock } from 'react-icons/fa';

interface ChatMessage {
  _id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  message: string;
  messageType: 'text' | 'image' | 'file';
  metadata?: {
    userInfo?: {
      name?: string;
      email?: string;
      ipAddress?: string;
    };
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  lastMessage: ChatMessage;
  messageCount: number;
  userMessageCount: number;
  lastActivity: string;
  userInfo?: {
    name?: string;
    email?: string;
    ipAddress?: string;
  };
}

interface ChatManagementProps {
  onRefresh?: () => void;
}

export default function ChatManagement({ onRefresh }: ChatManagementProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/chat/sessions');
      const result = await response.json();

      if (result.success && result.data) {
        setChatSessions(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch chat sessions');
      }
    } catch (err) {
      console.error('Error fetching chat sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chat sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const markSessionAsRead = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/admin/chat/sessions/${sessionId}/mark-read`, {
        method: 'PATCH'
      });

      if (response.ok) {
        setChatSessions(prev => 
          prev.map(session => 
            session.sessionId === sessionId 
              ? { 
                  ...session, 
                  messages: session.messages.map(msg => ({ ...msg, isRead: true }))
                }
              : session
          )
        );
      }
    } catch (err) {
      console.error('Error marking session as read:', err);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return;

    try {
      const response = await fetch(`/api/admin/chat/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setChatSessions(prev => prev.filter(session => session.sessionId !== sessionId));
        if (selectedSession === sessionId) {
          setSelectedSession(null);
        }
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getUnreadCount = (session: ChatSession) => {
    return session.messages.filter(msg => !msg.isRead && msg.sender === 'user').length;
  };

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const handleRefresh = async () => {
    await fetchChatSessions();
    if (onRefresh) onRefresh();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-semibold">AI Chat Sessions</h3>
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
        <h3 className="text-white text-2xl font-semibold">AI Chat Sessions</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh Sessions'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#a0a0a0] mt-2">Loading chat sessions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions List */}
          <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
            <div className="p-4 border-b border-[#404040]">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">
                  <FaComments className="inline mr-2" />
                  Total Sessions: {chatSessions.length}
                </p>
                <span className="text-blue-400 text-sm">
                  {chatSessions.reduce((acc, session) => acc + getUnreadCount(session), 0)} unread
                </span>
              </div>
            </div>
            <div className="divide-y divide-[#404040] max-h-96 overflow-y-auto">
              {chatSessions.map((session) => {
                const unreadCount = getUnreadCount(session);
                return (
                  <div 
                    key={session.sessionId} 
                    className={`p-4 cursor-pointer hover:bg-[#333] transition-colors ${
                      selectedSession === session.sessionId ? 'bg-[#333] border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedSession(session.sessionId)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">
                            Session {session.sessionId.slice(-8)}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {session.userInfo?.name && (
                          <p className="text-green-400 text-sm">{session.userInfo.name}</p>
                        )}
                        {session.userInfo?.email && (
                          <p className="text-blue-400 text-sm">{session.userInfo.email}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markSessionAsRead(session.sessionId);
                          }}
                          className="text-green-400 hover:text-green-300"
                          title="Mark as read"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.sessionId);
                          }}
                          className="text-red-400 hover:text-red-300"
                          title="Delete session"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-[#a0a0a0] text-sm mb-2 line-clamp-2">
                      {session.lastMessage.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-[#666]">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {formatTime(session.lastActivity)}
                      </span>
                      <span>{session.messageCount} messages</span>
                    </div>
                  </div>
                );
              })}
              
              {chatSessions.length === 0 && (
                <div className="p-8 text-center">
                  <FaComments className="mx-auto text-4xl text-[#666] mb-2" />
                  <p className="text-[#a0a0a0]">No chat sessions found</p>
                </div>
              )}
            </div>
          </div>

          {/* Session Messages */}
          <div className="bg-[#262626] rounded-lg border border-[#404040] overflow-hidden">
            {selectedSession ? (
              <>
                <div className="p-4 border-b border-[#404040]">
                  <p className="text-white font-medium">
                    Session: {selectedSession.slice(-8)}
                  </p>
                  {chatSessions.find(s => s.sessionId === selectedSession)?.userInfo && (
                    <div className="text-sm text-[#a0a0a0] mt-1">
                      {chatSessions.find(s => s.sessionId === selectedSession)?.userInfo?.name && (
                        <span className="mr-4">👤 {chatSessions.find(s => s.sessionId === selectedSession)?.userInfo?.name}</span>
                      )}
                      {chatSessions.find(s => s.sessionId === selectedSession)?.userInfo?.email && (
                        <span>📧 {chatSessions.find(s => s.sessionId === selectedSession)?.userInfo?.email}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                  {chatSessions
                    .find(session => session.sessionId === selectedSession)
                    ?.messages.map((message) => (
                      <div 
                        key={message._id}
                        className={`flex gap-2 ${
                          message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          message.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-green-500 text-white'
                        }`}>
                          {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                        </div>
                        <div className={`max-w-[80%] ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`px-3 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-[#333] text-white border border-[#404040]'
                          }`}>
                            <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                          </div>
                          <div className="text-xs text-[#666] mt-1 px-1 flex items-center gap-2">
                            <span>{formatTime(message.createdAt)}</span>
                            {!message.isRead && message.sender === 'user' && (
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <FaComments className="mx-auto text-4xl text-[#666] mb-2" />
                <p className="text-[#a0a0a0]">Select a session to view messages</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
