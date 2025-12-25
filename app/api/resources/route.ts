import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Resource from "@/models/Resource";
import { resourceSchema } from "@/validators/resource";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 9);

  const skip = (page - 1) * limit;

  const searchQuery = q ? { $text: { $search: q } } : {};

  const [resources, total] = await Promise.all([
    Resource.find(searchQuery)
      .sort(q ? { score: { $meta: "textScore" } } : { title: 1 })
      .skip(skip)
      .limit(limit),
    Resource.countDocuments(searchQuery),
  ]);

  return NextResponse.json({
    data: resources,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: Request) {
  const user = await requireAuth(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await connectDB();

  const body = await req.json();

  const parsed = resourceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const resource = await Resource.create(parsed.data);

  return NextResponse.json(resource, { status: 201 });
}
