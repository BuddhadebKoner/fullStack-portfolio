interface BlogCardProps {
  title: string;
  desc: string;
}

export default function BlogCard({ title, desc }: BlogCardProps) {
  return (
    <div className="bg-[#232323] rounded-xl p-5 h-full flex flex-col justify-between border border-[#232323]">
      <h4 className="font-semibold mb-2 text-base">{title}</h4>
      <p className="text-[#b5b5b5] text-sm">{desc}</p>
    </div>
  );
}
