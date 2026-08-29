"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ResourceCard from "./components/ResourceCard";
import AppHeader from "./components/AppHeader";
import { useAuth } from "./contexts/AuthContext";
import { useResourcesInfinite } from "@/hooks/useResourcesInfinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderCircle, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

function HomeContent() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qFromUrl = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(qFromUrl);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const { resources, loading, hasMore, fetchMore, error, retry, total } =
    useResourcesInfinite(debouncedSearch);

  const isSearching = searchQuery !== debouncedSearch;
  const skipUrlToInput = useRef(false);

  useEffect(() => {
    if (skipUrlToInput.current) {
      skipUrlToInput.current = false;
      return;
    }
    setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    const current = (searchParams.get("q") || "").trim();
    if (trimmed === current) return;

    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    skipUrlToInput.current = true;
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleTagClick = useCallback((tag: string) => {
    setSearchQuery(tag);
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen app-atmosphere">
      <a
        href="#library"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-ink focus:ring-2 focus:ring-primary/50"
      >
        Skip to resources
      </a>
      <div className="max-w-600 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <AppHeader />

        <main id="library">
        <div className="flex flex-col gap-3 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or tags…"
              className="input-field w-full pr-12"
              aria-label="Search resources"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex size-10 items-center justify-center text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="text-sm text-muted min-h-5">
            {isSearching
              ? "Searching…"
              : error
                ? "\u00a0"
                : loading && resources.length === 0
                  ? "\u00a0"
                  : `${total} ${
                      debouncedSearch.trim()
                        ? total === 1
                          ? "result"
                          : "results"
                        : total === 1
                          ? "resource"
                          : "resources"
                    }`}
          </p>
        </div>

        {error && resources.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-muted">{error}</p>
            <button type="button" onClick={retry} className="btn-primary">
              Retry
            </button>
          </div>
        ) : loading && resources.length === 0 ? (
          <div className="text-center py-20">
            <LoaderCircle className="w-8 h-8 mx-auto mb-4 text-muted animate-spin" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">
              {debouncedSearch.trim()
                ? "No resources found matching your search."
                : "No resources yet."}
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="error-banner flex items-center justify-between gap-4">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={retry}
                  className="text-sm underline"
                >
                  Retry
                </button>
              </div>
            )}
            <InfiniteScroll
              dataLength={resources.length}
              next={fetchMore}
              hasMore={hasMore}
              hasChildren
              scrollThreshold="200px"
              loader={
                <div className="overflow-anchor-none flex h-20 items-center justify-center">
                  <p className="text-muted text-sm">Loading…</p>
                </div>
              }
              endMessage={
                <p className="overflow-anchor-none flex h-20 items-center justify-center text-muted text-sm">
                  You have reached the end
                </p>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-1">
                {resources.map((resource, index) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    showEdit={!!user}
                    index={index}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </>
        )}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen app-atmosphere flex items-center justify-center">
          <LoaderCircle className="w-8 h-8 text-muted animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
