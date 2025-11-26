import { NextResponse } from "next/server";
import { Organisation } from "@/lib/mongoose/models/organisation.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();

    const organisation = await Organisation.findById(params.organisationId).populate({
      path: 'users.userId',
      select: 'email userId',
    });

    if (!organisation) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    const pendingUsers = organisation.users.filter(user => user.status === 'pending');

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