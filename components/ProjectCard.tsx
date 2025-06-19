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
      className="bg-[#232323] rounded-xl p-4 border border-[#232323] flex flex-col h-64 transition hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="rounded-lg overflow-hidden h-28 w-full mb-3 bg-[#111] flex items-center justify-center">
        <Image
          src={img}
          alt={title}
          className="object-cover w-full h-full"
          width={200}
          height={100}
          unoptimized
          loading="lazy"
        />
      </div>
      <div>
        <h4 className="font-semibold mb-1 text-white">
          <PointerHighlight
            rectangleClassName={highlightProps.rectangleClassName}
            pointerClassName={highlightProps.pointerClassName}
            containerClassName="inline-block"
          >
            <span className="relative z-10 p-5">{title}</span>
          </PointerHighlight>
        </h4>
        <p className="text-[#e0e0e0] text-sm">{desc}</p>
      </div>
    </div>
  );
}
