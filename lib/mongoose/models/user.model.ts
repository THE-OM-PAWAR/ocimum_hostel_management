import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'tenant';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'staff', 'tenant'],
      default: 'tenant',
    },
  },
  {
    timestamps: true,
  }
);

// Use mongoose.models to check if the model already exists
// to prevent overwriting during hot reloads in development
export const User = (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', userSchema);