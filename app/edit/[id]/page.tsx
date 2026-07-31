"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ResourceForm from "@/app/components/ResourceForm";
import AppHeader from "@/app/components/AppHeader";
import useFetch from "@/hooks/useFetch";
import { Resource } from "@/types/resource.types";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [updateError, setUpdateError] = useState<Error | null>(null);
  const loading = isLoading && !resource;
  const { customFetch } = useFetch();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setIsFetching(true);
        const data = await customFetch(`/api/resources/${id}`, "GET");
        setResource(data);
      } catch (err) {
        console.error("Failed to fetch resource:", err);
        setFetchError(err as Error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleSubmit = async (data: {
    title: string;
    url: string;
    description: string;
    tags: string[];
  }) => {
    try {
      setIsLoading(true);
      await customFetch(`/api/resources/${id}`, "PUT", data);
      router.push(`/`);
    } catch (err) {
      alert("Failed to update resource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initialData = resource
    ? {
        title: resource.title,
        url: resource.url,
        description: resource.description,
        tags: resource.tags || [],
      }
    : null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen app-atmosphere">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AppHeader showTagline={false} />

          <div className="max-w-2xl mx-auto mt-10">
            {loading ? (
              <div className="text-center py-20">
                <LoaderCircle className="w-8 h-8 mx-auto text-muted animate-spin" />
              </div>
            ) : (
              <>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-muted hover:text-ink mb-8 transition-colors text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to home
                </Link>

                <h1 className="font-display text-4xl tracking-[-0.02em] text-ink mb-8">
                  Edit Resource
                </h1>

                <div className="bg-surface rounded-lg border border-hairline p-8">
                  {(fetchError || updateError) && (
                    <div className="mb-4 error-banner">
                      {fetchError?.message || updateError?.message}
                    </div>
                  )}
                  {isFetching ? (
                    <div className="text-center py-10">
                      <LoaderCircle className="w-8 h-8 mx-auto text-muted animate-spin" />
                    </div>
                  ) : (
                    initialData && (
                      <ResourceForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                      />
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
