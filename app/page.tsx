"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./contexts/AuthContext";
import ResourceCard from "./components/ResourceCard";
import Link from "next/link";
import Image from "next/image";
import { useResourcesInfinite } from "@/hooks/useResourcesInfinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const { resources, loading, hasMore, fetchMore } =
    useResourcesInfinite(debouncedSearch);

  return (
    <div className="min-h-screen bg-[#ECE7E1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Asset Room Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-md"
                priority
              />
            </Link>
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#171718] mb-1">
                Asset Room
              </h1>
              <p className="text-[#171718]/70 text-sm">
                Never Lose a great resource again!
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {user && (
              <>
                <Link
                  href="/add"
                  className="px-6 py-2.5 bg-[#171718] hover:bg-[#171718]/90 text-[#ECE7E1] font-medium rounded-full transition-all duration-300 hover:shadow-lg text-sm"
                >
                  Add Resource
                </Link>
                <button
                  onClick={logout}
                  className="px-6 py-2.5 bg-transparent border border-[#171718]/20 hover:border-[#171718]/40 text-[#171718] font-medium rounded-full transition-all duration-300 text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or tags..."
            className="w-full max-w-md px-5 py-3 border border-[#171718]/10 rounded-full bg-white/50 backdrop-blur-sm text-[#171718] placeholder:text-[#171718]/40 focus:outline-none focus:ring-2 focus:ring-[#171718]/20 focus:border-[#171718]/20 transition-all duration-300"
          />
        </div>

        {/* Resources Grid */}
        {loading && resources.length === 0 ? (
          <div className="text-center py-20">
            <LoaderCircle className="w-8 h-8 mx-auto mb-4 text-[#171718]/60 animate-spin" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#171718]/60">
              {searchQuery
                ? "No resources found matching your search."
                : "No resources yet."}
            </p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={resources.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={
              <p className="text-center py-8 text-[#171718]/60">Loading...</p>
            }
            endMessage={
              <p className="text-center py-12 text-[#171718]/60">
                You have reached the end
              </p>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  showEdit={!!user}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

{
  /* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                showEdit={!!user}
                ref={index === resources.length - 1 ? lastResourceRef : null}
              />
            ))}
          </div> */
}
