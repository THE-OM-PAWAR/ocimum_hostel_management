import { NextResponse } from "next/server";
import { RoomComponent } from "@/lib/mongoose/models/room-component.model";
import connectDB from "@/lib/mongodb/client";

export async function DELETE(
  req: Request,
  { params }: { params: { blockId: string; componentId: string } }
) {
  try {
    await connectDB();
    const { componentId } = params;

    await RoomComponent.findByIdAndDelete(componentId);

    return NextResponse.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { error: "Failed to delete component" },
      { status: 500 }
    );
  }
}