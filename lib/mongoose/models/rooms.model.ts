import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  floor: number;
  type: 'single' | 'double' | 'triple' | 'dormitory';
  capacity: number;
  price: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'reserved';
  amenities: string[];
  organisation: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const roomsSchema = new Schema<IRoom>(
  {
    type: {
      type: String,
      enum: ['single', 'double', 'triple', 'dormitory'],
      required: [true, 'Please provide a room type'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide room price'],
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      required: [true, 'Please provide the organisation ID'],
    },
  },
  {
    timestamps: true,
  }
);

export const Rooms = (mongoose.models.Room as Model<IRoom>) ||
  mongoose.model<IRoom>('Room', roomsSchema);