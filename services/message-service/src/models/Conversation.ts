import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  type: 'private' | 'group';
  participants: mongoose.Types.ObjectId[];
  name?: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    senderId: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  type: { type: String, enum: ['private', 'group'], required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  name: { type: String, maxlength: 100 },
  avatar: { type: String },
  lastMessage: {
    content: { type: String },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date }
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
