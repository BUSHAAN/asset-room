const inflight = new Map<string, Promise<string | null>>();

export function fetchPreviewImage(url: string): Promise<string | null> {
  const existing = inflight.get(url);
  if (existing) return existing;

  const promise = fetch(`/api/preview?url=${encodeURIComponent(url)}`)
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      return (data.image as string | null) || null;
    })
    .catch(() => null)
    .finally(() => {
      inflight.delete(url);
    });

  inflight.set(url, promise);
  return promise;
}
