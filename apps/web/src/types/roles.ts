/**
 * Role & Permission Types
 */

/**
 * Permission object
 */
export interface Permission {
  id: number;
  name: string;
  description?: string;
  resource: string;
  action: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Role object
 */
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Role with permissions count
 */
export interface RoleWithPermissions extends Role {
  permissions_count?: number;
}

/**
 * Create/update role data
 */
export interface RoleFormData {
  name: string;
  description?: string;
  permission_ids?: number[];
}

/**
 * Create/update permission data
 */
export interface PermissionFormData {
  name: string;
  description?: string;
  resource: string;
  action: string;
}

/**
 * Permission assignment to role
 */
export interface RolePermissionAssignment {
  role_id: number;
  permission_ids: number[];
}
