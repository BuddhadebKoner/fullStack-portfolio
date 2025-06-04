import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

export default function ConnectCard() {
  return (
    <div className="bg-[#232323] rounded-xl p-5 flex flex-col gap-3">
      <h3 className="text-lg font-semibold mb-1">Let's connect</h3>
      <div className="flex gap-3 text-xl mb-2">
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
      </div>
      <div className="text-sm">
        <div className="font-semibold">Email</div>
        <div className="mb-2 text-[#e0e0e0]">aasuyadav284@gmail.com</div>
        <div className="font-semibold">Address</div>
        <div className="text-[#e0e0e0]">Mumbai, India</div>
      </div>
    </div>
  );
}
