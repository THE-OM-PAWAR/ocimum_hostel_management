import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITenant extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  emergencyContact: string;
  idType: string;
  idNumber: string;
  checkInDate: Date;
  plannedCheckOutDate?: Date;
  actualCheckOutDate?: Date;
  room: mongoose.Types.ObjectId;
  hostel: mongoose.Types.ObjectId;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user account'],
    },
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    emergencyContact: {
      type: String,
      required: [true, 'Please provide an emergency contact'],
      trim: true,
    },
    idType: {
      type: String,
      required: [true, 'Please provide ID type'],
      trim: true,
    },
    idNumber: {
      type: String,
      required: [true, 'Please provide ID number'],
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Please provide the room ID'],
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Please provide the hostel ID'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Tenant = (mongoose.models.Tenant as Model<ITenant>) ||
  mongoose.model<ITenant>('Tenant', tenantSchema);