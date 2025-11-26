import { NextResponse } from "next/server";
import { OrganisationProfile } from "@/lib/mongoose/models/organisation-profile.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();


    const profile = await OrganisationProfile.findOne({ organisation: params.organisationId });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }


    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organisation profile" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();
    const profileData = await req.json();

    // First check if profile exists
    let profile = await OrganisationProfile.findOne({ organisation: params.organisationId });

    if (!profile) {
      // If profile doesn't exist, create new one
      profile = await OrganisationProfile.create({
        ...profileData,
        organisation: params.organisationId,
      });
    } else {
      // If profile exists, update it
      profile = await OrganisationProfile.findOneAndUpdate(
        { organisation: params.organisationId },
        { ...profileData, organisation: params.organisationId },
        { 
          new: true,
          runValidators: true 
        }
      );
    }


    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating organisation profile:", error);
    return NextResponse.json(
      { error: "Failed to update organisation profile" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { organisationId: string } }
) {
  try {
    await connectDB();
    const profileData = await req.json();

    const existingProfile = await OrganisationProfile.findOne({ organisation: params.organisationId });
    
    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    const profile = await OrganisationProfile.create({
      ...profileData,
      organisation: params.organisationId,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating organisation profile:", error);
    return NextResponse.json(
      { error: "Failed to create organisation profile" },
      { status: 500 }
    );
  }
}