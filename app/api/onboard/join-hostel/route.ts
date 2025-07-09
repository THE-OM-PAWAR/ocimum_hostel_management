import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    const { joinCode, ownerName, phoneNumber, userId, email } = await req.json();
    
    if (!userId || !joinCode || !email || !ownerName || !phoneNumber) {
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

    // Find hostel by join code
    const hostel = await Hostel.findOne({ joinCode: joinCode.toUpperCase() });
    if (!hostel) {
      return NextResponse.json(
        { error: "Invalid join code" },
        { status: 404 }
      );
    }

    // Create or update user
    let user;
    if (existingUser) {
      user = await User.findByIdAndUpdate(existingUser._id, {
        ownerName,
        phoneNumber,
        email,
        role: 'pending',
        isOnboarded: false,
      }, { new: true });
    } else {
      user = await User.create({
        userId,
        email,
        ownerName,
        phoneNumber,
        role: 'pending',
        isOnboarded: false,
      });
    }

    // Check if user is already in the hostel
    const existingUserInHostel = hostel.users.find(
      (u) => u.userId.toString() === user._id.toString()
    );

    if (existingUserInHostel) {
      return NextResponse.json(
        { error: "User is already associated with this hostel" },
        { status: 400 }
      );
    }

    // Add user to hostel with pending status
    await Hostel.findByIdAndUpdate(hostel._id, {
      $push: {
        users: {
          userId: user._id,
          role: 'pending',
          status: 'pending',
          joinedAt: new Date(),
        },
      },
    });

    // Update user with hostel reference and mark as onboarded
    await User.findByIdAndUpdate(user._id, {
      hostel: hostel._id,
      role: 'pending',
      isOnboarded: true,
    });

    return NextResponse.json({
      message: "Join request sent successfully",
      hostel: {
        name: hostel.name,
      },
    });
  } catch (error) {
    console.error("Error in joining hostel:", error);
    return NextResponse.json(
      { error: "Failed to join hostel" },
      { status: 500 }
    );
  }
}