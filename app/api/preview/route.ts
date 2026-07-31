import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchOgImage, isSafePreviewUrl } from "@/lib/preview";

const getCachedOgImage = unstable_cache(
  async (url: string) => fetchOgImage(url),
  ["og-preview"],
  { revalidate: 60 * 60 * 24 }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ image: null });
  }

  if (!isSafePreviewUrl(url)) {
    return NextResponse.json({ image: null }, { status: 400 });
  }

  try {
    const image = await getCachedOgImage(url);
    return NextResponse.json(
      { image },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      }
    );
  } catch {
    return NextResponse.json({ image: null });
  }
}
