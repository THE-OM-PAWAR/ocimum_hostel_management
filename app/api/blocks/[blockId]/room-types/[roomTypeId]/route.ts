import { NextResponse } from "next/server";
import { RoomType } from "@/lib/mongoose/models/room-type.model";
import connectDB from "@/lib/mongodb/client";

export async function PUT(
  req: Request,
  { params }: { params: { blockId: string; roomTypeId: string } }
) {
  try {
    await connectDB();
    const { roomTypeId } = params;
    const { name, description, components, rent, images } = await req.json();

    // Filter out any null or invalid component IDs
    const validComponents = components.filter((id : string) => id && typeof id === 'string');

    if (validComponents.length === 0) {
      return NextResponse.json(
        { error: "At least one valid component is required" },
        { status: 400 }
      );
    }

    const updatedRoomType = await RoomType.findByIdAndUpdate(
      roomTypeId,
      { 
        name, 
        description, 
        components: validComponents,
        rent,
        images: images || []
      },
      { new: true }
    ).populate('components');

    if (!updatedRoomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRoomType);
  } catch (error) {
    console.error("Error updating room type:", error);
    return NextResponse.json(
      { error: "Failed to update room type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { blockId: string; roomTypeId: string } }
) {
  try {
    await connectDB();
    const { roomTypeId } = params;

    const deletedRoomType = await RoomType.findByIdAndDelete(roomTypeId);

    if (!deletedRoomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Room type deleted successfully" });
  } catch (error) {
    console.error("Error deleting room type:", error);
    return NextResponse.json(
      { error: "Failed to delete room type" },
      { status: 500 }
    );
  }
}