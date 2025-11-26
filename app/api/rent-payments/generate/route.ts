import { NextResponse } from "next/server";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { RoomType } from "@/lib/mongoose/models/room-type.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { hostelId } = await req.json();

    if (!hostelId) {
      return NextResponse.json(
        { error: "Hostel ID is required" },
        { status: 400 }
      );
    }

    // Get hostel settings
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return NextResponse.json(
        { error: "Hostel not found" },
        { status: 404 }
      );
    }

    // Check if rent generation is enabled
    if (!hostel.rentGenerationEnabled) {
      return NextResponse.json(
        { message: "Rent generation is disabled for this hostel" }
      );
    }

    // Get current date and generation day
    const currentDate = new Date();
    const generationDay = parseInt(hostel.rentGenerationDay) || 1;
    const paymentGenerationType = (hostel as any).paymentGenerationType || 'join_date_based';
    
    // Calculate next month's date
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    
    // Get only active tenants
    const tenants = await Tenant.find({ 
      hostel: hostelId,
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
            hostelId,
            name: tenant.roomType
          });

          if (!roomType) continue;

          // Calculate due date based on payment generation type
          let dueDate;
          if (paymentGenerationType === 'join_date_based') {
            const joinDay = new Date(tenant.joinDate).getDate();
            dueDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), joinDay);
          } else {
            dueDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), generationDay);
          }
          
          // Create next month's rent entry
          const rentPayment = await RentPayment.create({
            tenant: tenant._id,
            hostel: hostelId,
            roomNumber: tenant.roomNumber,
            roomType: tenant.roomType,
            amount: roomType.rent,
            month: nextMonth.toLocaleString('default', { month: 'long' }),
            year: nextMonth.getFullYear(),
            dueDate,
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