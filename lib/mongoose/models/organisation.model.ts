import mongoose, { Document, Model, Schema } from 'mongoose';

interface OrganisationUser {
  userId: mongoose.Types.ObjectId;
  role: 'admin' | 'manager' | 'warden' | 'tenant' | 'pending';
  status: 'approved' | 'pending' | 'rejected';
  joinedAt: Date;
}

export interface IOrganisation extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  users: OrganisationUser[];
  joinCode: string;
  isOnlinePresenceEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const organisationUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'warden', 'tenant', 'pending'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const organisationSchema = new Schema<IOrganisation>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a organisation name'],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the organisation owner'],
    },
    users: [organisationUserSchema],
    joinCode: {
      type: String,
      unique: true,
      required: true,
    },
    isOnlinePresenceEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique join code before saving
organisationSchema.pre('save', function(next) {
  if (!this.joinCode) {
    this.joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export const Organisation = (mongoose.models.Organisation as Model<IOrganisation>) ||
  mongoose.model<IOrganisation>('Organisation', organisationSchema);