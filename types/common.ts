// Common API response types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Database model base types
export interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Status types
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Action types for forms
export type FormAction = 'create' | 'update' | 'delete' | 'view';
