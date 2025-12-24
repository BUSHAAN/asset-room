"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ResourceForm from "@/app/components/ResourceForm";

export default function AddPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    url: string;
    description: string;
    tags: string[];
  }) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "resources"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/");
    } catch (error) {
      console.error("Error adding resource: ", error);
      alert("Failed to add resource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-8">
            Add New Resource
          </h1>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <ResourceForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

