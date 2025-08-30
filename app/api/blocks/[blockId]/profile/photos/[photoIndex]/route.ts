import { NextResponse } from "next/server";
import { BlockProfile } from "@/lib/mongoose/models/block-profile.model";
import connectDB from "@/lib/mongodb/client";

export async function DELETE(
  req: Request,
  { params }: { params: { blockId: string; photoIndex: string } }
) {
  try {
    await connectDB();
    const photoIndex = parseInt(params.photoIndex);

    if (isNaN(photoIndex)) {
      return NextResponse.json(
        { error: "Invalid photo index" },
        { status: 400 }
      );
    }

    const profile = await BlockProfile.findOne({ block: params.blockId });

    if (!profile) {
      return NextResponse.json(
        { error: "Block profile not found" },
        { status: 404 }
      );
    }

    if (photoIndex < 0 || photoIndex >= profile.media.photos.length) {
      return NextResponse.json(
        { error: "Photo index out of range" },
        { status: 400 }
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

export async function PUT(
  req: Request,
  { params }: { params: { blockId: string; photoIndex: string } }
) {
  try {
    await connectDB();
    const photoIndex = parseInt(params.photoIndex);
    const { isMain } = await req.json();

    if (isNaN(photoIndex)) {
      return NextResponse.json(
        { error: "Invalid photo index" },
        { status: 400 }
      );
    }

    const profile = await BlockProfile.findOne({ block: params.blockId });

    if (!profile) {
      return NextResponse.json(
        { error: "Block profile not found" },
        { status: 404 }
      );
    }

    if (photoIndex < 0 || photoIndex >= profile.media.photos.length) {
      return NextResponse.json(
        { error: "Photo index out of range" },
        { status: 400 }
      );
    }

    // If setting as main photo, remove main flag from other photos
    if (isMain) {
      profile.media.photos = profile.media.photos.map((photo, index) => ({
        ...photo,
        isMain: index === photoIndex,
      }));
    }

    await profile.save();

    return NextResponse.json({ message: "Photo updated successfully" });
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    );
  }
}