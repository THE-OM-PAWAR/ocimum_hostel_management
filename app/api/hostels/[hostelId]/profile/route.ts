import { NextResponse } from "next/server";
import { HostelProfile } from "@/lib/mongoose/models/hostel-profile.model";
import "@/lib/mongoose/models/hostel.model";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();

    const profile = await HostelProfile.findOne({ hostel: params.hostelId });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hostel profile" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();
    const profileData = await req.json();

    // First check if profile exists
    let profile = await HostelProfile.findOne({ hostel: params.hostelId });

    if (!profile) {
      // If profile doesn't exist, create new one
      const hostel = await Hostel.findById(params.hostelId);
      
      const mergedData = {
        ...profileData,
        hostel: params.hostelId,
        basicInfo: {
          name: profileData.basicInfo?.name || hostel?.name || "",
          description: profileData.basicInfo?.description || "",
          address: profileData.basicInfo?.address || "",
          landmark: profileData.basicInfo?.landmark || "",
          city: profileData.basicInfo?.city || "",
          state: profileData.basicInfo?.state || "",
          pincode: profileData.basicInfo?.pincode || "",
          contactNumber: profileData.basicInfo?.contactNumber || "",
          email: profileData.basicInfo?.email || "",
        },
        propertyDetails: {
          totalFloors: profileData.propertyDetails?.totalFloors || 1,
          totalRooms: profileData.propertyDetails?.totalRooms || 1,
          accommodationType: profileData.propertyDetails?.accommodationType || 'boys',
          establishedYear: profileData.propertyDetails?.establishedYear || new Date().getFullYear(),
          buildingType: profileData.propertyDetails?.buildingType || 'independent',
        },
        locationInfo: {
          googleMapLink: profileData.locationInfo?.googleMapLink || "",
          nearbyLandmarks: profileData.locationInfo?.nearbyLandmarks || [],
          transportConnectivity: profileData.locationInfo?.transportConnectivity || [],
        },
        amenities: profileData.amenities || [],
        safetyFeatures: profileData.safetyFeatures || [],
        media: {
          photos: profileData.media?.photos || [],
          virtualTourLink: profileData.media?.virtualTourLink || "",
        },
      };
      
      profile = await HostelProfile.create(mergedData);
    } else {
      // If profile exists, update it
      profile = await HostelProfile.findOneAndUpdate(
        { hostel: params.hostelId },
        { ...profileData, hostel: params.hostelId },
        { 
          new: true,
          runValidators: true 
        }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating hostel profile:", error);
    return NextResponse.json(
      { error: "Failed to update hostel profile" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();
    const profileData = await req.json();

    const existingProfile = await HostelProfile.findOne({ hostel: params.hostelId });
    
    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    // Create hostel profile
    const hostel = await Hostel.findById(params.hostelId);
    
    const mergedData = {
      ...profileData,
      hostel: params.hostelId,
      basicInfo: {
        name: profileData.basicInfo?.name || hostel?.name || "",
        description: profileData.basicInfo?.description || "",
        address: profileData.basicInfo?.address || "",
        landmark: profileData.basicInfo?.landmark || "",
        city: profileData.basicInfo?.city || "",
        state: profileData.basicInfo?.state || "",
        pincode: profileData.basicInfo?.pincode || "",
        contactNumber: profileData.basicInfo?.contactNumber || "",
        email: profileData.basicInfo?.email || "",
      },
      propertyDetails: {
        totalFloors: profileData.propertyDetails?.totalFloors || 1,
        totalRooms: profileData.propertyDetails?.totalRooms || 1,
        accommodationType: profileData.propertyDetails?.accommodationType || 'boys',
        establishedYear: profileData.propertyDetails?.establishedYear || new Date().getFullYear(),
        buildingType: profileData.propertyDetails?.buildingType || 'independent',
      },
      locationInfo: {
        googleMapLink: profileData.locationInfo?.googleMapLink || "",
        nearbyLandmarks: profileData.locationInfo?.nearbyLandmarks || [],
        transportConnectivity: profileData.locationInfo?.transportConnectivity || [],
      },
      amenities: profileData.amenities || [],
      safetyFeatures: profileData.safetyFeatures || [],
      media: {
        photos: profileData.media?.photos || [],
        virtualTourLink: profileData.media?.virtualTourLink || "",
      },
    };
    
    const profile = await HostelProfile.create(mergedData);

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating hostel profile:", error);
    return NextResponse.json(
      { error: "Failed to create hostel profile" },
      { status: 500 }
    );
  }
}