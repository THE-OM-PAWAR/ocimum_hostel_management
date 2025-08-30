import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";

export async function PUT(
  req: Request,
  { params }: { params: { hostelId: string; userId: string } }
) {
  try {
    await connectDB();
    const { role, status, assignedBlocks } = await req.json();

    // First, find the User document using Clerk's userId to get the Mongoose _id
    const user = await User.findOne({ userId: params.userId }) as { _id: string; userId: string };
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user in hostel
    const hostel = await Hostel.findById(params.hostelId);
    if (!hostel) {
      return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
    }

    // Use the Mongoose _id to find the user in the hostel.users array
    const userIndex = hostel.users.findIndex(
      (u) => u.userId.toString() === user._id.toString()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found in hostel' }, { status: 404 });
    }

    // Update user in hostel users array
    if (role) hostel.users[userIndex].role = role;
    if (status) hostel.users[userIndex].status = status;

    await hostel.save();

    // Update user document
    const updateData: any = {};
    if (role) updateData.role = role;
    if (assignedBlocks) updateData.assignedBlocks = assignedBlocks;

    await User.findOneAndUpdate({ userId: params.userId }, updateData);

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}