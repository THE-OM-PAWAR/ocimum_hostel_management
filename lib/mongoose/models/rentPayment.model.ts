import mongoose, { Document, Model, Schema } from 'mongoose';

interface ChangeLogEntry {
  type: 'edit' | 'delete';
  date: Date;
  changes?: {
    amount?: { from: number; to: number };
    status?: { from: string; to: string };
    paymentMethod?: { from: string; to: string };
  };
  message: string;
}

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
  status: 'pending' | 'paid' | 'overdue' | 'undefined' | 'cancelled';
  type: 'monthly' | 'additional';
  label?: string;
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber?: string;
  description?: string;
  changeLog?: ChangeLogEntry[];
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
      enum: ['pending', 'paid', 'overdue', 'undefined', 'cancelled'],
      default: 'undefined',
    },
    type: {
      type: String,
      enum: ['monthly', 'additional'],
      required: [true, 'Please provide the rent type'],
    },
    label: {
      type: String,
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
    changeLog: [{
      type: {
        type: String,
        enum: ['edit', 'delete'],
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      changes: {
        amount: {
          from: Number,
          to: Number,
        },
        status: {
          from: String,
          to: String,
        },
        paymentMethod: {
          from: String,
          to: String,
        },
      },
      message: {
        type: String,
        required: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Create a compound unique index to prevent duplicate monthly rents
rentPaymentSchema.index(
  { tenant: 1, month: 1, year: 1, type: 1 },
  { unique: true, partialFilterExpression: { type: 'monthly' } }
);

export const RentPayment = (mongoose.models.RentPayment as Model<IRentPayment>) ||
  mongoose.model<IRentPayment>('RentPayment', rentPaymentSchema);