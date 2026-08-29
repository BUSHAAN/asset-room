function titleSeed(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const SPOTS = [
  "ellipse 80% 70% at 18% 22%",
  "ellipse 75% 75% at 78% 16%",
  "ellipse 80% 70% at 84% 78%",
  "ellipse 80% 75% at 16% 84%",
] as const;

const TINTS = [
  "rgba(204, 120, 92, 0.34)",
  "rgba(232, 165, 90, 0.26)",
  "rgba(196, 98, 86, 0.28)",
  "rgba(250, 249, 245, 0.10)",
] as const;

interface ResourceFallbackCoverProps {
  title: string;
  tag?: string;
}

export default function ResourceFallbackCover({
  title,
  tag,
}: ResourceFallbackCoverProps) {
  const seed = titleSeed(title);
  const initial = title.charAt(0).toUpperCase();

  return (
    <div
      aria-hidden="true"
      className="resource-fallback relative h-full w-full overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(${SPOTS[seed % SPOTS.length]}, ${TINTS[seed % TINTS.length]}, transparent 58%), linear-gradient(165deg, #2a2723 0%, #161513 72%)`,
      }}
    >
      <span className="font-display pointer-events-none absolute left-[58%] top-[42%] -translate-x-1/2 -translate-y-1/2 select-none text-[6.75rem] leading-none text-ink/15">
        {initial}
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#161513] via-[#161513]/75 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-3.5">
        {tag ? (
          <p className="mb-1 max-w-[90%] truncate text-xs font-medium uppercase tracking-[0.14em] text-primary">
            {tag}
          </p>
        ) : null}
        <span className="mb-1.5 block h-px w-6 bg-primary/80" />
        <p className="font-display line-clamp-2 text-[1.35rem] leading-[1.1] tracking-[-0.02em] text-ink text-pretty">
          {title}
        </p>
      </div>
    </div>
  );
}
