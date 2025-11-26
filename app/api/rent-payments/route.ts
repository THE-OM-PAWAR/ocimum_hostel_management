import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Get hostel settings for rent generation
    const hostel = await Hostel.findById(data.hostel);
    if (!hostel) {
      return NextResponse.json(
        { error: "Hostel not found" },
        { status: 404 }
      );
    }

    const generationDay = parseInt(hostel.rentGenerationDay) || 5;

    // Calculate due date based on settings
    const dueDate = new Date(
      data.year,
      new Date(Date.parse(`${data.month} 1, 2000`)).getMonth(),
      generationDay
    );

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
    const hostelId = searchParams.get('hostelId');

    if (!tenantId && !hostelId) {
      return NextResponse.json(
        { error: "Either tenant ID or hostel ID is required" },
        { status: 400 }
      );
    }

    let query = {};
    if (tenantId) {
      query = { tenant: tenantId };
    } else if (hostelId) {
      query = { hostel: hostelId };
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
