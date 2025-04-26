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
    const { name, description, components, rent } = await req.json();

    const updatedRoomType = await RoomType.findByIdAndUpdate(
      roomTypeId,
      { name, description, components, rent },
      { new: true }
    ).populate('components');

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

    await RoomType.findByIdAndDelete(roomTypeId);

    return NextResponse.json({ message: "Room type deleted successfully" });
  } catch (error) {
    console.error("Error deleting room type:", error);
    return NextResponse.json(
      { error: "Failed to delete room type" },
      { status: 500 }
    );
  }
}