"use client";

import { useState, createContext, useContext } from "react";
import ChatPopup from "./ChatPopup";
import FloatingChatButton from "./FloatingChatButton";

// Create a context for chat functionality
interface ChatContextType {
  chatOpen: boolean;
  handleChatToggle: () => void;
  handleChatClose: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatLayout");
  }
  return context;
};

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [chatOpen, setChatOpen] = useState(false);

  // Handle chat toggle
  const handleChatToggle = () => {
    setChatOpen((prev) => !prev);
  };

  // Handle chat close
  const handleChatClose = () => {
    setChatOpen(false);
  };

  const chatContextValue: ChatContextType = {
    chatOpen,
    handleChatToggle,
    handleChatClose,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
      
      {/* Chat Popup UI - Global */}
      <ChatPopup isOpen={chatOpen} onClose={handleChatClose} />

      {/* Floating Chat Button - Global */}
      <FloatingChatButton
        onClick={handleChatToggle}
        isVisible={true}
        isChatOpen={chatOpen}
      />
    </ChatContext.Provider>
  );
}
