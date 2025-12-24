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
      className="relative p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 hover:shadow-lg"
    >
      {showEdit && (
        <Link
          href={`/edit/${resource.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 px-3 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-50 rounded transition-colors"
        >
          Edit
        </Link>
      )}
      <h3 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50 pr-16">
        {resource.title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {resource.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

