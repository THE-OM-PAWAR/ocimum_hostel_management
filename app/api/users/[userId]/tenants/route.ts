import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get('blockId');

    let query = {};
    if (blockId) {
      query = { block: blockId };
    }

    const tenants = await Tenant.find(query)
      .populate('block', 'name')
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
      blockId: data.block,
      name: data.roomType 
    });

    if (!roomType) {
      throw new Error("Room type not found");
    }

    // Get block settings for rent generation
    const block = await Block.findById(data.block);
    if (!block) {
      throw new Error("Block not found");
    }

    const generationDay = parseInt(block.rentGenerationDay) || 5;

    // Generate rent payments from join date to next month
    const joinDate = new Date(data.joinDate);
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const months = [];
    
    let date = new Date(joinDate);
    while (date <= nextMonth) {
      months.push({
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        dueDate: new Date(date.getFullYear(), date.getMonth(), generationDay)
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