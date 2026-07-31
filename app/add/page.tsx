"use client";

import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ResourceForm from "@/app/components/ResourceForm";
import AppHeader from "@/app/components/AppHeader";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";

export default function AddPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { customFetch } = useFetch();
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (data: {
    title: string;
    url: string;
    description: string;
    tags: string[];
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      await customFetch("/api/resources", "POST", data);
      window.location.href = "/";
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to add resource. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen app-atmosphere">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AppHeader showTagline={false} />

          <div className="max-w-2xl mx-auto mt-10">
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
              Add New Resource
            </h1>

            <div className="bg-surface rounded-lg border border-hairline p-8">
              {error && (
                <div className="mb-4 error-banner">{error.message}</div>
              )}
              <ResourceForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
