import { FaTimes, FaPaperPlane } from "react-icons/fa";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-end z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-[#232323] text-white w-[350px] md:w-[400px] h-[500px] rounded-2xl m-8 shadow-2xl flex flex-col z-10 border border-[#232323]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#232323]">
          <span className="font-semibold">Chat with Aasu</span>
          <button
            className="hover:bg-[#181818] rounded-full p-1"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
          <div className="self-end bg-[#181818] text-white px-4 py-2 rounded-xl max-w-[80%]">
            Hi, how can I help you?
          </div>
        </div>
        <div className="p-4 border-t border-[#232323] flex items-center gap-2">
          <input
            className="flex-1 rounded-lg bg-[#181818] px-3 py-2 text-sm outline-none border border-[#232323] focus:border-white transition"
            placeholder="Type your message..."
            disabled
          />
          <button
            className="bg-white text-[#161616] px-3 py-2 rounded-lg font-semibold shadow hover:bg-[#f0f0f0] transition flex items-center gap-2"
            disabled
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
