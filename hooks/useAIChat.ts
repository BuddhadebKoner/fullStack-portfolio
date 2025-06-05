import { useState, useEffect, useCallback } from 'react';

export interface ChatMessage {
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

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sessionId: string;
  sendMessage: (message: string, userInfo?: { name?: string; email?: string }) => Promise<void>;
  loadMessages: () => Promise<void>;
  clearError: () => void;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const clearError = useCallback(() => setError(null), []);
  const clearMessages = useCallback(() => setMessages([]), []);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}&limit=50`);
      const result = await response.json();

      if (result.success && result.data) {
        setMessages(result.data);
      } else {
        throw new Error(result.error || 'Failed to load messages');
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const sendMessage = useCallback(async (
    message: string, 
    userInfo?: { name?: string; email?: string }
  ) => {
    if (!message.trim()) return;

    try {
      setIsSending(true);
      setError(null);

      const response = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: message.trim(),
          userInfo
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Add both user and AI messages to the state
        setMessages(prev => [...prev, result.data.userMessage, result.data.aiMessage]);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [sessionId]);

  // Load initial messages and welcome message
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Check if there are existing messages for this session
        const response = await fetch(`/api/chat/messages?sessionId=${sessionId}&limit=1`);
        const result = await response.json();

        if (result.success && result.data && result.data.length === 0) {
          // No existing messages, send welcome message
          const { generateWelcomeMessage } = await import('@/lib/gemini');
          const welcomeText = await generateWelcomeMessage();
          
          // Save welcome message to database
          await fetch('/api/chat/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              sender: 'assistant',
              message: welcomeText,
              messageType: 'text'
            }),
          });
        }

        // Load all messages
        await loadMessages();
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('Failed to initialize chat');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [sessionId, loadMessages]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    sessionId,
    sendMessage,
    loadMessages,
    clearError,
    clearMessages,
  };
}
