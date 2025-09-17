import { NextResponse } from "next/server";
import { Block } from "@/lib/mongoose/models/block.model";
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
    const user = await User.findOne({ userId }).populate('hostel');
    if (!user || !user.hostel) {
      return NextResponse.json(
        { error: "User not found or not associated with a hostel" },
        { status: 404 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: "Insufficient permissions. Only admins can create blocks." },
        { status: 403 }
      );
    }

    const block = await Block.create({
      name,
      description,
      hostel: user.hostel,
      rentGenerationDay: "1", // Default, but will use individual tenant join dates
    });

    // Automatically add the block to admin's assignedBlocks array
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { assignedBlocks: block._id }
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
          blockId: (block._id as mongoose.Types.ObjectId).toString(),
        })
      )
    );

    return NextResponse.json({ block, componentsCreated: createdComponents.length });
  } catch (error) {
    console.error("Error creating block:", error);
    return NextResponse.json(
      { error: "Failed to create block" },
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

    // Get user with their hostel and assigned blocks
    const user = await User.findOne({ userId }).populate('hostel assignedBlocks');
    if (!user || !user.hostel) {
      return NextResponse.json(
        { error: "User not found or not associated with a hostel" },
        { status: 404 }
      );
    }

    let blocks;
    if (user.role === 'admin') {
      // Admin can see all blocks in their hostel
      blocks = await Block.find({ hostel: user.hostel }).sort({ createdAt: -1 });
    } else {
      // Other roles can only see their assigned blocks
      blocks = await Block.find({ 
        _id: { $in: user.assignedBlocks },
        hostel: user.hostel 
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocks" },
      { status: 500 }
    );
  }
}