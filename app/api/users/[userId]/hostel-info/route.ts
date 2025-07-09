import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const user = await User.findOne({ userId: params.userId }).populate('hostel');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.hostel) {
      return NextResponse.json({ error: 'User not associated with any hostel' }, { status: 404 });
    }

    const hostel = user.hostel as any;
    
    return NextResponse.json({
      ownerName: user.email, // Using email as owner name for now
      hostelName: hostel.name,
      joinCode: hostel.joinCode,
      userRole: user.role,
    });
  } catch (error) {
    console.error("Error fetching hostel info:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostel info" },
      { status: 500 }
    );
  }
}