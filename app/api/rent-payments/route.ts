import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Get block settings for rent generation
    const block = await Block.findById(data.block);
    if (!block) {
      return NextResponse.json(
        { error: "Block not found" },
        { status: 404 }
      );
    }

    // For manual rent payments, use the provided due date or calculate based on month
    let dueDate;
    if (data.dueDate) {
      dueDate = new Date(data.dueDate);
    } else {
      // Default to 1st of the month if no specific due date provided
      dueDate = new Date(
        data.year,
        new Date(Date.parse(`${data.month} 1, 2000`)).getMonth(),
        1
      );
    }

    // Check for duplicate monthly rent
    if (data.type === 'monthly') {
      const existingPayment = await RentPayment.findOne({
        tenant: data.tenant,
        month: data.month,
        year: data.year,
        type: 'monthly'
      });

      if (existingPayment) {
        return NextResponse.json(
          { error: "Monthly rent entry already exists for this period" },
          { status: 400 }
        );
      }
    }

    // Create the rent payment
    const rentPayment = await RentPayment.create({
      ...data,
      dueDate,
      type: 'additional'
    });

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
    const blockId = searchParams.get('blockId');

    if (!tenantId && !blockId) {
      return NextResponse.json(
        { error: "Either tenant ID or block ID is required" },
        { status: 400 }
      );
    }

    let query = {};
    if (tenantId) {
      query = { tenant: tenantId };
    } else if (blockId) {
      query = { block: blockId };
    }

    const rentPayments = await RentPayment.find(query)
      .sort({ year: -1, month: -1 })
      .limit(12);

    return NextResponse.json(rentPayments);
  } catch (error) {
    console.error("Error fetching rent payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch rent payments" },
      { status: 500 }
    );
  }
}
