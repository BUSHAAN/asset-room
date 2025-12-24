"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ResourceForm from "@/app/components/ResourceForm";
import { useGetResource, useUpdateResource } from "@/hooks/useResourceMutations";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { resource, loading, error: fetchError } = useGetResource(id);
  const { updateResource, isLoading, error: updateError } = useUpdateResource();

  const handleSubmit = async (data: {
    title: string;
    url: string;
    description: string;
    tags: string[];
  }) => {
    try {
      await updateResource(id, data);
    } catch (err) {
      // Error is handled by the hook, but we can show a user-friendly message
      alert("Failed to update resource. Please try again.");
    }
  };

  // Redirect if resource not found
  if (!loading && !resource) {
    router.push("/");
    return null;
  }

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
              <Link href="/" className="inline-flex items-center gap-2 text-[#171718]/70 hover:text-[#171718] mb-8 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                {initialData && (
                  <ResourceForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

