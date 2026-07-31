"use client";

import { Resource } from "@/types/resource.types";
import { fetchPreviewImage } from "@/lib/preview-client";
import { LoaderCircle, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResourceCardProps {
  resource: Resource;
  showEdit?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  index?: number;
  onTagClick?: (tag: string) => void;
}

type ImageState = "loading" | "loaded" | "error";

export default function ResourceCard({
  resource,
  showEdit = false,
  ref,
  index = 0,
  onTagClick,
}: ResourceCardProps) {
  const [image, setImage] = useState<string | null>(
    resource.previewImage || null
  );
  const [imageState, setImageState] = useState<ImageState>(
    resource.previewImage ? "loaded" : "loading"
  );

  useEffect(() => {
    if (resource.previewImage) {
      setImage(resource.previewImage);
      setImageState("loaded");
      return;
    }

    let cancelled = false;
    setImageState("loading");
    setImage(null);

    fetchPreviewImage(resource.url).then((preview) => {
      if (cancelled) return;
      if (preview) {
        setImage(preview);
        setImageState("loaded");
      } else {
        setImageState("error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [resource.url, resource.previewImage]);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) {
      return;
    }
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  const staggerDelay = Math.min(index, 8) * 40;

  return (
    <div
      ref={ref}
      onClick={handleClick}
      style={{ animationDelay: `${staggerDelay}ms` }}
      className="animate-fade-up relative p-4 bg-surface rounded-lg border border-hairline cursor-pointer transition-[border-color,background-color] duration-200 hover:border-muted hover:bg-[#2a2825]"
    >
      <div className="w-full aspect-[16/10] rounded-md mb-4 bg-surface-soft overflow-hidden">
        {imageState === "loading" && (
          <div className="w-full h-full animate-shimmer flex items-center justify-center">
            <LoaderCircle className="w-5 h-5 text-muted animate-spin" />
          </div>
        )}
        {imageState === "loaded" && image && (
          <img
            src={image}
            alt={resource.title}
            className="w-full h-full object-cover"
            onError={() => setImageState("error")}
          />
        )}
        {imageState === "error" && (
          <div className="w-full h-full flex items-center justify-center bg-surface-soft border border-hairline rounded-md">
            <div className="text-center p-4">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-muted"
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
              <p className="text-xs text-muted font-medium">No preview</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {showEdit && (
          <Link
            href={`/edit/${resource._id}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-surface-soft border border-hairline text-muted hover:text-ink hover:border-muted transition-colors z-10"
            aria-label="Edit resource"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
        )}
        <h3 className="font-display text-lg leading-snug tracking-[-0.01em] mb-2 text-ink pr-10">
          {resource.title}
        </h3>
        <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag, tagIndex) =>
            onTagClick ? (
              <button
                key={tagIndex}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="px-3 py-1 text-[13px] font-medium bg-surface-soft text-ink/80 rounded-full border border-hairline hover:border-muted hover:text-ink transition-colors"
              >
                {tag}
              </button>
            ) : (
              <span
                key={tagIndex}
                className="px-3 py-1 text-[13px] font-medium bg-surface-soft text-ink/80 rounded-full border border-hairline"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
