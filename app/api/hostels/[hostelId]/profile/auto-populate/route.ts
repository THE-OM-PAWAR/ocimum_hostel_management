import { NextResponse } from "next/server";
import { OrganisationProfile } from "@/lib/mongoose/models/organisation-profile.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    // Get hostel and its organisation
    const hostel = await Hostel.findById(params.hostelId).populate('organisation');
    if (!hostel || !hostel.organisation) {
      return NextResponse.json(
        { error: "Hostel or organisation not found" },
        { status: 404 }
      );
    }

    // Get organisation profile
    const organisationProfile = await OrganisationProfile.findOne({ organisation: hostel.organisation });
    if (!organisationProfile) {
      return NextResponse.json(
        { error: "Organisation profile not found" },
        { status: 404 }
      );
    }

    // Create hostel profile structure with organisation data
    const hostelProfileData = {
      basicInfo: {
        name: hostel.name,
        description: "",
        address: organisationProfile.basicInfo.address,
        landmark: organisationProfile.basicInfo.landmark,
        city: organisationProfile.basicInfo.city,
        state: organisationProfile.basicInfo.state || "",
        pincode: organisationProfile.basicInfo.pincode,
        contactNumber: organisationProfile.basicInfo.contactNumber,
        email: organisationProfile.basicInfo.email,
      },
      propertyDetails: {
        totalFloors: 1,
        totalRooms: 1,
        accommodationType: organisationProfile.propertyDetails.type,
        establishedYear: new Date().getFullYear(),
        buildingType: 'independent' as const,
      },
      locationInfo: {
        googleMapLink: organisationProfile.locationFactors.googleMapLink || "",
        nearbyLandmarks: organisationProfile.locationFactors.nearbyLandmarks.map(landmark => ({
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
      amenities: organisationProfile.propertyDetails.facilities.map(facility => ({
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

    return NextResponse.json(hostelProfileData);
  } catch (error) {
    console.error("Error auto-populating hostel profile:", error);
    return NextResponse.json(
      { error: "Failed to auto-populate hostel profile" },
      { status: 500 }
    );
  }
}