import { NextResponse } from "next/server";
import { Block } from "@/lib/mongoose/models/block.model";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";

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
    });

    // Automatically add the block to admin's assignedBlocks array
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { assignedBlocks: block._id }
    });

    return NextResponse.json(block);
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