import mongoose, { Document, Schema } from 'mongoose';

export interface OAuthProvider {
  provider: 'wechat' | 'qq' | 'weibo' | 'google';
  providerId: string;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  phone?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  nickname: string;
  avatar: string;
  language: 'zh' | 'en' | 'ja' | 'ko';
  oauthProviders: OAuthProvider[];
  level: number;
  exp: number;
  points: number;
  badges: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OAuthProviderSchema = new Schema<OAuthProvider>({
  provider: { 
    type: String, 
    enum: ['wechat', 'qq', 'weibo', 'google'],
    required: true 
  },
  providerId: { type: String, required: true }
});

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { type: String, required: true },
  phone: { 
    type: String, 
    unique: true,
    sparse: true
  },
  phoneVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  nickname: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: { 
    type: String, 
    default: '/avatars/default.png'
  },
  language: { 
    type: String, 
    enum: ['zh', 'en', 'ja', 'ko'],
    default: 'zh'
  },
  oauthProviders: [OAuthProviderSchema],
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }]
}, {
  timestamps: true
});

UserSchema.index({ 'oauthProviders.provider': 1, 'oauthProviders.providerId': 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
