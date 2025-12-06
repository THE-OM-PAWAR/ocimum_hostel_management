import { NextResponse } from "next/server";
import { User } from "@/lib/mongoose/models/user.model";
import { Organisation } from "@/lib/mongoose/models/organisation.model";
import connectDB from "@/lib/mongodb/client";
import mongoose from "mongoose";
import { Hostel } from "@/lib/mongoose/models/hostel.model";

export async function POST(req: Request) {
  try {
    const { 
      organisationName, 
      ownerName, 
      phoneNumber, 
      userId, 
      email,
      hostelName,
      description 
    } = await req.json();
    
    if (!userId || !organisationName || !email || !ownerName || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use hostelName if provided, otherwise use organisationName
    const finalHostelName = hostelName || organisationName;

    await connectDB();
    
    // Check if user already exists and is onboarded
    const existingUser = await User.findOne({ userId });
    if (existingUser && existingUser.isOnboarded) {
      return NextResponse.json(
        { error: "User is already onboarded" },
        { status: 400 }
      );
    }

    // Create or update user with all information
    // IMPORTANT: isOnboarded remains false - more onboarding steps will be added later
    let user;
    if (existingUser) {
      user = await User.findByIdAndUpdate(existingUser._id, {
        ownerName,
        phoneNumber,
        email,
        role: 'admin',
        isOnboarded: false, // Keep false - onboarding not complete yet
      }, { new: true });
    } else {
      user = await User.create({
        userId,
        email,
        ownerName,
        phoneNumber,
        role: 'admin',
        isOnboarded: false, // Keep false - onboarding not complete yet
      });
    }

    // Generate unique join code
    let joinCode;
    let isUnique = false;
    while (!isUnique) {
      joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingOrganisation = await Organisation.findOne({ joinCode });
      if (!existingOrganisation) {
        isUnique = true;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create or update user" },
        { status: 500 }
      );
    }

    // Create organisation
    const organisation = await Organisation.create({
      name: organisationName,
      owner: user._id,
      joinCode,
      users: [{
        userId: user._id,
        role: 'admin',
        status: 'approved',
        joinedAt: new Date(),
      }],
    });

    // Update user with organisation reference
    // IMPORTANT: isOnboarded remains false - there are 2-3 more onboarding forms remaining
    await User.findByIdAndUpdate(user._id, {
      organisation: organisation._id,
      role: 'admin',
      isOnboarded: false, // Keep false - onboarding not complete yet (2-3 more steps remaining)
    });

    // Create hostel for the organisation (saved to database)
    const hostel = await Hostel.create({
      name: finalHostelName,
      description: description || `Main hostel for ${organisationName}`,
      organisation: organisation._id,
    });

    // Add the hostel to admin's assignedHostels array (saved to database)
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { assignedHostels: hostel._id }
    });

    // Create basic room components automatically
    const { RoomComponent } = await import("@/lib/mongoose/models/room-component.model");
    const basicComponents = [
      { name: "Bed", description: "Single/double bed with mattress" },
      { name: "Study Table", description: "Wooden study table with drawers" },
      { name: "Chair", description: "Comfortable study chair" },
      { name: "Almirah/Wardrobe", description: "Storage wardrobe for clothes" },
      { name: "Ceiling Fan", description: "Electric ceiling fan" },
      { name: "Tube Light", description: "LED tube light for room lighting" },
      { name: "Dustbin", description: "Small waste bin for room" },
      { name: "Mirror", description: "Wall-mounted mirror" },
      { name: "Window Curtains", description: "Privacy curtains for windows" },
      { name: "Mattress", description: "Comfortable sleeping mattress" },
      { name: "Pillow", description: "Sleeping pillow with cover" },
      { name: "Blanket", description: "Warm blanket for sleeping" },
      { name: "Study Lamp", description: "Table lamp for reading" },
      { name: "Bookshelf", description: "Small shelf for books and items" },
      { name: "Water Bottle", description: "Personal water bottle" },
    ];

    const createdComponents = await Promise.all(
      basicComponents.map(component  =>
        RoomComponent.create({
          ...component,
          hostelId: (hostel._id as mongoose.Types.ObjectId).toString(),
        })
      )
    );
    
    // All data has been saved: User, Organisation, Hostel, Room Components
    // But isOnboarded remains false - more onboarding steps will follow
    return NextResponse.json({
      message: "Organisation and hostel created successfully. Onboarding continues...",
      organisation: {
        id: organisation._id,
        name: organisation.name,
        joinCode: organisation.joinCode,
      },
      hostel: {
        id: hostel._id,
        name: hostel.name,
      },
      componentsCreated: createdComponents.length,
      isOnboarded: false, // Explicitly return false to confirm onboarding is not complete
    });
  } catch (error) {
    console.error("Error in organisation creation:", error);
    return NextResponse.json(
      { error: "Failed to create organisation" },
      { status: 500 }
    );
  }
}