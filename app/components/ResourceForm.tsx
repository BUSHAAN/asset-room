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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-2 text-[#171718]"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-5 py-3 border border-[#171718]/10 rounded-xl bg-white/50 backdrop-blur-sm text-[#171718] placeholder:text-[#171718]/40 focus:outline-none focus:ring-2 focus:ring-[#171718]/20 focus:border-[#171718]/20 transition-all duration-300"
          placeholder="Enter resource title"
        />
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium mb-2 text-[#171718]"
        >
          URL *
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full px-5 py-3 border border-[#171718]/10 rounded-xl bg-white/50 backdrop-blur-sm text-[#171718] placeholder:text-[#171718]/40 focus:outline-none focus:ring-2 focus:ring-[#171718]/20 focus:border-[#171718]/20 transition-all duration-300"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2 text-[#171718]"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-5 py-3 border border-[#171718]/10 rounded-xl bg-white/50 backdrop-blur-sm text-[#171718] placeholder:text-[#171718]/40 focus:outline-none focus:ring-2 focus:ring-[#171718]/20 focus:border-[#171718]/20 transition-all duration-300 resize-none"
          placeholder="Enter a short description"
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium mb-2 text-[#171718]"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-5 py-3 border border-[#171718]/10 rounded-xl bg-white/50 backdrop-blur-sm text-[#171718] placeholder:text-[#171718]/40 focus:outline-none focus:ring-2 focus:ring-[#171718]/20 focus:border-[#171718]/20 transition-all duration-300"
          placeholder="tag1, tag2, tag3 (comma separated)"
        />
        <p className="mt-2 text-xs text-[#171718]/50">
          Separate tags with commas
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 bg-[#171718] hover:bg-[#171718]/90 disabled:bg-[#171718]/50 text-[#ECE7E1] font-medium rounded-full transition-all duration-300 disabled:cursor-not-allowed hover:shadow-lg"
      >
        {isLoading ? "Saving..." : initialData ? "Update Resource" : "Add Resource"}
      </button>
    </form>
  );
}

