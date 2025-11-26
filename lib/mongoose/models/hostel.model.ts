import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHostel extends Document {
  name: string;
  description?: string;
  organisation: mongoose.Types.ObjectId;
  rentGenerationDay: string;
  rentGenerationEnabled: boolean;
  paymentGenerationType: 'global' | 'join_date_based';
  paymentVisibilityDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const hostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a hostel name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      required: [true, 'Please provide a organisation ID'],
    },
    rentGenerationDay: {
      type: String,
      default: "1",
    },
    rentGenerationEnabled: {
      type: Boolean,
      default: true,
    },
    paymentGenerationType: {
      type: String,
      enum: ['global', 'join_date_based'],
      default: 'join_date_based',
    },
    paymentVisibilityDays: {
      type: Number,
      default: 2,
      min: 1,
      max: 30,
    },
  },
  {
    timestamps: true,
  }
);

export const Hostel = (mongoose.models.Hostel as Model<IHostel>) ||
  mongoose.model<IHostel>('Hostel', hostelSchema);