import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { hostelName, ownerName, phoneNumber, userId, email } = await req.json();
    
    if (!userId || !hostelName || !email || !ownerName || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Check if user already exists and is onboarded
    const existingUser = await User.findOne({ userId });
    if (existingUser && existingUser.isOnboarded) {
      return NextResponse.json(
        { error: "User is already onboarded" },
        { status: 400 }
      );
    }

    // Create or update user
    let user;
    if (existingUser) {
      user = await User.findByIdAndUpdate(existingUser._id, {
        ownerName,
        phoneNumber,
        email,
        role: 'admin',
        isOnboarded: false,
      }, { new: true });
    } else {
      user = await User.create({
        userId,
        email,
        ownerName,
        phoneNumber,
        role: 'admin',
        isOnboarded: false,
      });
    }

    // Generate unique join code
    let joinCode;
    let isUnique = false;
    while (!isUnique) {
      joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingHostel = await Hostel.findOne({ joinCode });
      if (!existingHostel) {
        isUnique = true;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create or update user" },
        { status: 500 }
      );
    }

    // Create hostel
    const hostel = await Hostel.create({
      name: hostelName,
      owner: user._id,
      joinCode,
      users: [{
        userId: user._id,
        role: 'admin',
        status: 'approved',
        joinedAt: new Date(),
      }],
    });

    // Update user with hostel reference and mark as onboarded
    await User.findByIdAndUpdate(user._id, {
      hostel: hostel._id,
      role: 'admin',
      isOnboarded: true,
    });

    // Create default block for the hostel
    const { Block } = await import("@/lib/mongoose/models/block.model");
    const block = await Block.create({
      name: hostelName,
      description: `Main block for ${hostelName}`,
      hostel: hostel._id,
      rentGenerationDay: "1", // Default, but will use individual tenant join dates
    });

    // Add the block to admin's assignedBlocks array
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
      { name: "Water Bottle", description: "Personal water bottle" },
    ];

    const createdComponents = await Promise.all(
      basicComponents.map(component  =>
        RoomComponent.create({
          ...component,
          blockId: (block._id as mongoose.Types.ObjectId).toString(),
        })
      )
    );
    
    return NextResponse.json({
      message: "Hostel created successfully",
      hostel: {
        id: hostel._id,
        name: hostel.name,
        joinCode: hostel.joinCode,
      },
      block: {
        id: block._id,
        name: block.name,
      },
      componentsCreated: createdComponents.length,
    });
  } catch (error) {
    console.error("Error in hostel creation:", error);
    return NextResponse.json(
      { error: "Failed to create hostel" },
      { status: 500 }
    );
  }
}