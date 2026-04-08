import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  nameZh: string;
  nameEn: string;
  nameJa: string;
  nameKo: string;
  description: string;
  descriptionEn: string;
  icon: string;
  category: 'learning' | 'social' | 'contribution';
  condition: {
    type: string;
    value: number;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  createdAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
  name: { type: String, required: true, unique: true },
  nameZh: { type: String, required: true },
  nameEn: { type: String, required: true },
  nameJa: { type: String, required: true },
  nameKo: { type: String, required: true },
  description: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, enum: ['learning', 'social', 'contribution'], required: true },
  condition: {
    type: { type: String, required: true },
    value: { type: Number, required: true }
  },
  points: { type: Number, default: 0 },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' }
}, {
  timestamps: true
});

BadgeSchema.index({ category: 1 });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
