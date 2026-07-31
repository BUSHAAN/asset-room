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

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

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
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-ink">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input-field"
          placeholder="Enter resource title"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-2 text-ink">
          URL *
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="input-field"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2 text-ink"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="input-field"
          placeholder="Enter a short description"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2 text-ink">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="input-field"
          placeholder="tag1, tag2, tag3 (comma separated)"
        />
        <p className="mt-2 text-xs text-muted">Separate tags with commas</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button type="submit" disabled={isLoading} className="btn-primary w-full">
        {isLoading
          ? "Saving..."
          : initialData
            ? "Update Resource"
            : "Add Resource"}
      </button>
    </form>
  );
}
