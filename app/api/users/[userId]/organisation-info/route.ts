import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/client";
// Import models to ensure they are registered with mongoose
import "@/lib/mongoose/models/hostel.model";
import "@/lib/mongoose/models/organisation.model";
import "@/lib/mongoose/models/organisation-profile.model";
import { User } from "@/lib/mongoose/models/user.model";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const user = await User.findOne({ userId: params.userId }).populate('organisation');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.organisation) {
      return NextResponse.json({ error: 'User not associated with any organisation' }, { status: 404 });
    }

    const organisation = user.organisation as any;

    console.log("Fetched organisation info for userId:", params.userId, organisation);
    
    return NextResponse.json({
      ownerName: user.ownerName,
      phoneNumber: user.phoneNumber,
      organisationName: organisation.name,
      organisationId: organisation._id,
      joinCode: organisation.joinCode,
      userRole: user.role,
    });
  } catch (error) {
    console.error("Error fetching organisation info:", error);
    return NextResponse.json(
      { error: "Failed to fetch organisation info" },
      { status: 500 }
    );
  }
}