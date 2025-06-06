interface ProjectCardProps {
  title: string;
  desc: string;
  img: string;
  index: number;
  // Add onClick for modal
  onClick?: () => void;
}

export default function ProjectCard({ title, desc, img, index, onClick }: ProjectCardProps) {
  const getGradient = (idx: number) => {
    if (idx % 3 === 0) {
      return "linear-gradient(120deg,#643841 0%,#b8774e 100%)";
    } else if (idx % 3 === 1) {
      return "linear-gradient(120deg,#17777b 0%,#78d3dd 100%)";
    } else {
      return "linear-gradient(120deg,#6c5987 0%,#b79bda 100%)";
    }
  };

  return (
    <div
      className="bg-[#232323] rounded-xl p-4 border border-[#232323] flex flex-col h-64 transition hover:shadow-lg cursor-pointer"
      style={{
        background: getGradient(index),
      }}
      onClick={onClick}
    >
      <div className="rounded-lg overflow-hidden h-28 w-full mb-3 bg-[#111] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={title} className="object-cover w-full h-full" />
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-[#e0e0e0] text-sm">{desc}</p>
      </div>
    </div>
  );
}
