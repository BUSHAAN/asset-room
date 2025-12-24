"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addResource, updateResource, deleteResource, getResource, type ResourceInput, type Resource } from "@/services/resources.service";

export function useAddResource() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const mutate = async (data: ResourceInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await addResource(data);
      router.push("/");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to add resource");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addResource: mutate,
    isLoading,
    error,
  };
}

export function useUpdateResource() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const mutate = async (id: string, data: ResourceInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateResource(id, data);
      router.push("/");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update resource");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateResource: mutate,
    isLoading,
    error,
  };
}

export function useDeleteResource() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteResource(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete resource");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteResource: mutate,
    isLoading,
    error,
  };
}

export function useGetResource(id: string) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getResource(id);
        setResource(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to fetch resource");
        setError(error);
        console.error("Error fetching resource: ", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  return {
    resource,
    loading,
    error,
  };
}

