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
    const generationDay = parseInt(block.rentGenerationDay) || 1;
    const paymentGenerationType = (block as any).paymentGenerationType || 'join_date_based';

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
        // Calculate due dates based on payment generation type
        let currentDueDate, nextDueDate;
        
        if (paymentGenerationType === 'join_date_based') {
          const joinDay = new Date(tenant.joinDate).getDate();
          currentDueDate = new Date(currentYear, currentDate.getMonth(), joinDay);
          nextDueDate = new Date(currentYear, currentDate.getMonth() + 1, joinDay);
        } else {
          currentDueDate = new Date(currentYear, currentDate.getMonth(), generationDay);
          nextDueDate = new Date(currentYear, currentDate.getMonth() + 1, generationDay);
        }
        
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
              dueDate: currentDueDate,
              status: 'undefined',
              type: 'monthly'
            });
            generatedEntries.current++;
          }
        }

        // Check if we should create next month's entry based on payment type
        let shouldGenerateNext = false;
        
        if (paymentGenerationType === 'join_date_based') {
          const joinDay = new Date(tenant.joinDate).getDate();
          const daysUntilDue = joinDay - currentDate.getDate();
          shouldGenerateNext = daysUntilDue <= 2; // Generate 2 days before due date
        } else {
          shouldGenerateNext = currentDate.getDate() >= generationDay;
        }
        
        if (shouldGenerateNext) {
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
                dueDate: nextDueDate,
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