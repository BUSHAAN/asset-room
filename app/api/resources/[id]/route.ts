import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import Resource from "@/models/Resource";
import { resourceSchema } from "@/validators/resource";
import { requireAuth } from "@/lib/auth";
import { fetchOgImage } from "@/lib/preview";

function invalidIdResponse() {
  return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
}

function notFoundResponse() {
  return NextResponse.json({ error: "Resource not found" }, { status: 404 });
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return invalidIdResponse();
    }

    await connectDB();

    const resource = await Resource.findById(id);

    if (!resource) {
      return notFoundResponse();
    }

    return NextResponse.json(resource);
  } catch (err) {
    console.error("GET /api/resources/[id]:", err);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return invalidIdResponse();
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

    const existing = await Resource.findById(id);
    if (!existing) {
      return notFoundResponse();
    }

    const urlChanged = existing.url !== parsed.data.url;
    const previewImage = urlChanged
      ? await fetchOgImage(parsed.data.url)
      : existing.previewImage;

    const updated = await Resource.findByIdAndUpdate(
      id,
      {
        ...parsed.data,
        previewImage: previewImage ?? undefined,
      },
      { new: true }
    );

    if (!updated) {
      return notFoundResponse();
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/resources/[id]:", err);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return invalidIdResponse();
    }

    await connectDB();

    const deleted = await Resource.findByIdAndDelete(id);

    if (!deleted) {
      return notFoundResponse();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/resources/[id]:", err);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
