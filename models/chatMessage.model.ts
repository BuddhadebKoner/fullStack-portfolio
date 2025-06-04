import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  sessionId: string;
  sender: 'user' | 'assistant';
  message: string;
  messageType: 'text' | 'image' | 'file';
  metadata?: {
    userInfo?: {
      name?: string;
      email?: string;
      ipAddress?: string;
    };
    attachments?: {
      fileName: string;
      fileUrl: string;
      fileType: string;
    }[];
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    trim: true,
    index: true
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
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  metadata: {
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
    attachments: [{
      fileName: {
        type: String,
        trim: true
      },
      fileUrl: {
        type: String,
        trim: true
      },
      fileType: {
        type: String,
        trim: true
      }
    }]
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
ChatMessageSchema.index({ sessionId: 1, createdAt: 1 });
ChatMessageSchema.index({ sender: 1, createdAt: -1 });
ChatMessageSchema.index({ isRead: 1 });

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
