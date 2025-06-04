import { FaPaperPlane } from "react-icons/fa";
import { HomeProfile } from "@/hooks/useHomeData";

interface HeaderProps {
  onChatOpen: () => void;
  profile?: HomeProfile | null;
}

export default function Header({ onChatOpen, profile }: HeaderProps) {
  const displayName = profile?.firstName && profile?.lastName 
    ? `${profile.firstName} ${profile.lastName}` 
    : "Aasu Yadav";
  
  const displayBio = profile?.bio || 
    "A passionate full–stack developer and freelancer, dedicated to building innovative products and web applications while delivering high-quality, client-focused solutions.";

  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{displayName}</h1>
      <p className="leading-relaxed mb-6 text-[#e0e0e0]">
        {displayBio}
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
