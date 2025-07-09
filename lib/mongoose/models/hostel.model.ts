import mongoose, { Document, Model, Schema } from 'mongoose';

interface HostelUser {
  userId: mongoose.Types.ObjectId;
  role: 'admin' | 'manager' | 'warden' | 'tenant' | 'pending';
  status: 'approved' | 'pending' | 'rejected';
  joinedAt: Date;
}

export interface IHostel extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  users: HostelUser[];
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const hostelUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'warden', 'tenant', 'pending'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const hostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a hostel name'],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the hostel owner'],
    },
    users: [hostelUserSchema],
    joinCode: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique join code before saving
hostelSchema.pre('save', function(next) {
  if (!this.joinCode) {
    this.joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export const Hostel = (mongoose.models.Hostel as Model<IHostel>) ||
  mongoose.model<IHostel>('Hostel', hostelSchema);