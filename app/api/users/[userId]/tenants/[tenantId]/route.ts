import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { RoomType } from "@/lib/mongoose/models/room-type.model";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    await connectDB();
    const { tenantId } = params;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return NextResponse.json( 
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Fetch room type details with images
    try {
      const block = await Block.findById(tenant.block);
      if (block) {
        const roomType = await RoomType.findOne({
          blockId: block._id.toString(),
          name: tenant.roomType
        }).populate('components');
        
        if (roomType) {
          const tenantWithRoomType = {
            ...tenant.toObject(),
            roomTypeDetails: roomType
          };
          return NextResponse.json(tenantWithRoomType);
        }
      }
    } catch (error) {
      console.error("Error fetching room type details:", error);
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    await connectDB();
    const { tenantId } = params;
    const updateData = await req.json();

    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { $set: updateData },
      { new: true }
    );

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    await connectDB();
    const { tenantId } = params;

    const tenant = await Tenant.findByIdAndDelete(tenantId);

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json(
      { error: "Failed to delete tenant" },
      { status: 500 }
    );
  }
}








// in the payment tab of tenants payments having a popover  on clicking three dot 

// in that pop over I want three option 
// 1. edit payment (on click open dialogue)
// 2. remove payment  (on click open dialogue)
// 3. payment details  (on click open drawer )

// after that 

// 1. edit payment dialogue have field ( amount, status  , change method and a message for this edit ),
// 2. remove payment dialogue will have a message for removing the payment 
// (this two will also save the date of changes in the payment )
// 3. the payment details drawer will have all the log messages of edit and delete with the payment data 

// so create this 