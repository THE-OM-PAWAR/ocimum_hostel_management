import { NextResponse } from "next/server";
import { Organisation } from "@/lib/mongoose/models/organisation.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();

    const organisation = await Organisation.findById(params.organisationId);

    if (!organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isOnlinePresenceEnabled: organisation.isOnlinePresenceEnabled || false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organisation online presence status" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();
    const { isOnlinePresenceEnabled } = await req.json();

    const organisation = await Organisation.findByIdAndUpdate(
      params.organisationId,
      { isOnlinePresenceEnabled: isOnlinePresenceEnabled ?? false },
      { new: true, runValidators: true }
    );

    if (!organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isOnlinePresenceEnabled: organisation.isOnlinePresenceEnabled,
    });
  } catch (error) {
    console.error("Error updating organisation online presence:", error);
    return NextResponse.json(
      { error: "Failed to update organisation online presence" },
      { status: 500 }
    );
  }
}

