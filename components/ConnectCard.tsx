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
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3 relative z-10">
      <div className="glass-grid-pattern opacity-20" />
      <h3 className="text-lg font-semibold mb-1 relative z-10" style={{ color: 'var(--main-primary)' }}>Let&apos;s connect</h3>
      <div className="flex gap-3 text-xl mb-2 relative z-10">
        {socialLinks?.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition"
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
            className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition"
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
            className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition"
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
            className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition"
            aria-label="Website"
          >
            <FaGlobe />
          </a>
        )}

        {/* Fallback social links if no profile data */}
        {!socialLinks && (
          <>
            <a href="#" className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition" aria-label="Github">
              <FaGithub />
            </a>
            <a href="#" className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition" aria-label="Linkedin">
              <FaLinkedin />
            </a>
            <a href="#" className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="glass-button rounded-full w-8 h-8 flex items-center justify-center transition" aria-label="Instagram">
              <FaInstagram />
            </a>
          </>
        )}
      </div>
      <div className="text-sm relative z-10">
        <div className="font-semibold" style={{ color: 'var(--main-secondary)' }}>Email</div>
        <div className="mb-2 text-[#e0e0e0]">
          {profile?.email || ""}
        </div>
        <div className="font-semibold" style={{ color: 'var(--main-secondary)' }}>Address</div>
        <div className="text-[#e0e0e0]">{location}</div>
      </div>
    </div>
  );
}
