const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^0\.0\.0\.0$/,
  /^\[::1\]$/,
  /^::1$/,
  /^metadata\.google\.internal$/i,
];

const MAX_HTML_BYTES = 1_000_000;
const FETCH_TIMEOUT_MS = 8_000;

function isPrivateHostname(hostname: string): boolean {
  return PRIVATE_HOST_PATTERNS.some((re) => re.test(hostname));
}

export function isSafePreviewUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    if (isPrivateHostname(parsed.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchOgImage(url: string): Promise<string | null> {
  if (!isSafePreviewUrl(url)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/html",
        "User-Agent": "AssetRoomPreviewBot/1.0",
      },
      redirect: "follow",
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return null;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      const html = await res.text();
      return extractOgImage(html.slice(0, MAX_HTML_BYTES), url);
    }

    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      total += value.length;
      if (total >= MAX_HTML_BYTES) break;
    }
    reader.cancel().catch(() => {});

    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      const slice = chunk.subarray(0, Math.min(chunk.length, total - offset));
      merged.set(slice, offset);
      offset += slice.length;
    }

    const html = new TextDecoder().decode(merged);
    return extractOgImage(html, url);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractOgImage(html: string, pageUrl: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      try {
        return new URL(match[1], pageUrl).href;
      } catch {
        return match[1];
      }
    }
  }

  return null;
}
