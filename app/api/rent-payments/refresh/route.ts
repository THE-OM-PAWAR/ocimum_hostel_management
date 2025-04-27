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

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const generationDay = parseInt(block.rentGenerationDay) || 5;

    // Get only active tenants
    const tenants = await Tenant.find({
      block: blockId,
      status: 'active'
    });

    const generatedEntries = {
      current: 0,
      next: 0
    };

    for (const tenant of tenants) {
      try {
        // Check and create current month entry if missing
        const existingCurrentEntry = await RentPayment.findOne({
          tenant: tenant._id,
          month: currentMonth,
          year: currentYear,
          type: 'monthly'
        });

        if (!existingCurrentEntry) {
          const roomType = await RoomType.findOne({
            blockId,
            name: tenant.roomType
          });

          if (roomType) {
            await RentPayment.create({
              tenant: tenant._id,
              block: blockId,
              roomNumber: tenant.roomNumber,
              roomType: tenant.roomType,
              amount: roomType.rent,
              month: currentMonth,
              year: currentYear,
              dueDate: new Date(currentYear, currentDate.getMonth(), generationDay),
              status: 'undefined',
              type: 'monthly'
            });
            generatedEntries.current++;
          }
        }

        // Check if we should create next month's entry
        if (currentDate.getDate() >= generationDay) {
          const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
          const nextMonthName = nextMonth.toLocaleString('default', { month: 'long' });
          const nextMonthYear = nextMonth.getFullYear();

          const existingNextEntry = await RentPayment.findOne({
            tenant: tenant._id,
            month: nextMonthName,
            year: nextMonthYear,
            type: 'monthly'
          });

          if (!existingNextEntry) {
            const roomType = await RoomType.findOne({
              blockId,
              name: tenant.roomType
            });

            if (roomType) {
              await RentPayment.create({
                tenant: tenant._id,
                block: blockId,
                roomNumber: tenant.roomNumber,
                roomType: tenant.roomType,
                amount: roomType.rent,
                month: nextMonthName,
                year: nextMonthYear,
                dueDate: new Date(nextMonthYear, nextMonth.getMonth(), generationDay),
                status: 'undefined',
                type: 'monthly'
              });
              generatedEntries.next++;
            }
          }
        }
      } catch (error) {
        console.error(`Error processing tenant ${tenant._id}:`, error);
      }
    }

    return NextResponse.json({
      message: "Payment entries refresh completed",
      currentMonthGenerated: generatedEntries.current,
      nextMonthGenerated: generatedEntries.next
    });
  } catch (error) {
    console.error("Error refreshing payment entries:", error);
    return NextResponse.json(
      { error: "Failed to refresh payment entries" },
      { status: 500 }
    );
  }
}