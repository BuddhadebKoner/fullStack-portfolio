import { PointerHighlight } from "@/components/ui/pointer-highlight";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  desc: string;
  img: string;
  index: number;
  // Add onClick for modal
  onClick?: () => void;
}

export default function ProjectCard({ title, desc, img, index, onClick }: ProjectCardProps) {
  const getPointerHighlightProps = (idx: number) => {
    if (idx % 3 === 0) {
      return {
        rectangleClassName: "bg-orange-500/20 border-orange-400 leading-loose",
        pointerClassName: "text-orange-400 h-3 w-3"
      };
    } else if (idx % 3 === 1) {
      return {
        rectangleClassName: "bg-cyan-500/20 border-cyan-400 leading-loose",
        pointerClassName: "text-cyan-400 h-3 w-3"
      };
    } else {
      return {
        rectangleClassName: "bg-purple-500/20 border-purple-400 leading-loose",
        pointerClassName: "text-purple-400 h-3 w-3"
      };
    }
  };

  const highlightProps = getPointerHighlightProps(index);

  return (
    <div
      className="glass-card rounded-xl p-2 flex flex-col h-64 transition cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >
      <div className="glass-grid-pattern opacity-10" />
      <div className="rounded-lg overflow-hidden w-full mb-3 bg-[#111] flex items-center justify-center relative z-10">
        <Image
          src={img}
          alt={title}
          className="w-full h-full"
          width={200}
          height={100}
          unoptimized
          loading="lazy"
        />
      </div>
      <div className="relative z-10">
        <h4 className="font-semibold mb-1 text-white">
          <PointerHighlight
            rectangleClassName={highlightProps.rectangleClassName}
            pointerClassName={highlightProps.pointerClassName}
            containerClassName="inline-block"
          >
            <span className="relative z-10 p-5" style={{ color: 'var(--main-primary)' }}>{title}</span>
          </PointerHighlight>
        </h4>
        <p className="text-[#e0e0e0] text-sm">{desc} ...</p>
      </div>
    </div>
  );
}
