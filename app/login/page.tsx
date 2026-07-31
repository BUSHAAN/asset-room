"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import LoginForm from "@/app/components/LoginForm";
import { LoaderCircle } from "lucide-react";

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
      <div className="flex min-h-screen items-center justify-center app-atmosphere">
        <LoaderCircle className="w-8 h-8 text-muted animate-spin" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center app-atmosphere py-8 px-4">
      <div className="w-full max-w-md flex flex-col gap-8">
        <Link href="/" className="flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="Asset Room"
            width={48}
            height={48}
            className="w-12 h-12 rounded-md"
            priority
          />
          <span className="font-display text-[28px] tracking-[-0.02em] text-ink">
            Asset Room
          </span>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
