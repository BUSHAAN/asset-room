"use client";
import { LoaderCircle, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

type ImageState = "loading" | "loaded" | "error";

export default function ResourceCard({
  resource,
  showEdit = false,
}: ResourceCardProps) {
  const [image, setImage] = useState<string | null>(null);
  const [imageState, setImageState] = useState<ImageState>("loading");

  useEffect(() => {
    setImageState("loading");
    setImage(null);

    fetch(`/api/preview?url=${encodeURIComponent(resource.url)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch preview");
        }
        return res.json();
      })
      .then((data) => {
        if (data.image) {
          setImage(data.image);
          setImageState("loaded");
        } else {
          setImageState("error");
        }
      })
      .catch(() => {
        setImageState("error");
      });
  }, [resource.url]);

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
      className="relative p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#171718]/5 hover:border-[#171718]/20 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="w-full h-45 rounded-lg mb-4 bg-[#ECE7E1]">
        {imageState === "loading" && (
          <div className="w-full h-full animate-spin flex items-center justify-center">
            <LoaderCircle />
          </div>
        )}
        {imageState === "loaded" && image && (
          <img
            src={image}
            alt={resource.title}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageState("error")}
          />
        )}
        {imageState === "error" && (
          <div className="w-full h-full flex items-center rounded-lg justify-center bg-[#ECE7E1] border border-[#171718]/10">
            <div className="text-center p-4">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-[#171718]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-[#171718]/40 font-medium">
                No preview
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {showEdit && (
          <Link
            href={`/edit/${resource.id}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 px-3 py-1.5 text-xs bg-[#171718]/5 hover:bg-[#171718]/10 text-[#171718] rounded-full transition-all duration-300 font-medium z-10"
          >
            <Pencil className="inline-block w-3 h-3" />
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
    </div>
  );
}
