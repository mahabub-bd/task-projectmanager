/**
 * API Response Types
 * Handles the standardized backend response format
 */

/**
 * Standardized API response format from backend
 */
export interface ApiResponse<T = any> {
  message: string;
  statusCode: number;
  data: T;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

/**
 * API Error response
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Query parameters for pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Filter parameters
 */
export interface FilterParams {
  status?: string;
  priority?: string;
  [key: string]: any;
}
