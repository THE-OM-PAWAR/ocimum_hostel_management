import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import { Block } from "@/lib/mongoose/models/block.model";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { RoomType } from "@/lib/mongoose/models/room-type.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { blockId } = await req.json();

    if (!blockId) {
      return NextResponse.json(
        { error: "Block ID is required" },
        { status: 400 }
      );
    }

    // Get block settings
    const block = await Block.findById(blockId);
    if (!block) {
      return NextResponse.json(
        { error: "Block not found" },
        { status: 404 }
      );
    }

    // Check if rent generation is enabled
    if (!block.rentGenerationEnabled) {
      return NextResponse.json(
        { message: "Rent generation is disabled for this block" }
      );
    }

    // Get current date and generation day
    const currentDate = new Date();
    const generationDay = parseInt(block.rentGenerationDay) || 5;
    
    // Calculate next month's date
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    
    // Get all active tenants in the block
    const tenants = await Tenant.find({ 
      block: blockId,
      status: 'active'
    });

    const generatedRents = [];

    for (const tenant of tenants) {
      try {
        // Check if rent entry already exists for next month
        const existingRent = await RentPayment.findOne({
          tenant: tenant._id,
          month: nextMonth.toLocaleString('default', { month: 'long' }),
          year: nextMonth.getFullYear(),
          type: 'monthly'
        });

        if (!existingRent) {
          // Get room type for rent amount
          const roomType = await RoomType.findOne({
            blockId,
            name: tenant.roomType
          });

          if (!roomType) continue;

          // Create next month's rent entry
          const rentPayment = await RentPayment.create({
            tenant: tenant._id,
            block: blockId,
            roomNumber: tenant.roomNumber,
            roomType: tenant.roomType,
            amount: roomType.rent,
            month: nextMonth.toLocaleString('default', { month: 'long' }),
            year: nextMonth.getFullYear(),
            dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), generationDay),
            status: 'undefined',
            type: 'monthly'
          });

          generatedRents.push(rentPayment);
        }
      } catch (error: any) {
        console.error(`Error generating rent for tenant ${tenant._id}:`, error);
      }
    }

    return NextResponse.json({
      message: "Rent generation completed",
      generatedCount: generatedRents.length
    });
  } catch (error) {
    console.error("Error in rent generation:", error);
    return NextResponse.json(
      { error: "Failed to generate rent entries" },
      { status: 500 }
    );
  }
}