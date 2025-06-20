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
    <div className="w-full max-w-5xl relative z-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: 'var(--main-primary)' }}>{displayName}</h1>
      <p className="leading-relaxed mb-6 text-[#e0e0e0]">
        {displayBio}
      </p>

      <p className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--main-secondary)' }}>
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
            className="glass-button text-white rounded px-4 py-2 font-medium text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-[3px] transition-all duration-300"
          >
            Download Resume
          </a>
        ) : (
          <button
            className="glass-button text-white rounded px-4 py-2 font-medium text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap opacity-50 cursor-not-allowed"
            disabled
          >
            Download Resume
          </button>
        )}
        <button
          className="glass-button flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-all duration-300"
          onClick={handleChatToggle}
        >
          <FaPaperPlane className="text-base" /> Chat with me
        </button>
      </div>
    </div>
  );
}
