import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'tenant';
  ownerName: string;
  hostelName: string;
  phoneNumber: string;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId : {
      type: String,
      required: [true, 'Please provide a userId'],
      unique: true,},
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'staff', 'tenant'],
      default: 'admin',
    },
    ownerName: {
      type: String,
      trim: true,
    },
    hostelName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
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