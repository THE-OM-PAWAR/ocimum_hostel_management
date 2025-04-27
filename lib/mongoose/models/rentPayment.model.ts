import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRentPayment extends Document {
  tenant: mongoose.Types.ObjectId;
  block: mongoose.Types.ObjectId;
  roomNumber: string;
  roomType: string;
  amount: number;
  month: string;
  year: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'undefined';
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rentPaymentSchema = new Schema<IRentPayment>(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Please provide the tenant ID'],
    },
    block: {
      type: Schema.Types.ObjectId,
      ref: 'Block',
      required: [true, 'Please provide the block ID'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Please provide the room number'],
    },
    roomType: {
      type: String,
      required: [true, 'Please provide the room type'],
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
      enum: ['pending', 'paid', 'overdue', 'undefined'],
      default: 'undefined',
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

export const RentPayment = (mongoose.models.RentPayment as Model<IRentPayment>) ||
  mongoose.model<IRentPayment>('RentPayment', rentPaymentSchema);