import { NextResponse } from "next/server";
import { BlockProfile } from "@/lib/mongoose/models/block-profile.model";
import { HostelProfile } from "@/lib/mongoose/models/hostel-profile.model";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();

    const profile = await BlockProfile.findOne({ block: params.blockId });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch block profile" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();
    const profileData = await req.json();

    // First check if profile exists
    let profile = await BlockProfile.findOne({ block: params.blockId });

    if (!profile) {
      // If profile doesn't exist, create new one with hostel data as fallback
      const block = await Block.findById(params.blockId).populate('hostel');
      let hostelProfile = null;
      
      if (block && block.hostel) {
        try {
          hostelProfile = await HostelProfile.findOne({ hostel: block.hostel });
        } catch (error) {
          console.log("No hostel profile found");
        }
      }
      
      // Merge hostel profile data with block profile data
      const mergedData = {
        ...profileData,
        block: params.blockId,
        basicInfo: {
          name: profileData.basicInfo?.name || block?.name || "",
          description: profileData.basicInfo?.description || "",
          address: profileData.basicInfo?.address || hostelProfile?.basicInfo?.address || "",
          landmark: profileData.basicInfo?.landmark || hostelProfile?.basicInfo?.landmark || "",
          city: profileData.basicInfo?.city || hostelProfile?.basicInfo?.city || "",
          state: profileData.basicInfo?.state || hostelProfile?.basicInfo?.state || "",
          pincode: profileData.basicInfo?.pincode || hostelProfile?.basicInfo?.pincode || "",
          contactNumber: profileData.basicInfo?.contactNumber || hostelProfile?.basicInfo?.contactNumber || "",
          email: profileData.basicInfo?.email || hostelProfile?.basicInfo?.email || "",
        },
        propertyDetails: {
          totalFloors: profileData.propertyDetails?.totalFloors || 1,
          totalRooms: profileData.propertyDetails?.totalRooms || 1,
          accommodationType: profileData.propertyDetails?.accommodationType || hostelProfile?.propertyDetails?.type || 'boys',
          establishedYear: profileData.propertyDetails?.establishedYear || new Date().getFullYear(),
          buildingType: profileData.propertyDetails?.buildingType || 'independent',
        },
        locationInfo: {
          googleMapLink: profileData.locationInfo?.googleMapLink || hostelProfile?.locationFactors?.googleMapLink || "",
          nearbyLandmarks: profileData.locationInfo?.nearbyLandmarks || hostelProfile?.locationFactors?.nearbyLandmarks || [],
          transportConnectivity: profileData.locationInfo?.transportConnectivity || [],
        },
        amenities: profileData.amenities || [],
        safetyFeatures: profileData.safetyFeatures || [],
        media: {
          photos: profileData.media?.photos || [],
          virtualTourLink: profileData.media?.virtualTourLink || "",
        },
      };
      
      profile = await BlockProfile.create(mergedData);
    } else {
      // If profile exists, update it
      profile = await BlockProfile.findOneAndUpdate(
        { block: params.blockId },
        { ...profileData, block: params.blockId },
        { 
          new: true,
          runValidators: true 
        }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating block profile:", error);
    return NextResponse.json(
      { error: "Failed to update block profile" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();
    const profileData = await req.json();

    const existingProfile = await BlockProfile.findOne({ block: params.blockId });
    
    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    // Get hostel data to pre-populate block profile
    const block = await Block.findById(params.blockId).populate('hostel');
    let hostelProfile = null;
    
    if (block && block.hostel) {
      try {
        hostelProfile = await HostelProfile.findOne({ hostel: block.hostel });
      } catch (error) {
        console.log("No hostel profile found");
      }
    }
    
    // Merge hostel profile data with block profile data
    const mergedData = {
      ...profileData,
      block: params.blockId,
      basicInfo: {
        name: profileData.basicInfo?.name || block?.name || "",
        description: profileData.basicInfo?.description || "",
        address: profileData.basicInfo?.address || hostelProfile?.basicInfo?.address || "",
        landmark: profileData.basicInfo?.landmark || hostelProfile?.basicInfo?.landmark || "",
        city: profileData.basicInfo?.city || hostelProfile?.basicInfo?.city || "",
        state: profileData.basicInfo?.state || hostelProfile?.basicInfo?.state || "",
        pincode: profileData.basicInfo?.pincode || hostelProfile?.basicInfo?.pincode || "",
        contactNumber: profileData.basicInfo?.contactNumber || hostelProfile?.basicInfo?.contactNumber || "",
        email: profileData.basicInfo?.email || hostelProfile?.basicInfo?.email || "",
      },
      propertyDetails: {
        totalFloors: profileData.propertyDetails?.totalFloors || 1,
        totalRooms: profileData.propertyDetails?.totalRooms || 1,
        accommodationType: profileData.propertyDetails?.accommodationType || hostelProfile?.propertyDetails?.type || 'boys',
        establishedYear: profileData.propertyDetails?.establishedYear || new Date().getFullYear(),
        buildingType: profileData.propertyDetails?.buildingType || 'independent',
      },
      locationInfo: {
        googleMapLink: profileData.locationInfo?.googleMapLink || hostelProfile?.locationFactors?.googleMapLink || "",
        nearbyLandmarks: profileData.locationInfo?.nearbyLandmarks || hostelProfile?.locationFactors?.nearbyLandmarks || [],
        transportConnectivity: profileData.locationInfo?.transportConnectivity || [],
      },
      amenities: profileData.amenities || [],
      safetyFeatures: profileData.safetyFeatures || [],
      media: {
        photos: profileData.media?.photos || [],
        virtualTourLink: profileData.media?.virtualTourLink || "",
      },
    };
    
    const profile = await BlockProfile.create(mergedData);

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating block profile:", error);
    return NextResponse.json(
      { error: "Failed to create block profile" },
      { status: 500 }
    );
  }
}