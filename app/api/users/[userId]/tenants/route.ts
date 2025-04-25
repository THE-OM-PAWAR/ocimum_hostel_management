import { NextResponse } from "next/server";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import connectDB from "@/lib/mongodb/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const tenant = await Tenant.create(data);

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}