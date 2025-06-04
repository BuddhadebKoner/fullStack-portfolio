import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminActivity extends Document {
  userId: string;
  userEmail: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'other';
  resourceType?: 'blog' | 'project' | 'skill' | 'workExperience' | 'profile' | 'user' | 'analytics' | 'other';
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AdminActivitySchema = new Schema<IAdminActivity>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    lowercase: true
  },
  action: {
    type: String,
    required: [true, 'Action description is required'],
    trim: true,
    maxlength: [200, 'Action description cannot exceed 200 characters']
  },
  actionType: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'view', 'login', 'logout', 'other'],
    default: 'other'
  },
  resourceType: {
    type: String,
    enum: ['blog', 'project', 'skill', 'workExperience', 'profile', 'user', 'analytics', 'other']
  },
  resourceId: {
    type: String,
    trim: true
  },
  details: {
    type: String,
    trim: true,
    maxlength: [1000, 'Details cannot exceed 1000 characters']
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
AdminActivitySchema.index({ userId: 1, createdAt: -1 });
AdminActivitySchema.index({ actionType: 1, createdAt: -1 });
AdminActivitySchema.index({ resourceType: 1, resourceId: 1 });
AdminActivitySchema.index({ createdAt: -1 });

export default mongoose.models.AdminActivity || mongoose.model<IAdminActivity>('AdminActivity', AdminActivitySchema);
