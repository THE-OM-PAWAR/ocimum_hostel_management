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
  paymentStatus: 'paid' | 'pending' | 'overdue';
  status: 'active' | 'inactive' | 'pending';
  address?: string;
  pinCode?: string;
  paymentHistory?: {
    month: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    paidOn?: string;
  }[];
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
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    address: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    paymentHistory: [{
      month: String,
      amount: Number,
      status: {
        type: String,
        enum: ['paid', 'pending', 'overdue'],
      },
      paidOn: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Tenant = (mongoose.models.Tenant as Model<ITenant>) ||
  mongoose.model<ITenant>('Tenant', tenantSchema);