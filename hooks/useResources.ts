"use client";

import { useState, useEffect } from "react";
import { getResources, type Resource } from "@/services/resources.service";

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResources();
      setResources(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch resources");
      setError(error);
      console.error("Error fetching resources: ", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    resources,
    loading,
    error,
    refetch: fetchResources,
  };
}

