"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";

interface AppHeaderProps {
  showTagline?: boolean;
}

export default function AppHeader({ showTagline = true }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="min-h-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 sm:py-0">
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Asset Room"
            width={40}
            height={40}
            className="w-10 h-10 rounded-md"
            priority
          />
        </Link>
        <div className="min-w-0">
          <Link href="/">
            <h1 className="font-display text-[28px] leading-tight text-ink tracking-[-0.02em]">
              Asset Room
            </h1>
          </Link>
          {showTagline && (
            <p className="text-muted text-sm leading-snug truncate">
              Never lose a great resource again
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {user ? (
          <>
            <Link href="/add" className="btn-primary">
              Add Resource
            </Link>
            <button type="button" onClick={logout} className="btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
