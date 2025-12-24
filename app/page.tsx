"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuth } from "./contexts/AuthContext";
import ResourceCard from "./components/ResourceCard";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

export default function Home() {
  const { user, logout } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResources(resources);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = resources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(query))
      );
      setFilteredResources(filtered);
    }
  }, [searchQuery, resources]);

  const fetchResources = async () => {
    try {
      const resourcesRef = collection(db, "resources");
      const q = query(resourcesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const resourcesData: Resource[] = [];
      querySnapshot.forEach((doc) => {
        resourcesData.push({
          id: doc.id,
          ...doc.data(),
        } as Resource);
      });
      setResources(resourcesData);
      setFilteredResources(resourcesData);
    } catch (error) {
      console.error("Error fetching resources: ", error);
      // If ordering fails (e.g., index not created), fetch without order
      try {
        const querySnapshot = await getDocs(collection(db, "resources"));
        const resourcesData: Resource[] = [];
        querySnapshot.forEach((doc) => {
          resourcesData.push({
            id: doc.id,
            ...doc.data(),
          } as Resource);
        });
        setResources(resourcesData);
        setFilteredResources(resourcesData);
      } catch (fallbackError) {
        console.error("Error in fallback fetch: ", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
              Asset Room
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your personal design resource library
            </p>
          </div>
          <div className="flex gap-3">
            {user ? (
              <>
                <Link
                  href="/add"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
                >
                  Add Resource
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-black dark:text-zinc-50 font-medium rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or tags..."
            className="w-full max-w-md px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              {searchQuery ? "No resources found matching your search." : "No resources yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} showEdit={!!user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
