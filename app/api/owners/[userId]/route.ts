import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/client";
import { User } from "@/lib/mongoose/models/user.model";  

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const owner = await User.findOne({ userId: params.userId });

    if (!owner) {
      return NextResponse.json(
        { error: "Owner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(owner);
  } catch (error) {
    console.error("Error fetching owner:", error);
    return NextResponse.json(
      { error: "Failed to fetch owner data" },
      { status: 500 }
    );
  }
}