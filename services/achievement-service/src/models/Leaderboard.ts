import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboard extends Document {
  type: 'exp' | 'points' | 'learning' | 'contribution';
  period: 'daily' | 'weekly' | 'monthly' | 'all';
  rankings: {
    userId: mongoose.Types.ObjectId;
    score: number;
    rank: number;
  }[];
  updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
  type: { type: String, enum: ['exp', 'points', 'learning', 'contribution'], required: true },
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'all'], required: true },
  rankings: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    rank: { type: Number, required: true }
  }],
  updatedAt: { type: Date, default: Date.now }
});

LeaderboardSchema.index({ type: 1, period: 1 }, { unique: true });

export const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
