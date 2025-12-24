"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ResourceForm from "@/app/components/ResourceForm";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<{
    title: string;
    url: string;
    description: string;
    tags: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const docRef = doc(db, "resources", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setInitialData({
          title: data.title,
          url: data.url,
          description: data.description,
          tags: data.tags || [],
        });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching resource: ", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    title: string;
    url: string;
    description: string;
    tags: string[];
  }) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "resources", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      router.push("/");
    } catch (error) {
      console.error("Error updating resource: ", error);
      alert("Failed to update resource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-[#ECE7E1]">
          <div className="text-center">
            <p className="text-lg text-[#171718]/60">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#ECE7E1] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
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
            {initialData && (
              <ResourceForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

