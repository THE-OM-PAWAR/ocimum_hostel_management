import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHostel extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalRooms: number;
  totalFloors: number;
  amenities: string[];
  owner: mongoose.Types.ObjectId;
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
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide a state'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a zip code'],
      trim: true,
    },
    totalRooms: {
      type: Number,
      required: [true, 'Please provide total number of rooms'],
    },
    totalFloors: {
      type: Number,
      required: [true, 'Please provide total number of floors'],
    },
    amenities: [{
      type: String,
      trim: true,
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the hostel owner'],
    },
  },
  {
    timestamps: true,
  }
);

export const Hostel = (mongoose.models.Hostel as Model<IHostel>) ||
  mongoose.model<IHostel>('Hostel', hostelSchema);