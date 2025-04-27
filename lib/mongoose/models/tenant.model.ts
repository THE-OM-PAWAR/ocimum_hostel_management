import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  phone: string;
  email: string;
  emergencyContact: string;
  idType: string;
  idNumber: string;
  joinDate: Date;
  roomNumber: string;
  roomType: string;
  block: mongoose.Types.ObjectId;
  status: 'active' | 'left' | 'blacklisted' | 'pending';
  statusChangeDate?: Date;
  statusChangeReason?: string;
  address?: string;
  pinCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    email: {
      type: String,
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
    joinDate: {
      type: Date,
      required: [true, 'Please provide join date'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
    },
    roomType: {
      type: String,
      required: [true, 'Please provide room type'],
    },
    block: {
      type: Schema.Types.ObjectId,
      ref: 'Block',
      required: [true, 'Please provide the block ID'],
    },
    status: {
      type: String,
      enum: ['active', 'left', 'blacklisted', 'pending'],
      default: 'pending',
    },
    statusChangeDate: {
      type: Date,
    },
    statusChangeReason: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tenant = (mongoose.models.Tenant as Model<ITenant>) ||
  mongoose.model<ITenant>('Tenant', tenantSchema);