import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Resource from "@/models/Resource";
import { resourceSchema } from "@/validators/resource";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  console.log("Fetching resource with ID:", id);

  const resource = await Resource.findById(id);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  return NextResponse.json(resource);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await connectDB();

  const body = await req.json();
  const parsed = resourceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await Resource.findByIdAndUpdate(id, parsed.data, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  await Resource.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
