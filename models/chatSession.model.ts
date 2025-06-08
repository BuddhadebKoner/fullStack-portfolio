import mongoose, { Document, Schema } from 'mongoose';

export interface IChatSession extends Document {
  sessionId: string;
  messages: {
    id: string;
    sender: 'user' | 'assistant';
    message: string;
    timestamp: Date;
  }[];
  userInfo?: {
    name?: string;
    email?: string;
    ipAddress?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>({
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  messages: [{
    id: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true,
      enum: ['user', 'assistant']
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  userInfo: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    ipAddress: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
ChatSessionSchema.index({ sessionId: 1 });
ChatSessionSchema.index({ 'userInfo.ipAddress': 1 });
ChatSessionSchema.index({ createdAt: -1 });
ChatSessionSchema.index({ isActive: 1 });

export default mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
