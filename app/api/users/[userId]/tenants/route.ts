import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import { RoomType } from "@/lib/mongoose/models/room-type.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams, pathname } = new URL(req.url);
    const hostelId = searchParams.get('hostelId');
    
    // Extract userId from the pathname
    const pathParts = pathname.split('/');
    const userId = pathParts[pathParts.indexOf('users') + 1];

    let query: any = {};
    
    if (hostelId) {
      // If hostelId is specified, get tenants for that specific hostel
      query = { hostel: hostelId };
    } else if (userId) {
      // If no hostelId but userId is provided, get all tenants for all hostels owned by this user
      const hostels = await Hostel.find({ userId });
      const hostelIds = hostels.map(hostel => hostel._id);
      query = { hostel: { $in: hostelIds } };
    }

    const tenants = await Tenant.find(query)
      .populate('hostel', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Create tenant
    const tenant = await Tenant.create(data);

    // Get room type details for rent amount
    const roomType = await RoomType.findOne({ 
      hostelId: data.hostel,
      name: data.roomType 
    });

    if (!roomType) {
      throw new Error("Room type not found");
    }

    // Get hostel settings for rent generation
    const hostel = await Hostel.findById(data.hostel);
    if (!hostel) {
      throw new Error("Hostel not found");
    }

    const generationDay = parseInt(hostel.rentGenerationDay) || 1;
    const paymentGenerationType = (hostel as any).paymentGenerationType || 'join_date_based';

    // Generate rent payments from join date to next month
    const joinDate = new Date(data.joinDate);
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const months = [];
    
    let date = new Date(joinDate);
    while (date <= nextMonth) {
      let dueDate;
      if (paymentGenerationType === 'join_date_based') {
        // Use join date day for due date
        const joinDay = joinDate.getDate();
        dueDate = new Date(date.getFullYear(), date.getMonth(), joinDay);
      } else {
        // Use global generation day
        dueDate = new Date(date.getFullYear(), date.getMonth(), generationDay);
      }
      
      months.push({
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        dueDate
      });
      date.setMonth(date.getMonth() + 1);
    }

    // Create rent payment records
    const rentPayments = months.map(month => ({
      tenant: tenant._id,
      hostel: data.hostel,
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      amount: roomType.rent,
      month: month.month,
      year: month.year,
      dueDate: month.dueDate,
      status: 'undefined',
      type: 'monthly'
    }));

    // Insert rent payments, handling potential duplicates
    for (const payment of rentPayments) {
      try {
        await RentPayment.create(payment);
      } catch (error: any) {
        // Skip if duplicate monthly rent entry
        if (error.code !== 11000) {
          throw error;
        }
      }
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}