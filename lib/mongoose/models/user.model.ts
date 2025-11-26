import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  ownerName: string;
  phoneNumber: string;
  role: 'admin' | 'manager' | 'warden' | 'tenant' | 'pending';
  organisation?: mongoose.Types.ObjectId;
  assignedHostels: mongoose.Types.ObjectId[];
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: [true, 'Please provide a userId'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Please provide owner name'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'warden', 'tenant', 'pending'],
      default: 'pending',
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
    },
    assignedHostels: [{
      type: Schema.Types.ObjectId,
      ref: 'Hostel',
    }],
    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', userSchema);