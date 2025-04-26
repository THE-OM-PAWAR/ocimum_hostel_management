import { NextResponse } from "next/server";
import { RoomType } from "@/lib/mongoose/models/room-type.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();
    const { name, description, components, rent } = await req.json();
    console.log("Received data:", { name, description, components, rent });
    const { blockId } = params;

    if (!name || !description || !components || !rent || !blockId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Filter out any null or invalid component IDs
    const validComponents = components.filter((id: string) => id && typeof id === 'string');

    if (validComponents.length === 0) {
      return NextResponse.json(
        { error: "At least one valid component is required" },
        { status: 400 }
      );
    }

    const roomType = await RoomType.create({
      name,
      description,
      components: validComponents,
      rent,
      blockId,
    });

    const populatedRoomType = await RoomType.findById(roomType._id).populate('components');

    return NextResponse.json(populatedRoomType);
  } catch (error) {
    console.error("Error creating room type:", error);
    return NextResponse.json(
      { error: "Failed to create room type" },
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

    const roomTypes = await RoomType.find({ blockId })
      .populate('components')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(roomTypes);
  } catch (error) {
    console.error("Error fetching room types:", error);
    return NextResponse.json(
      { error: "Failed to fetch room types" },
      { status: 500 }
    );
  }
}