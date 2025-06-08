import Link from 'next/link';

interface BlogCardProps {
  title: string;
  desc: string;
  slug?: string;
  views?: number;
  likes?: number;
  tags?: string[];
  author?: string;
  createdAt?: string;
}

export default function BlogCard({ title, desc, slug, views, likes, tags, author }: BlogCardProps) {
  const cardContent = (
    <div className="bg-[#232323] rounded-xl p-5 h-full flex flex-col justify-between border border-[#232323] hover:border-[#404040] transition-colors group cursor-pointer">
      <div>
        <h4 className="font-semibold mb-2 text-base">{title}</h4>
        <p className="text-[#b5b5b5] text-sm mb-3">{desc}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-[#333] text-xs rounded-full text-[#ccc]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center text-xs text-[#888] mt-2">
        <span>{author || 'Admin'}</span>
        <div className="flex gap-3">
          {views !== undefined && (
            <span>👁 {views}</span>
          )}
          {likes !== undefined && (
            <span>❤ {likes}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/blog/${slug}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
