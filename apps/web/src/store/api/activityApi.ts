import { apiSlice } from './baseApi';

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLog: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/audit-logs',
        params,
      }),
      providesTags: ['AuditLog'],
    }),
  }),
});

export const { useGetActivityLogQuery } = activityApi;
