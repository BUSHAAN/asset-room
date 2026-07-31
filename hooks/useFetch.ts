import { useAuth } from "@/app/contexts/AuthContext";

function messageFromBody(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;

  if (typeof record.error === "string" && record.error) {
    return record.error;
  }

  if (record.errors && typeof record.errors === "object") {
    const fieldErrors = record.errors as Record<string, string[] | undefined>;
    for (const messages of Object.values(fieldErrors)) {
      if (Array.isArray(messages) && messages[0]) {
        return messages[0];
      }
    }
  }

  return fallback;
}

const useFetch = () => {
  const { user } = useAuth();

  const customFetch = async (
    url: string,
    method: string,
    body?: unknown,
    signal?: AbortSignal
  ) => {
    const token = (await user?.getIdToken()) || "";

    const response = await fetch(url, {
      method,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      headers:
        body !== undefined
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          : { Authorization: `Bearer ${token}` },
    });

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const fallback =
        response.status === 401
          ? "Unauthorized"
          : response.status === 404
            ? "Resource not found"
            : "Request failed";
      throw new Error(messageFromBody(data, fallback));
    }

    return data;
  };

  return {
    customFetch,
  };
};

export default useFetch;
