import { NextResponse } from "next/server";
import { Organisation } from "@/lib/mongoose/models/organisation.model";
import { User } from "@/lib/mongoose/models/user.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();

    const organisation = await Organisation.findById(params.organisationId).populate({
      path: 'users.userId',
      select: 'email userId role assignedHostels',
      populate: {
        path: 'assignedHostels',
        select: 'name',
      },
    });

    if (!organisation) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    return NextResponse.json({
      users: organisation.users,
      organisationName: organisation.name,
      joinCode: organisation.joinCode,
    });
  } catch (error) {
    console.error("Error fetching organisation users:", error);
    return NextResponse.json(
      { error: "Failed to fetch organisation users" },
      { status: 500 }
    );
  }
}