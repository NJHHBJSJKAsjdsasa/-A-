import mongoose, { Document, Schema } from 'mongoose';

export interface ICircle extends Document {
  name: string;
  description: string;
  cover: string;
  ownerId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  posts: number;
  language: 'zh' | 'en' | 'ja' | 'ko';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CircleSchema = new Schema<ICircle>({
  name: { type: String, required: true, maxlength: 100, unique: true },
  description: { type: String, maxlength: 500 },
  cover: { type: String, default: '/covers/default.png' },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: { type: Number, default: 0 },
  language: { type: String, enum: ['zh', 'en', 'ja', 'ko'], default: 'zh' },
  isPublic: { type: Boolean, default: true }
}, {
  timestamps: true
});

CircleSchema.index({ ownerId: 1 });
CircleSchema.index({ members: 1 });
CircleSchema.index({ name: 'text' });

export const Circle = mongoose.model<ICircle>('Circle', CircleSchema);
