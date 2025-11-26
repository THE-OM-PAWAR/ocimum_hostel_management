import { NextResponse } from "next/server";
import { HostelProfile } from "@/lib/mongoose/models/hostel-profile.model";
import "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();
    const { url, title, description, type, isMain } = await req.json();

    if (!url || !title || !type) {
      return NextResponse.json(
        { error: "URL, title, and type are required" },
        { status: 400 }
      );
    }

    let profile = await HostelProfile.findOne({ hostel: params.hostelId });

    if (!profile) {
      return NextResponse.json(
        { error: "Hostel profile not found" },
        { status: 404 }
      );
    }

    // If this is set as main photo, remove main flag from other photos
    if (isMain) {
      profile.media.photos = profile.media.photos.map(photo => ({
        ...photo,
        isMain: false,
      }));
    }

    // Add new photo
    profile.media.photos.push({
      url,
      title,
      description,
      type,
      isMain: isMain || profile.media.photos.length === 0, // First photo is main by default
    });

    await profile.save();

    return NextResponse.json({ message: "Photo added successfully" });
  } catch (error) {
    console.error("Error adding photo:", error);
    return NextResponse.json(
      { error: "Failed to add photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { hostelId: string } }
) {
  try {
    await connectDB();
    const { photoIndex } = await req.json();

    if (photoIndex === undefined) {
      return NextResponse.json(
        { error: "Photo index is required" },
        { status: 400 }
      );
    }

    const profile = await HostelProfile.findOne({ hostel: params.hostelId });

    if (!profile) {
      return NextResponse.json(
        { error: "Hostel profile not found" },
        { status: 404 }
      );
    }

    // Remove photo at specified index
    profile.media.photos.splice(photoIndex, 1);

    // If removed photo was main and there are other photos, make first one main
    if (profile.media.photos.length > 0 && !profile.media.photos.some(p => p.isMain)) {
      profile.media.photos[0].isMain = true;
    }

    await profile.save();

    return NextResponse.json({ message: "Photo removed successfully" });
  } catch (error) {
    console.error("Error removing photo:", error);
    return NextResponse.json(
      { error: "Failed to remove photo" },
      { status: 500 }
    );
  }
}