import { FaTimes, FaPaperPlane, FaRobot, FaUser, FaSpinner } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useSimpleChat } from "@/hooks/useSimpleChat";
import { useUser } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();

  const { messages, isLoading, error, sendMessage, clearError } = useSimpleChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const messageToSend = inputMessage.trim();
    setInputMessage("");

    try {
      await sendMessage(messageToSend);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessageWithLinks = (text: string) => {
    // Regular expressions to match URLs and internal routes
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const routeRegex = /(\/[^\s,)\]"']*)/g; // Enhanced route matching

    // First split by URLs, then by routes
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      // Check if it's an external URL
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline transition-colors"
            style={{ color: 'var(--main-primary)' }}
          >
            {part.length > 50 ? `${part.substring(0, 50)}...` : part}
          </a>
        );
      }

      // Split this part by routes
      const routeParts = part.split(routeRegex);

      return routeParts.map((routePart, routeIndex) => {
        // Check if it's an internal route (starts with /)
        if (routeRegex.test(routePart) && routePart.startsWith('/')) {
          // Clean up route part by removing common punctuation at the end
          const cleanRoute = routePart.replace(/[,.)}\]"']*$/, '');

          // Skip if the route is too short or just a slash
          if (cleanRoute.length <= 1) {
            return routePart;
          }


          const routeColor = 'hover:underline transition-colors cursor-pointer';
          const routeStyle = { color: 'var(--main-secondary)' };

          return (
            <Link
              key={`${index}-${routeIndex}`}
              href={cleanRoute}
              className={`inline-flex items-center gap-1 ${routeColor}`}
              style={routeStyle}
              onClick={onClose} // Close chat when navigating
            >
              {cleanRoute}
            </Link>
          );
        }
        return routePart;
      });
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-end justify-end z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      <div className="relative chat-glass-container text-white w-[350px] md:w-[400px] h-[500px] rounded-2xl m-4 md:m-8 shadow-2xl flex flex-col z-10 pointer-events-auto">
        <div className="glass-grid-pattern opacity-10" />
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b relative z-10" style={{ borderColor: 'var(--card-glass-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--main-primary)' }}></div>
            <span className="font-semibold" style={{ color: 'var(--main-primary)' }}>Chat with Buddhadeb</span>
          </div>
          <button
            className="glass-button rounded-full p-2 transition-colors"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 relative z-10">
          {error && (
            <div className="chat-message-bubble p-3 text-sm relative overflow-hidden">
              <div className="glass-grid-pattern opacity-5" />
              <div className="flex justify-between items-start relative z-10">
                <span style={{ color: 'var(--main-secondary)' }}>{error}</span>
                <button
                  onClick={clearError}
                  className="glass-button text-sm px-2 py-1 rounded ml-2 text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${message.isUser
                ? 'glass-button text-white'
                : 'glass-button text-white'
                }`} style={{ backgroundColor: message.isUser ? 'var(--main-primary)' : 'var(--main-secondary)' }}>
                {message.isUser ? (
                  user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="User"
                      width={32}
                      height={32}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser />
                  )
                ) : (
                  <FaRobot />
                )}
              </div>
              <div className={`max-w-[70%] ${message.isUser ? 'text-right' : 'text-left'
                }`}>
                <div className={`px-4 py-2 rounded-xl relative overflow-hidden ${message.isUser
                  ? 'chat-user-message-bubble text-white'
                  : 'chat-message-bubble text-white'
                  }`}>
                  {!message.isUser && <div className="glass-grid-pattern opacity-5" />}
                  <div className="text-sm whitespace-pre-wrap relative z-10">
                    {message.isUser ? message.text : renderMessageWithLinks(message.text)}
                  </div>
                </div>
                <div className="text-xs mt-1 px-1" style={{ color: 'var(--main-secondary)' }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full glass-button flex items-center justify-center text-sm text-white" style={{ backgroundColor: 'var(--main-secondary)' }}>
                <FaRobot />
              </div>
              <div className="chat-message-bubble px-4 py-2 rounded-xl relative overflow-hidden">
                <div className="glass-grid-pattern opacity-5" />
                <div className="flex items-center gap-2 text-sm relative z-10" style={{ color: 'var(--main-secondary)' }}>
                  <FaSpinner className="animate-spin" />
                  <span>Buddhadeb is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center gap-2 relative z-10" style={{ borderColor: 'var(--card-glass-border)' }}>
          <input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 rounded-lg chat-message-bubble px-3 py-2 text-sm outline-none text-white transition disabled:opacity-50 placeholder:text-gray-400"
            placeholder={isLoading ? "Sending..." : "Type your message..."}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="glass-button px-3 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          </button>
        </div>
      </div>
    </div>
  );
}
