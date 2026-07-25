/**
 * Component Props Types
 * Reusable component prop interfaces
 */

/**
 * Page action button for context menu
 */
export interface PageAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'ghost';
  disabled?: boolean;
}

/**
 * Filter option for dropdowns
 */
export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
}

/**
 * Modal props
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Form modal props
 */
export interface FormModalProps extends ModalProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

/**
 * Loading state component props
 */
export interface LoadingStateProps {
  message?: string;
}

/**
 * Error state component props
 */
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * Empty state component props
 */
export interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Card stats props
 */
export interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

/**
 * Action bar props
 */
export interface ActionBarProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onAssign?: () => void;
  onBack?: () => void;
  actions?: PageAction[];
}

/**
 * Status badge variant
 */
export type StatusVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'status-draft'
  | 'status-in_progress'
  | 'status-completed'
  | 'status-cancelled'
  | 'priority-low'
  | 'priority-medium'
  | 'priority-high'
  | 'priority-urgent';
