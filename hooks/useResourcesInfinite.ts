// hooks/useResourcesInfinite.ts

import { Resource } from "@/types/resource.types";
import { useState, useEffect, useCallback } from "react";

export function useResourcesInfinite(searchQuery: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchResources = useCallback(
    async (pageNum: number, append = false) => {
      if (!hasMore && pageNum > 1) return;

      const isFirst = pageNum === 1;
      isFirst ? setLoading(true) : setLoadingMore(true);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "9",
          ...(searchQuery && { q: searchQuery }),
        });

        const res = await fetch(`/api/resources?${params}`);
        const json = await res.json();

        const newResources = json.data || [];

        setResources((prev) =>
          append ? [...prev, ...newResources] : newResources
        );
        setHasMore(pageNum < json.pagination.totalPages);
        setPage(pageNum + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, hasMore]
  );

  // Reset when search changes
  useEffect(() => {
    setResources([]);
    setPage(1);
    setHasMore(true);
    fetchResources(1, false);
  }, [searchQuery, fetchResources]);

  // Initial load
  useEffect(() => {
    if (resources.length === 0 && !loading) {
      fetchResources(1);
    }
  }, []);

  return {
    resources,
    loading,
    loadingMore,
    hasMore,
    fetchMore: () => fetchResources(page, true),
  };
}