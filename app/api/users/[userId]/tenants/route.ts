import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import { RoomType } from "@/lib/mongoose/models/room-type.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Create tenant
    const tenant = await Tenant.create(data);

    // Get room type details for rent amount
    const roomType = await RoomType.findOne({ 
      blockId: data.block,
      name: data.roomType 
    });

    if (!roomType) {
      throw new Error("Room type not found");
    }

    // Generate rent payments from join date to current month
    const joinDate = new Date(data.joinDate);
    const currentDate = new Date();
    const months = [];
    
    let date = new Date(joinDate);
    while (date <= currentDate) {
      months.push({
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        dueDate: new Date(date.getFullYear(), date.getMonth(), 5) // Due date is 5th of each month
      });
      date.setMonth(date.getMonth() + 1);
    }

    // Create rent payment records
    const rentPayments = months.map(month => ({
      tenant: tenant._id,
      block: data.block,
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      amount: roomType.rent,
      month: month.month,
      year: month.year,
      dueDate: month.dueDate,
      status: 'undefined'
    }));

    await RentPayment.insertMany(rentPayments);

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get('blockId');

    if (!blockId) {
      return NextResponse.json(
        { error: "Block ID is required" },
        { status: 400 }
      );
    }

    const tenants = await Tenant.find({ block: blockId }).sort({ createdAt: -1 });
    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}