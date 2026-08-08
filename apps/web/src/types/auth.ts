/**
 * Authentication & User Types
 */

import type { Role } from './roles';

/**
 * User profile information
 */
export interface User {
  id: number;
  email: string;
  name: string;
  bio?: string | null;
  address?: string | null;
  phone_number?: string | null;
  avatar?: string;
  organization_id: number;
  organization_name?: string;
  organization_logo?: string;
  organization_dark_logo?: string;
  organization_light_logo?: string;
  department_id: number | null;
  department_name?: string;
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Authentication state in Redux store
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  access_token: string | null;
  refresh_token: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  organization_name?: string;
}

/**
 * Tokens response from login
 */
export interface AuthTokens {
  user: User;
  access_token: string;
  refresh_token: string;
}

/**
 * Profile update data
 */
export interface ProfileUpdateData {
  name?: string;
  email?: string;
  bio?: string;
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
