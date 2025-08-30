import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/client";
// Import models to ensure they are registered with mongoose
import "@/lib/mongoose/models/hostel.model";
import { User } from "@/lib/mongoose/models/user.model";

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

    console.log("Fetched hostel info for userId:", params.userId, hostel);
    
    return NextResponse.json({
      ownerName: user.ownerName,
      phoneNumber: user.phoneNumber,
      hostelName: hostel.name,
      hostelId: hostel._id,
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