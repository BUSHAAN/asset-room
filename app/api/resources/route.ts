import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Resource, { TITLE_COLLATION } from "@/models/Resource";
import { resourceSchema } from "@/validators/resource";
import { requireAuth } from "@/lib/auth";
import { fetchOgImage } from "@/lib/preview";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const q = (searchParams.get("q") || "").trim();
    const rawPage = Number(searchParams.get("page") || 1);
    const rawLimit = Number(searchParams.get("limit") || 9);

    const page =
      Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(Math.floor(rawLimit), 1), 50)
      : 9;

    const skip = (page - 1) * limit;

    if (q) {
      // Substring match (typeahead): $text is token-based and won't match
      // prefixes like "colo" → "color". Escape regex metacharacters.
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const filter = {
        $or: [
          { title: { $regex: escaped, $options: "i" } },
          { description: { $regex: escaped, $options: "i" } },
          { tags: { $regex: escaped, $options: "i" } },
        ],
      };

      const [resources, total] = await Promise.all([
        Resource.find(filter)
          .collation(TITLE_COLLATION)
          .sort({ title: 1 })
          .skip(skip)
          .limit(limit),
        Resource.countDocuments(filter),
      ]);

      return NextResponse.json({
        data: resources,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 0,
        },
      });
    }

    const [resources, total] = await Promise.all([
      Resource.find({})
        .collation(TITLE_COLLATION)
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit),
      Resource.countDocuments({}),
    ]);

    return NextResponse.json({
      data: resources,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 0,
      },
    });
  } catch (err) {
    console.error("GET /api/resources:", err);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    const previewImage = await fetchOgImage(parsed.data.url);

    const resource = await Resource.create({
      ...parsed.data,
      previewImage: previewImage ?? undefined,
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (err) {
    console.error("POST /api/resources:", err);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
