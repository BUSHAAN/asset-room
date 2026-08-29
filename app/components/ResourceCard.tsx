"use client";

import { Resource } from "@/types/resource.types";
import { fetchPreviewImage } from "@/lib/preview-client";
import ResourceFallbackCover from "./ResourceFallbackCover";
import { LoaderCircle, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

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
  const titleId = useId();
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

  const isFirstPage = index < 12;
  const staggerDelay = isFirstPage ? Math.min(index, 8) * 40 : 0;
  const displayTitle =
    resource.title.charAt(0).toUpperCase() + resource.title.slice(1);

  return (
    <article
      ref={ref}
      style={isFirstPage ? { animationDelay: `${staggerDelay}ms` } : undefined}
      className={`${isFirstPage ? "animate-fade-up" : "overflow-anchor-none"} relative p-4 pb-3 bg-surface rounded-lg border border-hairline touch-manipulation transition-[border-color,background-color] duration-200 hover:border-muted hover:bg-[#2a2825]`}
    >
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-[1] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        aria-labelledby={titleId}
      />

      <div className="w-full aspect-16/10 rounded-md mb-3 bg-surface-soft overflow-hidden">
        {imageState === "loading" && (
          <div className="w-full h-full animate-shimmer flex items-center justify-center">
            <LoaderCircle className="w-5 h-5 text-muted animate-spin" />
          </div>
        )}
        {imageState === "loaded" && image && (
          <img
            src={image}
            alt=""
            width={640}
            height={400}
            loading={index < 4 ? "eager" : "lazy"}
            className="w-full h-full object-cover"
            onError={() => setImageState("error")}
          />
        )}
        {imageState === "error" && (
          <ResourceFallbackCover
            title={displayTitle}
            tag={resource.tags[0]}
          />
        )}
      </div>

      <div className="relative z-[2] flex items-start gap-2">
        <h3
          id={titleId}
          className="font-display min-w-0 flex-1 text-lg leading-snug tracking-[-0.01em] text-ink text-pretty pointer-events-none"
        >
          {displayTitle}
        </h3>
        {showEdit && (
          <Link
            href={`/edit/${resource._id}`}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface-soft text-muted hover:border-muted hover:text-ink transition-[border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={`Edit ${displayTitle}`}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
      <p className="text-sm text-muted mt-1 mb-2 line-clamp-2 leading-relaxed pointer-events-none">
        {resource.description}
      </p>
      {resource.tags.length > 0 && (
        <div className="relative z-[2] flex flex-wrap gap-1.5">
          {resource.tags.map((tag, tagIndex) =>
            onTagClick ? (
              <button
                key={tagIndex}
                type="button"
                onClick={() => onTagClick(tag)}
                className="max-w-full truncate px-3 min-h-8 text-[13px] font-medium bg-surface-soft text-ink/80 rounded-full border border-hairline hover:border-muted hover:text-ink transition-[border-color,color] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {tag}
              </button>
            ) : (
              <span
                key={tagIndex}
                className="max-w-full truncate px-3 min-h-8 inline-flex items-center text-[13px] font-medium bg-surface-soft text-ink/80 rounded-full border border-hairline"
              >
                {tag}
              </span>
            )
          )}
        </div>
      )}
    </article>
  );
}
