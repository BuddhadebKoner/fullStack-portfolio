import { FaPaperPlane } from "react-icons/fa";

interface FloatingChatButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export default function FloatingChatButton({ onClick, isVisible }: FloatingChatButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      className="fixed bottom-6 right-6 bg-[#232323] text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-lg border border-[#232323] hover:bg-[#333] transition z-40"
      onClick={onClick}
    >
      <FaPaperPlane />
    </button>
  );
}
