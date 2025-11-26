import { NextResponse } from "next/server";
import { RoomType } from "@/lib/mongoose/models/room-type.model";
import { RoomComponent } from "@/lib/mongoose/models/room-component.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();
    const { name, description, components, rent, images } = await req.json();
    console.log("Received data:", { name, description, components, rent, images });
    const { hostelId } = params;

    if (!name || !description || !components || rent === undefined || !hostelId) {
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
      hostelId,
      images: images || [],
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
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();
    const { hostelId } = params;

    // First, ensure RoomComponent model is registered
    await import("@/lib/mongoose/models/room-component.model");

    const roomTypes = await RoomType.find({ hostelId })
      .populate('components')
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects
      
    return NextResponse.json(roomTypes);
  } catch (error) {
    console.error("Error fetching room types:", error);
    return NextResponse.json(
      { error: "Failed to fetch room types" },
      { status: 500 }
    );
  }
}