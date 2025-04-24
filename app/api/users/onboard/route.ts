import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import clientPromise from "@/lib/mongodb/client";
import { auth } from "@clerk/nextjs";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    const { ownerName, hostelName, phoneNumber, email, userId } = await req.json();
    
    if (!userId || !ownerName || !hostelName || !phoneNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB; // Ensure MongoDB connection
    
    const user = await User.create({
      userId,
      ownerName,
      hostelName,
      phoneNumber,
      email,
      isOnboarded: true,
      role: "admin", // Set role to admin for hostel owners
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}