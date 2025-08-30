import { NextResponse } from "next/server";
import { BlockProfile } from "@/lib/mongoose/models/block-profile.model";
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
      // If profile doesn't exist, create new one
      profile = await BlockProfile.create({
        ...profileData,
        block: params.blockId,
      });
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

    const profile = await BlockProfile.create({
      ...profileData,
      block: params.blockId,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating block profile:", error);
    return NextResponse.json(
      { error: "Failed to create block profile" },
      { status: 500 }
    );
  }
}