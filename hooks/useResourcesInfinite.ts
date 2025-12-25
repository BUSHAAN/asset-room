// hooks/useResourcesInfinite.ts

import { useState, useEffect } from "react";
import { Resource } from "@/types/resource.types";

export function useResourcesInfinite(searchQuery: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMore = async () => {
    if (loading || (!hasMore && resources.length !== 0)) return;
    console.log("fetchMore called");

    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        ...(searchQuery && { q: searchQuery }),
      });

      const res = await fetch(`/api/resources?${params}`);
      const json = await res.json();

      const newResources = json.data || [];

      setResources((prev) => [...prev, ...newResources]);
      setHasMore(page < json.pagination.totalPages);
      if(!hasMore) setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // reset when search changes
  useEffect(() => {
    setResources([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  // initial load
  useEffect(() => {
    fetchMore();
  }, [searchQuery]);

  return {
    resources,
    fetchMore,
    hasMore,
    loading,
  };
}
