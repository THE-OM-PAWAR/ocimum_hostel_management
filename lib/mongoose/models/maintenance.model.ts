import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMaintenance extends Document {
  title: string;
  description: string;
  tenant: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  organisation: mongoose.Types.ObjectId;
  issueType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: mongoose.Types.ObjectId;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceSchema = new Schema<IMaintenance>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Please provide the tenant ID'],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Please provide the room ID'],
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      required: [true, 'Please provide the organisation ID'],
    },
    issueType: {
      type: String,
      required: [true, 'Please provide the issue type'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    estimatedCompletionDate: {
      type: Date,
    },
    actualCompletionDate: {
      type: Date,
    },
    images: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Maintenance = (mongoose.models.Maintenance as Model<IMaintenance>) ||
  mongoose.model<IMaintenance>('Maintenance', maintenanceSchema);