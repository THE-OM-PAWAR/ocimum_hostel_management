import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  floor: number;
  type: 'single' | 'double' | 'triple' | 'dormitory';
  capacity: number;
  price: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'reserved';
  amenities: string[];
  hostel: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      trim: true,
    },
    floor: {
      type: Number,
      required: [true, 'Please provide a floor number'],
    },
    type: {
      type: String,
      enum: ['single', 'double', 'triple', 'dormitory'],
      required: [true, 'Please provide a room type'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide room capacity'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide room price'],
    },
    status: {
      type: String,
      enum: ['vacant', 'occupied', 'maintenance', 'reserved'],
      default: 'vacant',
    },
    amenities: [{
      type: String,
      trim: true,
    }],
    hostel: {
      type: Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Please provide the hostel ID'],
    },
  },
  {
    timestamps: true,
  }
);

export const Room = (mongoose.models.Room as Model<IRoom>) ||
  mongoose.model<IRoom>('Room', roomSchema);