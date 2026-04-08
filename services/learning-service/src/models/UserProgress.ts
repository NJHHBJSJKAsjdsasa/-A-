import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  completed: boolean;
  score: number;
  exerciseResults: {
    exerciseId: mongoose.Types.ObjectId;
    correct: boolean;
    answer: string;
  }[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  exerciseResults: [{
    exerciseId: { type: Schema.Types.ObjectId, required: true },
    correct: { type: Boolean, required: true },
    answer: { type: String, required: true }
  }],
  completedAt: { type: Date }
}, {
  timestamps: true
});

UserProgressSchema.index({ userId: 1, courseId: 1 });
UserProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
