import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const hostel = await Hostel.findById(params.hostelId).populate({
      path: 'users.userId',
      select: 'email userId',
    });

    if (!hostel) {
      return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
    }

    const pendingUsers = hostel.users.filter(user => user.status === 'pending');

    return NextResponse.json({
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending users" },
      { status: 500 }
    );
  }
}