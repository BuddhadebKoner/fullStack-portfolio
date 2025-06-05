import { FaTimes, FaPaperPlane, FaRobot, FaUser, FaSpinner } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useSimpleChat } from "@/hooks/useSimpleChat";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!inputMessage.trim() || isLoading) return;

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
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
          >
            {part.length > 50 ? `${part.substring(0, 50)}...` : part}
          </a>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-end z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-[#232323] text-white w-[350px] md:w-[400px] h-[500px] rounded-2xl m-8 shadow-2xl flex flex-col z-10 border border-[#404040]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#404040]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Chat with Buddhadeb</span>
          </div>
          <button
            className="hover:bg-[#181818] rounded-full p-1"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between items-start">
                <span>{error}</span>
                <button 
                  onClick={clearError}
                  className="text-red-300 hover:text-white ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                message.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {message.isUser ? <FaUser /> : <FaRobot />}
              </div>
              <div className={`max-w-[70%] ${
                message.isUser ? 'text-right' : 'text-left'
              }`}>
                <div className={`px-4 py-2 rounded-xl ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#181818] text-white border border-[#404040]'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">
                    {message.isUser ? message.text : renderMessageWithLinks(message.text)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-1">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm text-white">
                <FaRobot />
              </div>
              <div className="bg-[#181818] border border-[#404040] px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaSpinner className="animate-spin" />
                  <span>Buddhadeb is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#404040] flex items-center gap-2">
          <input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-[#181818] px-3 py-2 text-sm outline-none border border-[#404040] focus:border-white transition disabled:opacity-50"
            placeholder={isLoading ? "Sending..." : "Type your message..."}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-white text-[#161616] px-3 py-2 rounded-lg font-semibold shadow hover:bg-[#f0f0f0] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          </button>
        </div>
      </div>
    </div>
  );
}
