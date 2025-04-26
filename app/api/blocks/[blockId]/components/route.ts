import { NextResponse } from "next/server";
import { RoomComponent } from "@/lib/mongoose/models/room-component.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();
    const { name, description } = await req.json();
    const { blockId } = params;

    if (!name || !description || !blockId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const component = await RoomComponent.create({
      name,
      description,
      blockId,
    });

    return NextResponse.json(component);
  } catch (error) {
    console.error("Error creating component:", error);
    return NextResponse.json(
      { error: "Failed to create component" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();
    const { blockId } = params;

    const components = await RoomComponent.find({ blockId }).sort({ createdAt: -1 });
    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}