"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <div className="text-center">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-8">
            Edit Resource
          </h1>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
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

