import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, description, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user and verify they have admin role
    const user = await User.findOne({ userId }).populate('organisation');
    if (!user || !user.organisation) {
      return NextResponse.json(
        { error: "User not found or not associated with a organisation" },
        { status: 404 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: "Insufficient permissions. Only admins can create hostels." },
        { status: 403 }
      );
    }

    const hostel = await Hostel.create({
      name,
      description,
      organisation: user.organisation,
    });

    // Automatically add the hostel to admin's assignedHostels array
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { assignedHostels: hostel._id }
    });

    
    // Create basic room components automatically
    const { RoomComponent } = await import("@/lib/mongoose/models/room-component.model");
    const basicComponents = [
      { name: "Bed", description: "Single/double bed with mattress" },
      { name: "Study Table", description: "Wooden study table with drawers" },
      { name: "Chair", description: "Comfortable study chair" },
      { name: "Almirah/Wardrobe", description: "Storage wardrobe for clothes" },
      { name: "Ceiling Fan", description: "Electric ceiling fan" },
      { name: "Tube Light", description: "LED tube light for room lighting" },
      { name: "Dustbin", description: "Small waste bin for room" },
      { name: "Mirror", description: "Wall-mounted mirror" },
      { name: "Window Curtains", description: "Privacy curtains for windows" },
      { name: "Mattress", description: "Comfortable sleeping mattress" },
      { name: "Pillow", description: "Sleeping pillow with cover" },
      { name: "Blanket", description: "Warm blanket for sleeping" },
      { name: "Study Lamp", description: "Table lamp for reading" },
      { name: "Bookshelf", description: "Small shelf for books and items" },
    ];

    const createdComponents = await Promise.all(
      basicComponents.map(component  =>
        RoomComponent.create({
          ...component,
          hostelId: (hostel._id as mongoose.Types.ObjectId).toString(),
        })
      )
    );

    return NextResponse.json({ hostel, componentsCreated: createdComponents.length });
  } catch (error) {
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { error: "Failed to create hostel" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user with their organisation and assigned hostels
    const user = await User.findOne({ userId }).populate('organisation assignedHostels');
    if (!user || !user.organisation) {
      return NextResponse.json(
        { error: "User not found or not associated with a organisation" },
        { status: 404 }
      );
    }

    let hostels;
    if (user.role === 'admin') {
      // Admin can see all hostels in their organisation
      hostels = await Hostel.find({ organisation: user.organisation }).sort({ createdAt: -1 });
    } else {
      // Other roles can only see their assigned hostels
      hostels = await Hostel.find({ 
        _id: { $in: user.assignedHostels },
        organisation: user.organisation 
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json(hostels);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostels" },
      { status: 500 }
    );
  }
}