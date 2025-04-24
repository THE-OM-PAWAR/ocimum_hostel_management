import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import clientPromise from "@/lib/mongodb/client";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const {ownerName, hostelName, phoneNumber, email } = await req.json();
    const {userId} = auth();
    console.log(ownerName, hostelName, phoneNumber, email); // Debugging line
    
    console.log("User ID from Clerk:", userId);
    if (!userId || !ownerName || !hostelName || !phoneNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await clientPromise; // Ensure MongoDB connection
    
    const existingUser = await User.findOne({ userId });
    if (existingUser) { 
        return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
        );
    }
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