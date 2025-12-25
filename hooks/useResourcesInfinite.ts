import { useState, useEffect, useCallback } from "react";
import { Resource } from "@/types/resource.types";

export function useResourcesInfinite(searchQuery: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(
    async (pageToFetch: number, replace = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageToFetch.toString(),
          limit: "9",
          ...(searchQuery && { q: searchQuery }),
        });

        const res = await fetch(`/api/resources?${params}`);
        const json = await res.json();

        const newResources = json.data || [];

        setResources(prev =>
          replace ? newResources : [...prev, ...newResources]
        );

        setHasMore(pageToFetch < json.pagination.totalPages);
        setPage(pageToFetch + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, loading]
  );

  // reset + first page on search change
  useEffect(() => {
    setResources([]);
    setHasMore(true);
    setPage(1);
    fetchPage(1, true);
  }, [searchQuery]);

  const fetchMore = () => {
    if (!hasMore || loading) return;
    fetchPage(page);
  };

  return {
    resources,
    fetchMore,
    hasMore,
    loading,
  };
}
