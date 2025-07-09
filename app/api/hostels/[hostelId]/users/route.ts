import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const hostel = await Hostel.findById(params.hostelId).populate({
      path: 'users.userId',
      select: 'email userId role assignedBlocks',
      populate: {
        path: 'assignedBlocks',
        select: 'name',
      },
    });

    if (!hostel) {
      return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
    }

    return NextResponse.json({
      users: hostel.users,
      hostelName: hostel.name,
      joinCode: hostel.joinCode,
    });
  } catch (error) {
    console.error("Error fetching hostel users:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostel users" },
      { status: 500 }
    );
  }
}