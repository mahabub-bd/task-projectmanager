/**
 * API Response utility functions to handle the new standardized backend response format
 *
 * Backend responses now follow this format:
 * {
 *   message: string;
 *   statusCode: number;
 *   data: any;
 * }
 */

import type { PaginatedResponse } from '@/types/api';

/**
 * Extract data from a standardized API response
 * @param response - The raw response from the backend
 * @returns The data field from the response
 */
export function extractData<T = any>(response: any): T {
  return response?.data;
}

/**
 * Extract message from a standardized API response
 * @param response - The raw response from the backend
 * @returns The message field from the response
 */
export function extractMessage(response: any): string {
  return response?.message || 'Success';
}

/**
 * Extract statusCode from a standardized API response
 * @param response - The raw response from the backend
 * @returns The statusCode field from the response
 */
export function extractStatusCode(response: any): number {
  return response?.statusCode || 200;
}

/**
 * Check if a response was successful (status code 2xx)
 * @param response - The raw response from the backend
 * @returns true if status code indicates success
 */
export function isSuccessResponse(response: any): boolean {
  const statusCode = extractStatusCode(response);
  return statusCode >= 200 && statusCode < 300;
}

/**
 * Transform backend response to extract data automatically
 * Use this in baseQuery to unwrap the data field
 */
export const transformResponse = (response: any, _meta: any, _arg: any) => {
  // Handle pagination responses where data might be wrapped
  if (response?.data?.items !== undefined) {
    return {
      ...response.data,
      data: response.data.data,
    };
  }

  // Return data directly for most responses
  return response?.data;
};

/**
 * Extract paginated data from a response
 */
export function extractPaginatedData<T = any>(response: any): PaginatedResponse<T> {
  return response?.data || { items: [], total: 0 };
}
