import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("assetroom");

  const collections = await db.collections();

  return NextResponse.json({
    connected: true,
    collections: collections.map(c => c.collectionName),
  });
}
