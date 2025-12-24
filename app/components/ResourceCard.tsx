import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

interface ResourceCardProps {
  resource: Resource;
  showEdit?: boolean;
}

export default function ResourceCard({ resource, showEdit = false }: ResourceCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Don't open URL if clicking on edit button
    if ((e.target as HTMLElement).closest("a")) {
      return;
    }
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#171718]/5 hover:border-[#171718]/20 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {showEdit && (
        <Link
          href={`/edit/${resource.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 px-3 py-1.5 text-xs bg-[#171718]/5 hover:bg-[#171718]/10 text-[#171718] rounded-full transition-all duration-300 font-medium"
        >
          Edit
        </Link>
      )}
      <h3 className="text-xl font-serif font-semibold mb-3 text-[#171718] pr-16 leading-tight">
        {resource.title}
      </h3>
      <p className="text-sm text-[#171718]/70 mb-4 line-clamp-2 leading-relaxed">
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {resource.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs bg-[#171718]/5 text-[#171718]/80 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

