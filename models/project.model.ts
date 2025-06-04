import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  desc: string;
  img: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  isPublished: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  desc: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  img: {
    type: String,
    required: [true, 'Project image is required'],
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  liveUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'desktop', 'ai', 'tool', 'other'],
    default: 'web'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
ProjectSchema.index({ isPublished: 1, order: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ featured: 1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
