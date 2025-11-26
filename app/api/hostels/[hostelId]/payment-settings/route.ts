import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const hostel = await Hostel.findById(params.hostelId).select(
      "rentGenerationDay rentGenerationEnabled paymentGenerationType paymentVisibilityDays"
    ).lean();

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      rentGenerationDay: hostel.rentGenerationDay || "1",
      rentGenerationEnabled: hostel.rentGenerationEnabled ?? true,
      paymentGenerationType: (hostel as any).paymentGenerationType || 'join_date_based',
      paymentVisibilityDays: (hostel as any).paymentVisibilityDays || 2,
    });
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment settings" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { rentGenerationDay, rentGenerationEnabled, paymentGenerationType, paymentVisibilityDays } = body;

    const hostel = await Hostel.findByIdAndUpdate(
      params.hostelId,
      {
        rentGenerationDay,
        rentGenerationEnabled,
        paymentGenerationType,
        paymentVisibilityDays,
      },
      {
        new: true,
        runValidators: true,
        strict: false,
      }
    ).select("rentGenerationDay rentGenerationEnabled paymentGenerationType paymentVisibilityDays");

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      rentGenerationDay: hostel.rentGenerationDay,
      rentGenerationEnabled: hostel.rentGenerationEnabled,
      paymentGenerationType: (hostel as any).paymentGenerationType,
      paymentVisibilityDays: (hostel as any).paymentVisibilityDays,
    });
  } catch (error) {
    console.error("Error updating payment settings:", error);
    return NextResponse.json(
      { error: "Failed to update payment settings" },
      { status: 500 }
    );
  }
}
