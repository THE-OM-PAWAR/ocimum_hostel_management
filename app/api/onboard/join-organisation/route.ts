import { NextResponse } from "next/server";
import { IUser, User } from "@/lib/mongoose/models/user.model";
import { Organisation } from "@/lib/mongoose/models/organisation.model";
import connectDB from "@/lib/mongodb/client";
import { Document } from "mongoose";

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

    // Find organisation by join code
    const organisation = await Organisation.findOne({ joinCode: joinCode.toUpperCase() });
    if (!organisation) {
      return NextResponse.json(
        { error: "Invalid join code" },
        { status: 404 }
      );
    }

    // Create or update user
    let user: (Document<unknown, {}, IUser> & IUser & Required<{ _id: unknown; }> & { __v: number; }) | null;
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

    // Check if user is already in the organisation
    let existingUserInOrganisation = null;
    if (user && user._id) {
      existingUserInOrganisation = organisation.users.find(
        (u) => u.userId.toString() === user?._id?.toString()
      );
    }

    if (existingUserInOrganisation) {
      return NextResponse.json(
        { error: "User is already associated with this organisation" },
        { status: 400 }
      );
    }

    // Add user to organisation with pending status
    if (!user) {
      return NextResponse.json(
        { error: "Failed to create or update user" },
        { status: 500 }
      );
    }

    await Organisation.findByIdAndUpdate(organisation._id, {
      $push: {
        users: {
          userId: user._id,
          role: 'pending',
          status: 'pending',
          joinedAt: new Date(),
        },
      },
    });

    // Update user with organisation reference and mark as onboarded
    await User.findByIdAndUpdate(user._id, {
      organisation: organisation._id,
      role: 'pending',
      isOnboarded: true,
    });

    return NextResponse.json({
      message: "Join request sent successfully",
      organisation: {
        name: organisation.name,
      },
    });
  } catch (error) {
    console.error("Error in joining organisation:", error);
    return NextResponse.json(
      { error: "Failed to join organisation" },
      { status: 500 }
    );
  }
}