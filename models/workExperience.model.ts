import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkExperience extends Document {
  company: string;
  position: string;
  companyLogo?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  technologies: string[];
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkExperienceSchema = new Schema<IWorkExperience>({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  companyLogo: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Set endDate to null if current position
WorkExperienceSchema.pre('save', function(next) {
  if (this.isCurrent) {
    this.endDate = undefined;
  }
  next();
});

// Indexes
WorkExperienceSchema.index({ isVisible: 1, order: 1 });
WorkExperienceSchema.index({ isCurrent: 1 });

export default mongoose.models.WorkExperience || mongoose.model<IWorkExperience>('WorkExperience', WorkExperienceSchema);
