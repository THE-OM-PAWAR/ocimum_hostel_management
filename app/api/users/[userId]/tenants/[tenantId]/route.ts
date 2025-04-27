import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    await connectDB();
    const { tenantId } = params;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return NextResponse.json( 
        { error: "Tenant not found" },
        { status: 404 }
      );
    }


    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    await connectDB();
    const { tenantId } = params;
    const updateData = await req.json();

    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { $set: updateData },
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
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    await connectDB();
    const { tenantId } = params;

    const tenant = await Tenant.findByIdAndDelete(tenantId);

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json(
      { error: "Failed to delete tenant" },
      { status: 500 }
    );
  }
}