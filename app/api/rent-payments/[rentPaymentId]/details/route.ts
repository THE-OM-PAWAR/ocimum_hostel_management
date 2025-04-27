import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { rentPaymentId: string } }
) {
  try {
    await connectDB();
    const { rentPaymentId } = params;

    console.log("Fetching payment details for ID:", rentPaymentId);

    const payment = await RentPayment.findById(rentPaymentId);
    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment details" },
      { status: 500 }
    );
  }
}