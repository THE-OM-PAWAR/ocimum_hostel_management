import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

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

    return NextResponse.json({
      message: "Hostel created successfully",
      hostel: {
        id: hostel._id,
        name: hostel.name,
        joinCode: hostel.joinCode,
      },
    });
  } catch (error) {
    console.error("Error in hostel creation:", error);
    return NextResponse.json(
      { error: "Failed to create hostel" },
      { status: 500 }
    );
  }
}