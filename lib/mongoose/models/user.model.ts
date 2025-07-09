import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  ownerName: string;
  phoneNumber: string;
  role: 'admin' | 'manager' | 'warden' | 'tenant' | 'pending';
  hostel?: mongoose.Types.ObjectId;
  assignedBlocks: mongoose.Types.ObjectId[];
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
    hostel: {
      type: Schema.Types.ObjectId,
      ref: 'Hostel',
    },
    assignedBlocks: [{
      type: Schema.Types.ObjectId,
      ref: 'Block',
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