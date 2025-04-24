import { NextResponse } from "next/server";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, description, userId, hostelId } = await req.json();

    if (!name || !userId || !hostelId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const block = await Block.create({
      name,
      description,
      userId,
      hostelId,
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error("Error creating block:", error);
    return NextResponse.json(
      { error: "Failed to create block" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const blocks = await Block.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocks" },
      { status: 500 }
    );
  }
}