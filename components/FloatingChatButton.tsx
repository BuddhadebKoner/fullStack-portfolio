import { FaComments, FaTimes } from "react-icons/fa";

interface FloatingChatButtonProps {
  onClick: () => void;
  isVisible: boolean;
  isChatOpen: boolean;
}

export default function FloatingChatButton({ onClick, isVisible, isChatOpen }: FloatingChatButtonProps) {
  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 relative ${
          isChatOpen ? 'rotate-180' : ''
        }`}
        onClick={handleClick}
        title={isChatOpen ? "Close chat" : "Chat with Buddhadeb"}
        type="button"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        {isChatOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaComments className="text-xl" />
        )}
      </button>
      
      {/* Pulse effect when chat is closed */}
      {!isChatOpen && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-25 pointer-events-none"></div>
      )}
    </div>
  );
}
