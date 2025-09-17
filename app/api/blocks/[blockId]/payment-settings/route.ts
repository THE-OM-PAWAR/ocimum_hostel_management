import { NextResponse } from "next/server";
import { Block } from "@/lib/mongoose/models/block.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  try {
    await connectDB();

    const block = await Block.findById(params.blockId).select(
      "rentGenerationDay rentGenerationEnabled paymentGenerationType paymentVisibilityDays"
    ).lean();

    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    return NextResponse.json({
      rentGenerationDay: block.rentGenerationDay || "1",
      rentGenerationEnabled: block.rentGenerationEnabled ?? true,
      paymentGenerationType: (block as any).paymentGenerationType || 'join_date_based',
      paymentVisibilityDays: (block as any).paymentVisibilityDays || 2,
    });
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment settings" },
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
    const body = await req.json();
    const { rentGenerationDay, rentGenerationEnabled, paymentGenerationType, paymentVisibilityDays } = body;

    const block = await Block.findByIdAndUpdate(
      params.blockId,
      {
        rentGenerationDay,
        rentGenerationEnabled,
        paymentGenerationType,
        paymentVisibilityDays,
      },
      {
        new: true,
        runValidators: true,
        strict: false,
      }
    ).select("rentGenerationDay rentGenerationEnabled paymentGenerationType paymentVisibilityDays");

    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    return NextResponse.json({
      rentGenerationDay: block.rentGenerationDay,
      rentGenerationEnabled: block.rentGenerationEnabled,
      paymentGenerationType: (block as any).paymentGenerationType,
      paymentVisibilityDays: (block as any).paymentVisibilityDays,
    });
  } catch (error) {
    console.error("Error updating payment settings:", error);
    return NextResponse.json(
      { error: "Failed to update payment settings" },
      { status: 500 }
    );
  }
}
