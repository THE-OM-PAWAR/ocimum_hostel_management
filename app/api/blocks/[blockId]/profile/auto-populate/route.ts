import { NextResponse } from "next/server";
import { HostelProfile } from "@/lib/mongoose/models/hostel-profile.model";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();

    // Get block and its hostel
    const block = await Block.findById(params.blockId).populate('hostel');
    if (!block || !block.hostel) {
      return NextResponse.json(
        { error: "Block or hostel not found" },
        { status: 404 }
      );
    }

    // Get hostel profile
    const hostelProfile = await HostelProfile.findOne({ hostel: block.hostel });
    if (!hostelProfile) {
      return NextResponse.json(
        { error: "Hostel profile not found" },
        { status: 404 }
      );
    }

    // Create block profile structure with hostel data
    const blockProfileData = {
      basicInfo: {
        name: block.name,
        description: "",
        address: hostelProfile.basicInfo.address,
        landmark: hostelProfile.basicInfo.landmark,
        city: hostelProfile.basicInfo.city,
        state: hostelProfile.basicInfo.state || "",
        pincode: hostelProfile.basicInfo.pincode,
        contactNumber: hostelProfile.basicInfo.contactNumber,
        email: hostelProfile.basicInfo.email,
      },
      propertyDetails: {
        totalFloors: 1,
        totalRooms: 1,
        accommodationType: hostelProfile.propertyDetails.type,
        establishedYear: new Date().getFullYear(),
        buildingType: 'independent' as const,
      },
      locationInfo: {
        googleMapLink: hostelProfile.locationFactors.googleMapLink || "",
        nearbyLandmarks: hostelProfile.locationFactors.nearbyLandmarks.map(landmark => ({
          name: landmark.name,
          distance: landmark.distance,
          type: 'other' as const,
        })),
        transportConnectivity: [],
      },
      media: {
        photos: [],
        virtualTourLink: "",
      },
      amenities: hostelProfile.propertyDetails.facilities.map(facility => ({
        name: facility.name,
        available: facility.available,
        description: facility.details || "",
        floor: "",
      })),
      safetyFeatures: [
        { feature: "CCTV Surveillance", available: false, details: "" },
        { feature: "Security Guard", available: false, details: "" },
        { feature: "Biometric Access", available: false, details: "" },
        { feature: "Fire Safety Equipment", available: false, details: "" },
        { feature: "Emergency Exit", available: false, details: "" },
        { feature: "First Aid Kit", available: false, details: "" },
      ],
    };

    return NextResponse.json(blockProfileData);
  } catch (error) {
    console.error("Error auto-populating block profile:", error);
    return NextResponse.json(
      { error: "Failed to auto-populate block profile" },
      { status: 500 }
    );
  }
}