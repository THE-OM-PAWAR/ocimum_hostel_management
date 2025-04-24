import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    console.log('Checking onboarding status for user:', params.userId);

    const user = await User.findOne({ userId: params.userId });
    console.log('User found:', user);

    if (!user) {
      return NextResponse.json({ isOnboarded: false, message: 'User not found' });
    }
    
    return NextResponse.json({ isOnboarded: user.isOnboarded });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}