// Profile related types and interfaces

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface ProfileData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  city: string;
  country: string;
  address?: string;
  experience?: number;
  isPublic: boolean;
  isAvailable: boolean;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
  };
  resumeUrl?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLinks;
  isPublic: boolean;
  resumeUrl: string;
}

export interface ProfileUpdateData extends Partial<ProfileFormData> { }

export interface ProfileApiResponse {
  success: boolean;
  data?: ProfileData;
  message?: string;
  error?: string;
}

// Form validation types
export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

// Form field configuration
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'url' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
}
