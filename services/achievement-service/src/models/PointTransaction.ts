import mongoose, { Document, Schema } from 'mongoose';

export interface IPointTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PointTransactionSchema = new Schema<IPointTransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['earn', 'spend'], required: true },
  reason: { type: String, required: true },
  relatedId: { type: Schema.Types.ObjectId }
}, {
  timestamps: true
});

PointTransactionSchema.index({ userId: 1, createdAt: -1 });

export const PointTransaction = mongoose.model<IPointTransaction>('PointTransaction', PointTransactionSchema);
