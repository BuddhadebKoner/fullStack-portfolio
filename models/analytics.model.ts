import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  pageViews: number;
  uniqueVisitors: number;
  totalUsers: number;
  newUsers: number;
  blogViews: number;
  projectViews: number;
  topPages: {
    path: string;
    views: number;
  }[];
  referrers: {
    source: string;
    visits: number;
  }[];
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  countries: {
    country: string;
    visits: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  pageViews: {
    type: Number,
    default: 0,
    min: [0, 'Page views cannot be negative']
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
    min: [0, 'Unique visitors cannot be negative']
  },
  totalUsers: {
    type: Number,
    default: 0,
    min: [0, 'Total users cannot be negative']
  },
  newUsers: {
    type: Number,
    default: 0,
    min: [0, 'New users cannot be negative']
  },
  blogViews: {
    type: Number,
    default: 0,
    min: [0, 'Blog views cannot be negative']
  },
  projectViews: {
    type: Number,
    default: 0,
    min: [0, 'Project views cannot be negative']
  },
  topPages: [{
    path: {
      type: String,
      required: true,
      trim: true
    },
    views: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  referrers: [{
    source: {
      type: String,
      required: true,
      trim: true
    },
    visits: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  devices: {
    mobile: {
      type: Number,
      default: 0,
      min: 0
    },
    desktop: {
      type: Number,
      default: 0,
      min: 0
    },
    tablet: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  countries: [{
    country: {
      type: String,
      required: true,
      trim: true
    },
    visits: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true
});

// Indexes
AnalyticsSchema.index({ date: -1 });
AnalyticsSchema.index({ date: 1, pageViews: -1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
