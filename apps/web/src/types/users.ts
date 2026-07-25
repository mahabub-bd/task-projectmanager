/**
 * User & Department Types
 */

import type { User } from './auth';
import type { Role } from './roles';

/**
 * User role assignment
 */
export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  role?: Role;
  assigned_at?: string;
}

/**
 * Create/update user data
 */
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  department_id?: string;
  designation_id?: string;
  address?: string;
  bio?: string;
  role_ids?: number[];
}

/**
 * User filters
 */
export interface UserFilters {
  department_id?: number;
  designation_id?: number;
  role_id?: number;
  is_online?: boolean;
  search?: string;
}

/**
 * Division object
 */
export interface Division {
  id: number;
  name: string;
  description?: string;
  organization_id: number;
  parent_division_id?: number | null;
  parent?: Division;
  children?: Division[];
  departments?: Department[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Create/update division data
 */
export interface DivisionFormData {
  name: string;
  description?: string;
  organization_id?: number;
  parent_division_id?: number;
}

/**
 * Designation object
 */
export interface Designation {
  id: number;
  name: string;
  description?: string;
  organization_id: number;
  department_id?: number | null;
  department?: Department;
  users?: User[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Create/update designation data
 */
export interface DesignationFormData {
  name: string;
  description?: string;
  organization_id?: number;
  department_id?: number;
}

/**
 * Department object
 */
export interface Department {
  id: number;
  name: string;
  description?: string;
  organization_id: number;
  division_id?: number | null;
  division?: Division;
  designations?: Designation[];
  manager_id?: number | null;
  manager?: User;
  users?: User[];
  projects?: any[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Create/update department data
 */
export interface DepartmentFormData {
  name: string;
  description?: string;
  organization_id?: number;
  division_id?: number;
  manager_id?: string;
}

/**
 * Organization object
 */
export interface Organization {
  id: number;
  name: string;
  description?: string;
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create/update organization data
 */
export interface OrganizationFormData {
  name: string;
  description?: string;
}

// Re-export User and Role for convenience
export type { User } from './auth';
export type { Role } from './roles';
