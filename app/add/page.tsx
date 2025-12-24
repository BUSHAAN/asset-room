"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
      <div className="min-h-screen bg-[#ECE7E1] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[#171718]/70 hover:text-[#171718] mb-8 transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-4xl font-serif font-bold text-[#171718] mb-8">
            Add New Resource
          </h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#171718]/5 p-8 shadow-xl">
            <ResourceForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

