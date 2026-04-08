import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  titleZh: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  description: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionKo: string;
  language: 'en' | 'ja' | 'ko';
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: mongoose.Types.ObjectId[];
  cover: string;
  duration: number;
  enrolled: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  titleZh: { type: String, required: true },
  titleEn: { type: String, required: true },
  titleJa: { type: String, required: true },
  titleKo: { type: String, required: true },
  description: { type: String },
  descriptionZh: { type: String },
  descriptionEn: { type: String },
  descriptionJa: { type: String },
  descriptionKo: { type: String },
  language: { type: String, enum: ['en', 'ja', 'ko'], required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  cover: { type: String, default: '/courses/default.png' },
  duration: { type: Number, default: 0 },
  enrolled: { type: Number, default: 0 }
}, {
  timestamps: true
});

CourseSchema.index({ language: 1, level: 1 });
CourseSchema.index({ enrolled: -1 });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
