import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaGlobe } from "react-icons/fa";
import { HomeProfile } from "@/hooks/useHomeData";

interface ConnectCardProps {
  profile?: HomeProfile | null;
}

export default function ConnectCard({ profile }: ConnectCardProps) {
  const socialLinks = profile?.socialLinks;
  const location = profile?.city && profile?.country
    ? `${profile.city}, ${profile.country}`
    : "Mumbai, India";

  return (
    <div className="bg-[#232323] rounded-xl p-5 flex flex-col gap-3">
      <h3 className="text-lg font-semibold mb-1">Let&apos;s connect</h3>
      <div className="flex gap-3 text-xl mb-2">
        {socialLinks?.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition"
            aria-label="Github"
          >
            <FaGithub />
          </a>
        )}
        {socialLinks?.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition"
            aria-label="Linkedin"
          >
            <FaLinkedin />
          </a>
        )}
        {socialLinks?.twitter && (
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
        )}
        {socialLinks?.website && (
          <a
            href={socialLinks.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition"
            aria-label="Website"
          >
            <FaGlobe />
          </a>
        )}

        {/* Fallback social links if no profile data */}
        {!socialLinks && (
          <>
            <a href="#" className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition" aria-label="Github">
              <FaGithub />
            </a>
            <a href="#" className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition" aria-label="Linkedin">
              <FaLinkedin />
            </a>
            <a href="#" className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="bg-[#181818] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#333] transition" aria-label="Instagram">
              <FaInstagram />
            </a>
          </>
        )}
      </div>
      <div className="text-sm">
        <div className="font-semibold">Email</div>
        <div className="mb-2 text-[#e0e0e0]">
          {profile?.email || ""}
        </div>
        <div className="font-semibold">Address</div>
        <div className="text-[#e0e0e0]">{location}</div>
      </div>
    </div>
  );
}
