import { NextResponse } from "next/server";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";   


export async function GET(req: Request) {
  try {
    await connectDB();
    console.log("Fetching block data...");
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get('id');

    if (!blockId) {
      return NextResponse.json(
        { error: "Block ID is required" },
        { status: 400 }
      );
    }

    const block = await Block.findById(blockId);
    return NextResponse.json(block);
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch block" },
      { status: 500 }
    );
  }
}