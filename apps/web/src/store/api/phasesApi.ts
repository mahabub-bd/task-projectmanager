import { apiSlice } from './baseApi';

export const phasesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPhases: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/phases',
        params,
      }),
      providesTags: ['Phase'],
    }),
    getPhasesByProject: builder.query({
      query: (projectId: string) => `/phases/project/${projectId}`,
      providesTags: (_result, _error, projectId) => [{ type: 'Phase', id: `project-${projectId}` }],
    }),
    getPhase: builder.query({
      query: (id: string) => `/phases/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Phase', id }],
    }),
    createPhase: builder.mutation({
      query: (data: any) => ({
        url: '/phases',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Phase', 'Milestone', 'Project'],
    }),
    updatePhase: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/phases/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Phase', id }, 'Phase', 'Milestone', 'Project'],
    }),
    deletePhase: builder.mutation({
      query: (id: string) => ({
        url: `/phases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Phase', 'Milestone', 'Project'],
    }),
    updatePhaseProgress: builder.mutation({
      query: (id: string) => ({
        url: `/phases/${id}/progress`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Phase', id }, 'Phase'],
    }),
  }),
});

export const {
  useGetPhasesQuery,
  useGetPhasesByProjectQuery,
  useGetPhaseQuery,
  useCreatePhaseMutation,
  useUpdatePhaseMutation,
  useDeletePhaseMutation,
  useUpdatePhaseProgressMutation,
} = phasesApi;
