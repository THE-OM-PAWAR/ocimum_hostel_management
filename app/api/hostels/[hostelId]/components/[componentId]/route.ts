import { NextResponse } from "next/server";
import { RoomComponent } from "@/lib/mongoose/models/room-component.model";
import connectDB from "@/lib/mongodb/client";

export async function PUT(
  req: Request,
  { params }: { params: { hostelId: string; componentId: string } }
) {
  try {
    await connectDB();
    const { name, description } = await req.json();
    const { componentId } = params;

    const updatedComponent = await RoomComponent.findByIdAndUpdate(
      componentId,
      { name, description },
      { new: true }
    );

    if (!updatedComponent) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedComponent);
  } catch (error) {
    console.error("Error updating component:", error);
    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { hostelId: string; componentId: string } }
) {
  try {
    await connectDB();
    const { componentId } = params;

    const deletedComponent = await RoomComponent.findByIdAndDelete(componentId);

    if (!deletedComponent) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { error: "Failed to delete component" },
      { status: 500 }
    );
  }
}