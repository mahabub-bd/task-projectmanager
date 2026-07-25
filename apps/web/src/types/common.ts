/**
 * Common/Shared Types
 */

/**
 * Generic entity with ID
 */
export interface Entity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Date range
 */
export interface DateRange {
  from: string;
  to: string;
}

/**
 * Select option
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Sort option
 */
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Color theme
 */
export type ColorTheme = 'light' | 'dark' | 'system';

/**
 * Status type (generic)
 */
export type StatusType = 'active' | 'inactive' | 'pending' | 'archived';

/**
 * Priority type (generic)
 */
export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * Navigation item
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  children?: NavItem[];
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
