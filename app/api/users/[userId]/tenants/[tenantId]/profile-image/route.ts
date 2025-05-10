import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/client";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { deleteFromCloudinary } from "@/lib/cloudinary/utils";

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    const { tenantId } = params;
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // First check if tenant exists
    const existingTenant = await Tenant.findById(tenantId);
    if (!existingTenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // If there's an existing profile image, delete it from Cloudinary
    if (existingTenant.profileImage) {
      console.log("tenantId", existingTenant.profileImage);
      const deleted = await deleteFromCloudinary(existingTenant.profileImage);
      console.log("Deleted from Cloudinary", deleted);
    }

    // Update the tenant's profile image
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!updatedTenant) {
      return NextResponse.json(
        { error: "Failed to update tenant" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profile image updated successfully",
      imageUrl: updatedTenant.profileImage,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { error: "Failed to update profile image" },
      { status: 500 }
    );
  }
} 