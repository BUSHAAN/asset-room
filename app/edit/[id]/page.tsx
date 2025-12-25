"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ResourceForm from "@/app/components/ResourceForm";
import useFetch from "@/hooks/useFetch";
import { Resource } from "@/types/resource.types";
import { useEffect, useState } from "react";

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
      // Error is handled by the hook, but we can show a user-friendly message
      alert("Failed to update resource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // // Redirect if resource not found
  // if (!loading && !resource) {
  //   router.push("/");
  //   return null;
  // }

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
      <div className="min-h-screen bg-[#ECE7E1] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-lg text-[#171718]/60">Loading...</p>
            </div>
          ) : (
            <>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#171718]/70 hover:text-[#171718] mb-8 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
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
              <h1 className="text-4xl font-serif font-bold text-[#171718] mb-8">
                Edit Resource
              </h1>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#171718]/5 p-8 shadow-xl">
                {(fetchError || updateError) && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {fetchError?.message || updateError?.message}
                  </div>
                )}
                {isFetching ? (
                  <div className="text-center py-10">
                    <p className="text-lg text-[#171718]/60">Loading...</p>
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
    </ProtectedRoute>
  );
}
