import { FaPaperPlane } from "react-icons/fa";
import { HomeProfile } from "@/hooks/useHomeData";
import { useChat } from "./ChatLayout";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { codingBuddy } from "@/lib/constant";

interface HeaderProps {
  profile?: HomeProfile | null;
}

export default function Header({ profile }: HeaderProps) {
  const { handleChatToggle } = useChat();

  const displayName = profile?.firstName && profile?.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : "Buddhadeb Koner";

  const displayBio = profile?.bio ||
    "I am Buddhadeb Koner, a FullStack Web Developer with a passion for creating and sharing great software. I specialize in the MERN stack and Next.js, and I am always eager to learn new technologies and frameworks. I am a dedicated problem solver who enjoys contributing to open-source projects and building innovative web applications.";

  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{displayName}</h1>
      <p className="leading-relaxed mb-6 text-[#e0e0e0]">
        {displayBio}
      </p>

      <p className="text-lg md:text-xl font-semibold mb-4 text-[#e0e0e0]">
        Coding Buddys
      </p>
      <div className="flex  mb-10 w-full">
        <AnimatedTooltip items={codingBuddy} />
      </div>

      <div className="flex gap-3 mb-10 flex-wrap">
        {profile?.resumeUrl ? (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#161616] rounded px-4 py-2 font-medium text-sm shadow hover:bg-[#f0f0f0] transition border border-white"
          >
            Download Resume
          </a>
        ) : (
          <button
            className="bg-white text-[#161616] rounded px-4 py-2 font-medium text-sm shadow border border-white opacity-50 cursor-not-allowed"
            disabled
          >
            Download Resume
          </button>
        )}
        <button
          className="flex items-center gap-2 border border-white px-4 py-2 rounded text-sm font-medium hover:bg-[#1d1d1d] transition"
          onClick={handleChatToggle}
        >
          <FaPaperPlane className="text-base" /> Chat with me
        </button>
      </div>
    </div>
  );
}
