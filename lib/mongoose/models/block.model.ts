import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlock extends Document {
  name: string;
  description?: string;
  hostelId: string;
  userId: string;
  rentGenerationDay: string;
  rentGenerationEnabled: boolean;
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
    hostelId: {
      type: String,
      required: [true, 'Please provide a hostel ID'],
    },
    userId: {
      type: String,
      required: [true, 'Please provide a user ID'],
    },
    rentGenerationDay: {
      type: String,
      default: "1",
    },
    rentGenerationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Block = (mongoose.models.Block as Model<IBlock>) ||
  mongoose.model<IBlock>('Block', blockSchema);