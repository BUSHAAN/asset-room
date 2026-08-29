import { useState, useEffect, useCallback, useRef } from "react";
import { Resource } from "@/types/resource.types";

export function useResourcesInfinite(searchQuery: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (pageToFetch: number, replace = false) => {
      if (!replace && loadingRef.current) return;

      if (replace) {
        abortRef.current?.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;
      const requestId = ++requestIdRef.current;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const trimmed = searchQuery.trim();
        const params = new URLSearchParams({
          page: pageToFetch.toString(),
          limit: "12",
          ...(trimmed && { q: trimmed }),
        });

        const res = await fetch(`/api/resources?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to load resources");
        }

        const json = await res.json();

        if (requestId !== requestIdRef.current) return;

        const newResources: Resource[] = json.data || [];
        const totalCount = json.pagination?.total ?? 0;
        const totalPages = json.pagination?.totalPages ?? 0;

        setResources((prev) =>
          replace ? newResources : [...prev, ...newResources]
        );
        setTotal(totalCount);
        setHasMore(pageToFetch < totalPages);
        pageRef.current = pageToFetch + 1;
        setPage(pageToFetch + 1);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (requestId !== requestIdRef.current) return;
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load resources"
        );
        if (replace) {
          setResources([]);
          setHasMore(false);
          setTotal(0);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    setResources([]);
    setHasMore(true);
    setPage(1);
    pageRef.current = 1;
    setTotal(0);
    fetchPage(1, true);

    return () => {
      abortRef.current?.abort();
    };
  }, [searchQuery, fetchPage]);

  const fetchMore = useCallback(() => {
    if (!hasMore || loadingRef.current) return;
    fetchPage(pageRef.current);
  }, [hasMore, fetchPage]);

  const retry = useCallback(() => {
    setResources([]);
    setHasMore(true);
    setPage(1);
    pageRef.current = 1;
    fetchPage(1, true);
  }, [fetchPage]);

  return {
    resources,
    fetchMore,
    hasMore,
    loading,
    error,
    retry,
    total,
  };
}
