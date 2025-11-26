import { NextResponse } from "next/server";
import { Organisation } from "@/lib/mongoose/models/organisation.model";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";

export async function PUT(
  req: Request,
  { params }: { params: { organisationId: string; userId: string } }
) {
  try {
    await connectDB();
    const { role, status, assignedHostels } = await req.json();

    // First, find the User document using Clerk's userId to get the Mongoose _id
    const user = await User.findOne({ userId: params.userId }) as { _id: string; userId: string };
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user in organisation
    const organisation = await Organisation.findById(params.organisationId);
    if (!organisation) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    // Use the Mongoose _id to find the user in the organisation.users array
    const userIndex = organisation.users.findIndex(
      (u) => u.userId.toString() === user._id.toString()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found in organisation' }, { status: 404 });
    }

    // Update user in organisation users array
    if (role) organisation.users[userIndex].role = role;
    if (status) organisation.users[userIndex].status = status;

    await organisation.save();

    // Update user document
    const updateData: any = {};
    if (role) updateData.role = role;
    if (assignedHostels) updateData.assignedHostels = assignedHostels;

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