"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { LogOut, Menu, Plus, X } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

interface AppHeaderProps {
  showTagline?: boolean;
}

export default function AppHeader({ showTagline = true }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [user]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

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

      <div className="flex items-center justify-end shrink-0">
        {user ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline bg-surface text-ink hover:border-muted hover:bg-surface-soft transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {menuOpen && (
              <nav
                id={menuId}
                aria-label="Account"
                className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-lg border border-hairline bg-surface p-1.5 shadow-xl"
              >
                <Link
                  href="/add"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-ink hover:bg-surface-soft transition-colors"
                >
                  <Plus className="w-4 h-4 text-muted" />
                  Add Resource
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-ink hover:bg-surface-soft transition-colors"
                >
                  <LogOut className="w-4 h-4 text-muted" />
                  Logout
                </button>
              </nav>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
