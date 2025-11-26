import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import connectDB from "@/lib/mongodb/client";   


export async function GET(req: Request, { params }: { params: {hostelId: string } }) {
  try {
    await connectDB();
    const { hostelId } = params;  
    if (!hostelId) {
      return NextResponse.json(
        { error: "Hostel ID is required" },
        { status: 400 }
      );
    }
    const hostel = await Hostel.findById(hostelId);
    return NextResponse.json(hostel);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hostel" },
      { status: 500 }
    );
  }
} 