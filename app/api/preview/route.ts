// app/api/preview/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ image: null });

  try {
    const res = await fetch(url);
    const html = await res.text();
    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    const image = match ? match[1] : null;
    return NextResponse.json({ image });
  } catch (e) {
    return NextResponse.json({ image: null });
  }
}
