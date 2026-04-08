import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploaderId: mongoose.Types.ObjectId;
  folder: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: String, default: 'general' },
  isPublic: { type: Boolean, default: false }
}, {
  timestamps: true
});

FileSchema.index({ uploaderId: 1 });
FileSchema.index({ folder: 1 });

export const File = mongoose.model<IFile>('File', FileSchema);
