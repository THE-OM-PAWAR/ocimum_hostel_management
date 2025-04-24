import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPayment extends Document {
  tenant: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  hostel: mongoose.Types.ObjectId;
  amount: number;
  month: string;
  year: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
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
    hostel: {
      type: Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Please provide the hostel ID'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide the payment amount'],
    },
    month: {
      type: String,
      required: [true, 'Please provide the month'],
    },
    year: {
      type: Number,
      required: [true, 'Please provide the year'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide the due date'],
    },
    paidDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    receiptNumber: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>('Payment', paymentSchema);