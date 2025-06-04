"use client";

import { useState, useEffect } from 'react';
import { ProfileFormData } from '@/types/profile';
import { FormField } from '@/types/profile';
import { ProfileData } from '@/types/profile';
import { FormState } from '@/types/common';

interface ProfileFormProps {
   initialData?: ProfileData | null;
   onSubmit?: (data: ProfileFormData) => Promise<void>;
   onCancel?: () => void;
   mode?: 'create' | 'edit';
   className?: string;
}

export default function ProfileForm({
   initialData,
   onSubmit,
   onCancel,
   mode = 'edit',
   className = ''
}: ProfileFormProps) {
   // Initialize form data
   const [formState, setFormState] = useState<FormState<ProfileFormData>>({
      data: {
         firstName: initialData?.firstName || '',
         lastName: initialData?.lastName || '',
         email: initialData?.email || '',
         phone: initialData?.phone || '',
         address: initialData?.address || '',
         city: initialData?.city || '',
         country: initialData?.country || '',
         bio: initialData?.bio || '',
         avatar: initialData?.avatar || '',
         socialLinks: {
            github: initialData?.socialLinks?.github || '',
            linkedin: initialData?.socialLinks?.linkedin || '',
            twitter: initialData?.socialLinks?.twitter || '',
            instagram: initialData?.socialLinks?.instagram || '',
            website: initialData?.socialLinks?.website || '',
         },
         isPublic: initialData?.isPublic ?? true,
      },
      errors: {},
      isLoading: false,
      isSubmitting: false,
      isDirty: false,
   });

   // Update form data when initialData changes
   useEffect(() => {
      if (initialData) {
         setFormState((prev: FormState<ProfileFormData>) => ({
            ...prev,
            data: {
               firstName: initialData.firstName || '',
               lastName: initialData.lastName || '',
               email: initialData.email || '',
               phone: initialData.phone || '',
               address: initialData.address || '',
               city: initialData.city || '',
               country: initialData.country || '',
               bio: initialData.bio || '',
               avatar: initialData.avatar || '',
               socialLinks: {
                  github: initialData.socialLinks?.github || '',
                  linkedin: initialData.socialLinks?.linkedin || '',
                  twitter: initialData.socialLinks?.twitter || '',
                  instagram: initialData.socialLinks?.instagram || '',
                  website: initialData.socialLinks?.website || '',
               },
               isPublic: initialData.isPublic ?? true,
            },
            isDirty: false,
         }));
      }
   }, [initialData]);

   // Form field configurations
   const basicFields: FormField[] = [
      { name: 'firstName', label: 'First Name', type: 'text', required: true, maxLength: 50 },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true, maxLength: 50 },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', maxLength: 20 },
   ];

   const locationFields: FormField[] = [
      { name: 'address', label: 'Address', type: 'text', maxLength: 200 },
      { name: 'city', label: 'City', type: 'text', maxLength: 50 },
      { name: 'country', label: 'Country', type: 'text', maxLength: 50 },
   ];

   const socialFields: FormField[] = [
      { name: 'github', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/username' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/username' },
      { name: 'twitter', label: 'Twitter URL', type: 'url', placeholder: 'https://twitter.com/username' },
      { name: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/username' },
      { name: 'website', label: 'Website URL', type: 'url', placeholder: 'https://yourwebsite.com' },
   ];

   // Validation functions
   const validateEmail = (email: string): string | null => {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!email) return 'Email is required';
      if (!emailRegex.test(email)) return 'Please provide a valid email';
      return null;
   };

   const validateUrl = (url: string): string | null => {
      if (!url) return null;
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(url)) return 'Please provide a valid URL (must start with http:// or https://)';
      return null;
   };

   const validateField = (name: string, value: string): string | null => {
      switch (name) {
         case 'firstName':
         case 'lastName':
            if (!value.trim()) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
            if (value.length > 50) return `${name === 'firstName' ? 'First' : 'Last'} name cannot exceed 50 characters`;
            break;
         case 'email':
            return validateEmail(value);
         case 'phone':
            if (value.length > 20) return 'Phone number cannot exceed 20 characters';
            break;
         case 'address':
            if (value.length > 200) return 'Address cannot exceed 200 characters';
            break;
         case 'city':
         case 'country':
            if (value.length > 50) return `${name.charAt(0).toUpperCase() + name.slice(1)} cannot exceed 50 characters`;
            break;
         case 'bio':
            if (value.length > 500) return 'Bio cannot exceed 500 characters';
            break;
         default:
            if (name.includes('socialLinks.')) {
               return validateUrl(value);
            }
      }
      return null;
   };

   // Handle input changes
   const handleInputChange = (name: string, value: string | boolean) => {
      setFormState((prev: FormState<ProfileFormData>) => {
         const newData = { ...prev.data };
         const newErrors = { ...prev.errors };

         if (name.startsWith('socialLinks.')) {
            const socialKey = name.split('.')[1] as keyof typeof newData.socialLinks;
            newData.socialLinks = { ...newData.socialLinks, [socialKey]: value as string };
         } else {
            (newData as unknown as Record<string, unknown>)[name] = value;
         }

         // Validate field
         if (typeof value === 'string') {
            const error = validateField(name, value);
            if (error) {
               newErrors[name] = error;
            } else {
               delete newErrors[name];
            }
         }

         return {
            ...prev,
            data: newData,
            errors: newErrors,
            isDirty: true,
         };
      });
   };

   // Handle form submission
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const errors: Record<string, string> = {};

      // Validate basic fields
      basicFields.forEach(field => {
         const value = (formState.data as unknown as Record<string, unknown>)[field.name];
         const error = validateField(field.name, value as string);
         if (error) errors[field.name] = error;
      });

      // Validate social links
      Object.entries(formState.data.socialLinks).forEach(([key, value]) => {
         if (value) {
            const error = validateUrl(value);
            if (error) errors[`socialLinks.${key}`] = error;
         }
      });

      // Validate bio
      if (formState.data.bio) {
         const bioError = validateField('bio', formState.data.bio);
         if (bioError) errors['bio'] = bioError;
      }

      if (Object.keys(errors).length > 0) {
         setFormState((prev: FormState<ProfileFormData>) => ({ ...prev, errors }));
         return;
      }

      setFormState((prev: FormState<ProfileFormData>) => ({ ...prev, isSubmitting: true }));

      try {
         if (onSubmit) {
            await onSubmit(formState.data);
         } else {
            // Default API call
            const response = await fetch('/api/profile', {
               method: mode === 'create' ? 'POST' : 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(formState.data),
            });

            const result = await response.json();

            if (!result.success) {
               throw new Error(result.error || 'Failed to save profile');
            }

            console.log('Profile saved successfully:', result.data);
            setFormState((prev: FormState<ProfileFormData>) => ({ ...prev, isDirty: false }));
         }
      } catch (error) {
         console.error('Error saving profile:', error);
         setFormState((prev: FormState<ProfileFormData>) => ({
            ...prev,
            errors: { general: error instanceof Error ? error.message : 'Failed to save profile' }
         }));
      } finally {
         setFormState((prev: FormState<ProfileFormData>) => ({ ...prev, isSubmitting: false }));
      }
   };

   // Render form field
   const renderField = (field: FormField, value: string, onChange: (value: string) => void) => {
      const error = formState.errors[field.name];

      return (
         <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-[#e0e0e0]">
               {field.label}
               {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
               <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows || 4}
                  maxLength={field.maxLength}
                  className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-lg text-white placeholder-[#a0a0a0] focus:outline-none focus:ring-2 transition-colors ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#404040] focus:ring-blue-500'
                     }`}
               />
            ) : (
               <input
                  type={field.type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-lg text-white placeholder-[#a0a0a0] focus:outline-none focus:ring-2 transition-colors ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#404040] focus:ring-blue-500'
                     }`}
               />
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
         </div>
      );
   };

   return (
      <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
         {/* Basic Information */}
         <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
            <h3 className="text-white text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {basicFields.map(field =>
                  renderField(
                     field,
                     (formState.data as unknown as Record<string, string>)[field.name] || '',
                     (value) => handleInputChange(field.name, value)
                  )
               )}
            </div>
         </div>

         {/* Location Information */}
         <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
            <h3 className="text-white text-lg font-semibold mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {locationFields.map(field =>
                  renderField(
                     field,
                     (formState.data as unknown as Record<string, string>)[field.name] || '',
                     (value) => handleInputChange(field.name, value)
                  )
               )}
            </div>
         </div>

         {/* Bio */}
         <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            {renderField(
               { name: 'bio', label: 'Bio', type: 'textarea', maxLength: 500, rows: 4, placeholder: 'Tell us about yourself...' },
               formState.data.bio,
               (value) => handleInputChange('bio', value)
            )}
            <p className="text-[#a0a0a0] text-sm mt-1">{formState.data.bio.length}/500 characters</p>
         </div>

         {/* Social Links */}
         <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
            <h3 className="text-white text-lg font-semibold mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {socialFields.map(field =>
                  renderField(
                     field,
                     formState.data.socialLinks[field.name as keyof typeof formState.data.socialLinks] || '',
                     (value) => handleInputChange(`socialLinks.${field.name}`, value)
                  )
               )}
            </div>
         </div>

         {/* Privacy Settings */}
         <div className="bg-[#262626] rounded-lg p-6 border border-[#404040]">
            <h3 className="text-white text-lg font-semibold mb-4">Privacy</h3>
            <div className="flex items-center gap-3">
               <input
                  type="checkbox"
                  id="isPublic"
                  checked={formState.data.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-[#1a1a1a] border-[#404040] rounded focus:ring-blue-500"
               />
               <label htmlFor="isPublic" className="text-[#e0e0e0] text-sm">
                  Make my profile public (visible to visitors)
               </label>
            </div>
         </div>

         {/* Error Display */}
         {formState.errors.general && (
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4">
               <p className="text-red-400 text-sm">{formState.errors.general}</p>
            </div>
         )}

         {/* Action Buttons */}
         <div className="flex gap-4 justify-end">
            {onCancel && (
               <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 bg-[#404040] hover:bg-[#505050] text-white rounded-lg transition-colors"
               >
                  Cancel
               </button>
            )}
            <button
               type="submit"
               disabled={formState.isSubmitting || Object.keys(formState.errors).length > 0}
               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
               {formState.isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
               )}
               {mode === 'create' ? 'Create Profile' : 'Save Changes'}
            </button>
         </div>

         {/* Dirty State Indicator */}
         {formState.isDirty && (
            <div className="text-center">
               <p className="text-yellow-400 text-sm">You have unsaved changes</p>
            </div>
         )}
      </form>
   );
}
