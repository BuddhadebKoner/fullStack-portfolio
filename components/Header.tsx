import { FaPaperPlane } from "react-icons/fa";

interface HeaderProps {
  onChatOpen: () => void;
}

export default function Header({ onChatOpen }: HeaderProps) {
  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Aasu Yadav</h1>
      <p className="leading-relaxed mb-6 text-[#e0e0e0]">
        A passionate <b className="text-white">full–stack developer</b> and <b className="text-white">freelancer</b>, dedicated to building innovative <b className="text-white">products</b> and <b className="text-white">web applications</b> while delivering high-quality, client-focused solutions.
      </p>
      <div className="flex gap-3 mb-10 flex-wrap">
        <button className="bg-white text-[#161616] rounded px-4 py-2 font-medium text-sm shadow hover:bg-[#f0f0f0] transition border border-white">
          Download Resume
        </button>
        <button
          className="flex items-center gap-2 border border-white px-4 py-2 rounded text-sm font-medium hover:bg-[#1d1d1d] transition"
          onClick={onChatOpen}
        >
          <FaPaperPlane className="text-base" /> Chat with me
        </button>
      </div>
    </div>
  );
}
