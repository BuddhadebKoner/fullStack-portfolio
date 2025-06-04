import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl?: string;
  faviconUrl?: string;
  metaTags: {
    keywords: string[];
    author: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  features: {
    blogEnabled: boolean;
    projectsEnabled: boolean;
    chatEnabled: boolean;
    analyticsEnabled: boolean;
    adminPanelEnabled: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  siteTitle: {
    type: String,
    required: [true, 'Site title is required'],
    trim: true,
    maxlength: [100, 'Site title cannot exceed 100 characters'],
    default: 'Portfolio Website'
  },
  siteDescription: {
    type: String,
    required: [true, 'Site description is required'],
    trim: true,
    maxlength: [300, 'Site description cannot exceed 300 characters'],
    default: 'A modern portfolio website'
  },
  siteUrl: {
    type: String,
    required: [true, 'Site URL is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  logoUrl: {
    type: String,
    trim: true
  },
  faviconUrl: {
    type: String,
    trim: true
  },
  metaTags: {
    keywords: [{
      type: String,
      trim: true
    }],
    author: {
      type: String,
      required: true,
      trim: true,
      default: 'Portfolio Owner'
    },
    ogTitle: {
      type: String,
      trim: true
    },
    ogDescription: {
      type: String,
      trim: true
    },
    ogImage: {
      type: String,
      trim: true
    }
  },
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please provide a valid email'
      }
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  socialLinks: {
    github: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    linkedin: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    twitter: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    instagram: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    }
  },
  features: {
    blogEnabled: {
      type: Boolean,
      default: true
    },
    projectsEnabled: {
      type: Boolean,
      default: true
    },
    chatEnabled: {
      type: Boolean,
      default: true
    },
    analyticsEnabled: {
      type: Boolean,
      default: true
    },
    adminPanelEnabled: {
      type: Boolean,
      default: true
    }
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#3b82f6'
    },
    secondaryColor: {
      type: String,
      default: '#8b5cf6'
    },
    backgroundColor: {
      type: String,
      default: '#161616'
    },
    textColor: {
      type: String,
      default: '#ffffff'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one active settings document
SiteSettingsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
