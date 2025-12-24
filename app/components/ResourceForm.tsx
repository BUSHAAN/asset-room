"use client";

import { useState, useEffect } from "react";

interface Resource {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

interface ResourceFormProps {
  initialData?: Resource;
  onSubmit: (data: Resource) => Promise<void>;
  isLoading?: boolean;
}

export default function ResourceForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ResourceFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setDescription(initialData.description);
      setTagsInput(initialData.tags.join(", "));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    // Parse tags
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    await onSubmit({
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter resource title"
        />
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          URL *
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Enter a short description"
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="tag1, tag2, tag3 (comma separated)"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Separate tags with commas
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : initialData ? "Update Resource" : "Add Resource"}
      </button>
    </form>
  );
}

