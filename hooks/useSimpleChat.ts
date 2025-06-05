import { useState, useCallback, useRef, useEffect } from 'react';

export interface SimpleChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseSimpleChatReturn {
  messages: SimpleChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export function useSimpleChat(): UseSimpleChatReturn {
  const [messages, setMessages] = useState<SimpleChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = useRef(generateSessionId());

  // Generate welcome message on first load
  useEffect(() => {
    const welcomeMessage: SimpleChatMessage = {
      id: generateId(),
      text: "Hi there! 👋 I'm Buddhadeb Koner",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setError(null);
    
    const userMsg: SimpleChatMessage = {
      id: generateId(),
      text: userMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      console.log('Sending message to API:', userMessage);
      
      const response = await fetch('/api/chat/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.trim(),
          sessionId: sessionId.current,
          conversationHistory: messages.slice(-6) // Send last 6 messages for context
        }),
      });

      console.log('API Response status:', response.status);
      
      const result = await response.json();
      // console.log('API Response data:', result);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result.error || 'Unknown error'}`);
      }

      if (result.success && result.reply) {
        const aiMsg: SimpleChatMessage = {
          id: generateId(),
          text: result.reply,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(result.error || 'No reply received from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to send message: ${errorMessage}`);
      
      // Add error message to chat
      const errorMsg: SimpleChatMessage = {
        id: generateId(),
        text: "Sorry, I'm having trouble responding right now. Please try again in a moment, or feel free to contact me directly through the links in my profile!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionId.current = generateSessionId();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
