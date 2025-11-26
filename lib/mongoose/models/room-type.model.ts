import mongoose, { Document, Model, Schema } from 'mongoose';

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

export interface IRoomType extends Document {
  name: string;
  description: string;
  components: mongoose.Types.ObjectId[];
  rent: number;
  hostelId: string;
  images: RoomTypeImage[];
  createdAt: Date;
  updatedAt: Date;
}

const roomTypeImageSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  isCover: { type: Boolean, default: false },
});

const roomTypeSchema = new Schema<IRoomType>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a room type name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    components: {
      type: [Schema.Types.ObjectId],
      ref: 'RoomComponent',
      required: [true, 'Please provide at least one component'],
      validate: {
        validator: function(v: mongoose.Types.ObjectId[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one component is required'
      }
    },
    rent: {
      type: Number,
      required: [true, 'Please provide the monthly rent'],
      min: 0,
    },
    hostelId: {
      type: String,
      required: [true, 'Please provide a hostel ID'],
    },
    images: [roomTypeImageSchema],
  },
  {
    timestamps: true,
  }
);

export const RoomType = (mongoose.models.RoomType as Model<IRoomType>) ||
  mongoose.model<IRoomType>('RoomType', roomTypeSchema);