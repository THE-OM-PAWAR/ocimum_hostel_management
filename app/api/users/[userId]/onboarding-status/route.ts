import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import clientPromise from "@/lib/mongodb/client";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB; // Ensure MongoDB connection

    const user = await User.findOne({ userId: params.userId });

    return NextResponse.json({
      isOnboarded: user?.isOnboarded || false,
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}