import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRoomComponent extends Document {
  name: string;
  description: string;
  blockId: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomComponentSchema = new Schema<IRoomComponent>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a component name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    blockId: {
      type: String,
      required: [true, 'Please provide a block ID'],
    },
  },
  {
    timestamps: true,
  }
);

export const RoomComponent = (mongoose.models.RoomComponent as Model<IRoomComponent>) ||
  mongoose.model<IRoomComponent>('RoomComponent', roomComponentSchema);