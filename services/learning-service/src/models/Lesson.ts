import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  type: 'choice' | 'fill' | 'match' | 'speak';
  question: string;
  questionZh?: string;
  questionEn?: string;
  questionJa?: string;
  questionKo?: string;
  options?: string[];
  answer: string;
  points: number;
}

const ExerciseSchema = new Schema<IExercise>({
  type: { type: String, enum: ['choice', 'fill', 'match', 'speak'], required: true },
  question: { type: String, required: true },
  questionZh: { type: String },
  questionEn: { type: String },
  questionJa: { type: String },
  questionKo: { type: String },
  options: [{ type: String }],
  answer: { type: String, required: true },
  points: { type: Number, default: 10 }
});

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  titleZh: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  content: string;
  contentZh?: string;
  contentEn?: string;
  contentJa?: string;
  contentKo?: string;
  audio?: string;
  video?: string;
  exercises: IExercise[];
  order: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  titleZh: { type: String, required: true },
  titleEn: { type: String, required: true },
  titleJa: { type: String, required: true },
  titleKo: { type: String, required: true },
  content: { type: String, required: true },
  contentZh: { type: String },
  contentEn: { type: String },
  contentJa: { type: String },
  contentKo: { type: String },
  audio: { type: String },
  video: { type: String },
  exercises: [ExerciseSchema],
  order: { type: Number, default: 0 },
  duration: { type: Number, default: 0 }
}, {
  timestamps: true
});

LessonSchema.index({ courseId: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
export { ExerciseSchema };
