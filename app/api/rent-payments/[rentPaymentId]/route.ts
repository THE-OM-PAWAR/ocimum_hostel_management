import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import connectDB from "@/lib/mongodb/client";

export async function PUT(
  req: Request,
  { params }: { params: { rentPaymentId: string } }
) {
  try {
    await connectDB();
    const { rentPaymentId } = params;
    const updateData = await req.json();

    const rentPayment = await RentPayment.findByIdAndUpdate(
      rentPaymentId,
      { $set: updateData },
      { new: true }
    );

    if (!rentPayment) {
      return NextResponse.json(
        { error: "Rent payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rentPayment);
  } catch (error) {
    console.error("Error updating rent payment:", error);
    return NextResponse.json(
      { error: "Failed to update rent payment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { rentPaymentId: string } }
) {
  try {
    await connectDB();
    const { rentPaymentId } = params;

    const rentPayment = await RentPayment.findByIdAndDelete(rentPaymentId);

    if (!rentPayment) {
      return NextResponse.json(
        { error: "Rent payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Rent payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting rent payment:", error);
    return NextResponse.json(
      { error: "Failed to delete rent payment" },
      { status: 500 }
    );
  }
}