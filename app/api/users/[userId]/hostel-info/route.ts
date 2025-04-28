import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    console.log('Fetching hostel info for user:', params.userId);

    const user = await User.findOne({ userId: params.userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const blocks = await Block.find({ userId: params.userId });
    
    return NextResponse.json({
      ownerName: user.ownerName,
      hostelName: user.hostelName,
      blocks
    });
  } catch (error) {
    console.error("Error fetching hostel info:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostel info" },
      { status: 500 }
    );
  }
}