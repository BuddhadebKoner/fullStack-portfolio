import { useState, useEffect } from 'react';

export interface ChatMessageData {
  _id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  isRead: boolean;
  isReplied: boolean;
  reply?: string;
  repliedAt?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessageApiResponse {
  success: boolean;
  data?: ChatMessageData[];
  error?: string;
}

interface UseChatMessagesReturn {
  chatMessages: ChatMessageData[];
  isLoading: boolean;
  error: string | null;
  fetchChatMessages: () => Promise<void>;
  refreshChatMessages: () => Promise<void>;
}

export function useChatMessages(): UseChatMessagesReturn {
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/chat/messages');
      const result: ChatMessageApiResponse = await response.json();

      if (result.success && result.data) {
        setChatMessages(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch chat messages');
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch chat messages');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshChatMessages = async () => {
    await fetchChatMessages();
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  return {
    chatMessages,
    isLoading,
    error,
    fetchChatMessages,
    refreshChatMessages,
  };
}
