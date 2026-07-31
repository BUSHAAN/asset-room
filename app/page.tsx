"use client";

import { useState } from "react";
import ResourceCard from "./components/ResourceCard";
import AppHeader from "./components/AppHeader";
import { useAuth } from "./contexts/AuthContext";
import { useResourcesInfinite } from "@/hooks/useResourcesInfinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const { resources, loading, hasMore, fetchMore } =
    useResourcesInfinite(debouncedSearch);

  return (
    <div className="min-h-screen app-atmosphere">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <AppHeader />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or tags..."
          className="input-field max-w-md"
          aria-label="Search resources"
        />

        {loading && resources.length === 0 ? (
          <div className="text-center py-20">
            <LoaderCircle className="w-8 h-8 mx-auto mb-4 text-muted animate-spin" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">
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
              <p className="text-center py-8 text-muted text-sm">Loading...</p>
            }
            endMessage={
              <p className="text-center py-12 text-muted text-sm">
                You have reached the end
              </p>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
              {resources.map((resource, index) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  showEdit={!!user}
                  index={index}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
