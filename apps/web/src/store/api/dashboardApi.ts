import { apiSlice } from './baseApi';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      // Aggregates change on every task/project/mutation; don't over-invalidate.
      providesTags: ['Task', 'Project', 'Milestone'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
