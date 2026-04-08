import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  circleId?: mongoose.Types.ObjectId;
  tags: string[];
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  comments: number;
  language: 'zh' | 'en' | 'ja' | 'ko';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 10000 },
  images: [{ type: String }],
  videos: [{ type: String }],
  circleId: { type: Schema.Types.ObjectId, ref: 'Circle' },
  tags: [{ type: String, maxlength: 50 }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: { type: Number, default: 0 },
  language: { type: String, enum: ['zh', 'en', 'ja', 'ko'], default: 'zh' }
}, {
  timestamps: true
});

PostSchema.index({ authorId: 1 });
PostSchema.index({ circleId: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ title: 'text', content: 'text' });

export const Post = mongoose.model<IPost>('Post', PostSchema);
