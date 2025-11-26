import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const phone = searchParams.get("phone");

    if (!userId || !phone) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // First, get all hostels associated with the user
    const hostels = await Hostel.find({ userId });
    const hostelIds = hostels.map(hostel => hostel._id);

    // Then, search for tenants in these hostels with the given phone number
    const tenants = await Tenant.find({
      hostel: { $in: hostelIds },
      phone: { $regex: phone, $options: 'i' },
    });

    // Fetch rent payments for each tenant
    const tenantsWithPayments = await Promise.all(
      tenants.map(async (tenant) => {
        const payments = await RentPayment.find({ tenant: tenant._id })
          .sort({ year: -1, month: -1 })
          .limit(3);
        
        return {
          ...tenant.toObject(),
          recentPayments: payments
        };
      })
    );
    console.log("Tenants with payments:", hostels);

    return NextResponse.json(tenantsWithPayments);
  } catch (error) {
    console.error("Error searching tenants:", error);
    return NextResponse.json(
      { error: "Failed to search tenants" },
      { status: 500 }
    );
  }
}