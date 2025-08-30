import { NextResponse } from "next/server";
import { HostelProfile } from "@/lib/mongoose/models/hostel-profile.model";
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
      profile = await HostelProfile.create({
        ...profileData,
        hostel: params.hostelId,
      });
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

    const profile = await HostelProfile.create({
      ...profileData,
      hostel: params.hostelId,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating hostel profile:", error);
    return NextResponse.json(
      { error: "Failed to create hostel profile" },
      { status: 500 }
    );
  }
}