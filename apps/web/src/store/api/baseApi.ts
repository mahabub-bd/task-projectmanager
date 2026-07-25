import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout, setTokens } from '../authSlice';
import type { RootState } from '../store';

// Mutex to prevent concurrent token refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Base query with auth token handling
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state instead of localStorage
    const state = getState() as RootState;
    const token = state.auth.access_token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper to handle standardized backend response format: { message, statusCode, data }
const baseQueryWithResponseTransform: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // Transform successful responses to extract data field
  if (result.data && typeof result.data === 'object' && 'data' in result.data) {
    result.data = (result.data as { data: unknown }).data;
  }

  return result;
};

// Base query with token refresh handling
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQueryWithResponseTransform(args, api, extraOptions);

  // Handle 401 Unauthorized - try to refresh token
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refresh_token;

    if (!refreshToken) {
      // No refresh token, redirect to login
      api.dispatch(logout());
      window.location.href = '/login';
      return result;
    }

    // If already refreshing, wait for the new token
    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber(() => {
          // Retry the original request with new token
          resolve(baseQueryWithResponseTransform(args, api, extraOptions));
        });
      });
    }

    // Start refresh process
    isRefreshing = true;

    try {
      // Try to refresh the token
      const refreshResult = await baseQueryWithResponseTransform(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { access_token, refresh_token: newRefreshToken } = refreshResult.data as {
          access_token: string;
          refresh_token: string;
        };

        // Update tokens in Redux state
        api.dispatch(setTokens({ access_token, refresh_token: newRefreshToken }));

        // Notify all waiting requests
        onRefreshed(access_token);

        // Retry the original request with new token
        result = await baseQueryWithResponseTransform(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch(logout());
        window.location.href = '/login';
      }
    } finally {
      isRefreshing = false;
    }
  }

  return result;
};

// Create base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Task', 'User', 'Division', 'Department', 'Designation', 'Organization', 'Comment', 'CommentLike', 'Attachment', 'Auth', 'Notification', 'NotificationPreferences', 'Role', 'Permission', 'AuditLog', 'Tag', 'Milestone', 'Project', 'Chat', 'Message', 'Activity'],
  endpoints: () => ({}),
});
