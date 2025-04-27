import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const rentPayment = await RentPayment.create(data);

    return NextResponse.json(rentPayment);
  } catch (error) {
    console.error("Error creating rent payment:", error);
    return NextResponse.json(
      { error: "Failed to create rent payment" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const rentPayments = await RentPayment.find({ tenant: tenantId })
      .sort({ year: -1, month: -1 })
      .limit(12); // Get last 12 months by default
    return NextResponse.json(rentPayments);
  } catch (error) {
    console.error("Error fetching rent payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch rent payments" },
      { status: 500 }
    );
  }
}