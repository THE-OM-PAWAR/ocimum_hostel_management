import mongoose, { Document, Model, Schema } from 'mongoose';

interface BlockPhoto {
  url: string;
  title: string;
  description?: string;
  type: 'boys' | 'girls' | 'common' | 'exterior' | 'interior' | 'amenities';
  isMain?: boolean;
}

export interface IBlockProfile extends Document {
  block: mongoose.Types.ObjectId;
  basicInfo: {
    name: string;
    description: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    contactNumber: string;
    email: string;
  };
  propertyDetails: {
    totalFloors: number;
    totalRooms: number;
    accommodationType: 'boys' | 'girls' | 'coed' | 'separate';
    establishedYear?: number;
    buildingType: 'independent' | 'apartment' | 'commercial';
  };
  locationInfo: {
    googleMapLink?: string;
    latitude?: number;
    longitude?: number;
    nearbyLandmarks: Array<{
      name: string;
      distance: string;
      type: 'hospital' | 'school' | 'market' | 'transport' | 'other';
    }>;
    transportConnectivity: Array<{
      mode: 'bus' | 'metro' | 'train' | 'auto';
      distance: string;
      details: string;
    }>;
  };
  media: {
    photos: BlockPhoto[];
    virtualTourLink?: string;
  };
  amenities: Array<{
    name: string;
    available: boolean;
    description?: string;
    floor?: string;
  }>;
  safetyFeatures: Array<{
    feature: string;
    available: boolean;
    details?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const blockPhotoSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['boys', 'girls', 'common', 'exterior', 'interior', 'amenities'],
    required: true,
  },
  isMain: { type: Boolean, default: false },
});

const blockProfileSchema = new Schema<IBlockProfile>(
  {
    block: {
      type: Schema.Types.ObjectId,
      ref: 'Block',
      required: true,
      unique: true,
    },
    basicInfo: {
      name: { type: String, required: true },
      description: { type: String, default: '' },
      address: { type: String, required: true },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
    propertyDetails: {
      totalFloors: { type: Number, required: true, min: 1 },
      totalRooms: { type: Number, required: true, min: 1 },
      accommodationType: {
        type: String,
        enum: ['boys', 'girls', 'coed', 'separate'],
        required: true,
      },
      establishedYear: { type: Number },
      buildingType: {
        type: String,
        enum: ['independent', 'apartment', 'commercial'],
        required: true,
      },
    },
    locationInfo: {
      googleMapLink: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      nearbyLandmarks: [{
        name: { type: String, required: true },
        distance: { type: String, required: true },
        type: {
          type: String,
          enum: ['hospital', 'school', 'market', 'transport', 'other'],
          required: true,
        },
      }],
      transportConnectivity: [{
        mode: {
          type: String,
          enum: ['bus', 'metro', 'train', 'auto'],
          required: true,
        },
        distance: { type: String, required: true },
        details: { type: String, required: true },
      }],
    },
    media: {
      photos: [blockPhotoSchema],
      virtualTourLink: { type: String },
    },
    amenities: [{
      name: { type: String, required: true },
      available: { type: Boolean, default: true },
      description: { type: String },
      floor: { type: String },
    }],
    safetyFeatures: [{
      feature: { type: String, required: true },
      available: { type: Boolean, default: true },
      details: { type: String },
    }],
  },
  {
    timestamps: true,
  }
);

export const BlockProfile = (mongoose.models.BlockProfile as Model<IBlockProfile>) ||
  mongoose.model<IBlockProfile>('BlockProfile', blockProfileSchema);