import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    const { ownerName, hostelName, phoneNumber, email, userId } = await req.json();
    console.log('Received onboarding data:', { ownerName, hostelName, phoneNumber, email, userId });
    if (!userId || !ownerName || !hostelName || !phoneNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB for onboarding...');
    await connectDB();
    
    console.log('Creating new user:', { ownerName, hostelName, phoneNumber, email, userId });
    const user = await User.create({
      userId,
      ownerName,
      hostelName,
      phoneNumber,
      email,
      isOnboarded: true,
      role: "admin",
    });

    console.log('User created successfully:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}