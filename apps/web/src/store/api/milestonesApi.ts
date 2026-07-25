import { apiSlice } from './baseApi';

export const milestonesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMilestones: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/milestones',
        params,
      }),
      providesTags: ['Milestone'],
    }),
    getMilestone: builder.query({
      query: (id: string) => `/milestones/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Milestone', id }],
    }),
    createMilestone: builder.mutation({
      query: (data: any) => ({
        url: '/milestones',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Milestone', 'Task'],
    }),
    updateMilestone: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/milestones/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Milestone', id }, 'Milestone', 'Task'],
    }),
    deleteMilestone: builder.mutation({
      query: (id: string) => ({
        url: `/milestones/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Milestone', 'Task'],
    }),
    getUpcomingMilestones: builder.query({
      query: (organizationId: string) => `/milestones/upcoming/${organizationId}`,
      providesTags: ['Milestone'],
    }),
    getOverdueMilestones: builder.query({
      query: (organizationId: string) => `/milestones/overdue/${organizationId}`,
      providesTags: ['Milestone'],
    }),
    updateMilestoneProgress: builder.mutation({
      query: (id: string) => ({
        url: `/milestones/${id}/progress`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Milestone', id }, 'Milestone'],
    }),
  }),
});

export const {
  useGetMilestonesQuery,
  useGetMilestoneQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useGetUpcomingMilestonesQuery,
  useGetOverdueMilestonesQuery,
  useUpdateMilestoneProgressMutation,
} = milestonesApi;
