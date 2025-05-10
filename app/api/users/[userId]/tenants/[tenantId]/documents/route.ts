import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/client";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    const { tenantId } = params;
    const { type, url } = await request.json();

    if (!type || !url) {
      return NextResponse.json(
        { error: "Document type and URL are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // First check if tenant exists
    const existingTenant = await Tenant.findById(tenantId);
    if (!existingTenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }
          
    // Add document to tenant
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { 
        $push: { 
          documents: { type, url } 
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updatedTenant) {
      return NextResponse.json(
        { error: "Failed to update tenant" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Document added successfully",
      document: { type, url }
    });
  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.json(
      { error: "Failed to add document" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    const { tenantId } = params;

    await connectDB();

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tenant.documents || []);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; tenantId: string } }
) {
  try {
    const { tenantId } = params;
    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Convert string ID to ObjectId
    let docId;
    try {
      docId = new mongoose.Types.ObjectId(documentId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid document ID format" },
        { status: 400 }
      );
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { 
        $pull: { 
          documents: { _id: docId } 
        } 
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Document deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
} 