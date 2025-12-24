"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ECE7E1]">
        <div className="text-center">
          <p className="text-lg text-[#171718]/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ECE7E1] py-8 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Image
            src="/full_logo.png"
            alt="Asset Room Logo"
            width={200}
            height={60}
            className="mx-auto mb-4"
            priority
          />
          <p className="text-[#171718]/70">
            Login to add or edit resources
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

