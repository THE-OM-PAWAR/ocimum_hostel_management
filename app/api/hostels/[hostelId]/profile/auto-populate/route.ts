import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    // Get hostel
    const hostel = await Hostel.findById(params.hostelId);
    if (!hostel) {
      return NextResponse.json(
        { error: "Hostel not found" },
        { status: 404 }
      );
    }

    // Create default hostel profile structure
    const hostelProfileData = {
      basicInfo: {
        name: hostel.name,
        description: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        contactNumber: "",
        email: "",
      },
      propertyDetails: {
        totalFloors: 1,
        totalRooms: 1,
        accommodationType: 'boys' as const,
        establishedYear: new Date().getFullYear(),
        buildingType: 'independent' as const,
      },
      locationInfo: {
        googleMapLink: "",
        nearbyLandmarks: [],
        transportConnectivity: [],
      },
      media: {
        photos: [],
        virtualTourLink: "",
      },
      amenities: [],
      safetyFeatures: [
        { feature: "CCTV Surveillance", available: false, details: "" },
        { feature: "Security Guard", available: false, details: "" },
        { feature: "Biometric Access", available: false, details: "" },
        { feature: "Fire Safety Equipment", available: false, details: "" },
        { feature: "Emergency Exit", available: false, details: "" },
        { feature: "First Aid Kit", available: false, details: "" },
      ],
    };

    return NextResponse.json(hostelProfileData);
  } catch (error) {
    console.error("Error auto-populating hostel profile:", error);
    return NextResponse.json(
      { error: "Failed to auto-populate hostel profile" },
      { status: 500 }
    );
  }
}