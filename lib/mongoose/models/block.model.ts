import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlock extends Document {
  name: string;
  description?: string;
  hostel: mongoose.Types.ObjectId;
  rentGenerationDay: string;
  rentGenerationEnabled: boolean;
  paymentGenerationType: 'global' | 'join_date_based';
  paymentVisibilityDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const blockSchema = new Schema<IBlock>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a block name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Please provide a hostel ID'],
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

export const Block = (mongoose.models.Block as Model<IBlock>) ||
  mongoose.model<IBlock>('Block', blockSchema);