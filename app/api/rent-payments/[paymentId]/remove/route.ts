import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import connectDB from "@/lib/mongodb/client";

export async function DELETE(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    await connectDB();
    const { paymentId } = params;
    const { message } = await req.json();

    const payment = await RentPayment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Add deletion log before removing
    const changeLog = {
      type: 'delete',
      date: new Date(),
      message,
    };

    await RentPayment.findByIdAndUpdate(
      paymentId,
      {
        $set: { status: 'cancelled' },
        $push: { changeLog },
      }
    );

    return NextResponse.json({ message: "Payment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling payment:", error);
    return NextResponse.json(
      { error: "Failed to cancel payment" },
      { status: 500 }
    );
  }
}