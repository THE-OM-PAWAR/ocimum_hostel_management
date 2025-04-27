import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import connectDB from "@/lib/mongodb/client";

export async function PUT(
  req: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    await connectDB();
    const { tenantId } = params;
    const { status, reason } = await req.json();

    if (!status || !reason) {
      return NextResponse.json(
        { error: "Status and reason are required" },
        { status: 400 }
      );
    }

    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          status,
          statusChangeDate: new Date(),
          statusChangeReason: reason,
        },
      },
      { new: true }
    );

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error updating tenant status:", error);
    return NextResponse.json(
      { error: "Failed to update tenant status" },
      { status: 500 }
    );
  }
}