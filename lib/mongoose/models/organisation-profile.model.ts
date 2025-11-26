import mongoose, { Document, Model, Schema } from 'mongoose';

interface Facility {
  name: string;
  available: boolean;
  details?: string;
}

interface LocationFactor {
  name: string;
  distance: string;
  description?: string;
}

export interface IOrganisationProfile extends Document {
  organisation: mongoose.Types.ObjectId;
  isOnlinePresenceEnabled: boolean;
  basicInfo: {
    state: string;
    name: string;
    address: string;
    landmark: string;
    city: string;
    pincode: string;
    contactNumber: string;
    email: string;
  };
  propertyDetails: {
    type: 'boys' | 'girls' | 'coed' | 'separate';
    facilities: Facility[];
    foodService: {
      available: boolean;
      type?: 'veg' | 'nonveg' | 'both';
      details?: string;
    };
  };
  rulesAndPolicies: string; // Markdown content
  media: {
    bannerImage?: string;
    profileImage?: string;
    galleryImages: string[];
  };
  locationFactors: {
    nearbyLandmarks: LocationFactor[];
    googleMapLink?: string;
    coachingCenters: LocationFactor[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const facilitySchema = new Schema({
  name: { type: String, required: true },
  available: { type: Boolean, default: false },
  details: { type: String },
});

const locationFactorSchema = new Schema({
  name: { type: String, required: true },
  distance: { type: String, required: true },
  description: { type: String },
});

const organisationProfileSchema = new Schema<IOrganisationProfile>(
  {
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
      unique: true,
    },
    isOnlinePresenceEnabled: {
      type: Boolean,
      default: false,
    },
    basicInfo: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
    propertyDetails: {
      type: {
        type: String,
        enum: ['boys', 'girls', 'coed', 'separate'],
        required: true,
      },
      facilities: [facilitySchema],
      foodService: {
        available: { type: Boolean, default: false },
        type: {
          type: String,
          enum: ['veg', 'nonveg', 'both'],
        },
        details: { type: String },
      },
    },
    rulesAndPolicies: {
      type: String,
      default: '',
    },
    media: {
      bannerImage: { type: String },
      profileImage: { type: String },
      galleryImages: [{ type: String }],
    },
    locationFactors: {
      nearbyLandmarks: [locationFactorSchema],
      googleMapLink: { type: String },
      coachingCenters: [locationFactorSchema],
    },
  },
  {
    timestamps: true,
  }
);

export const OrganisationProfile = (mongoose.models.OrganisationProfile as Model<IOrganisationProfile>) ||
  mongoose.model<IOrganisationProfile>('OrganisationProfile', organisationProfileSchema);