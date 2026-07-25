import { apiSlice } from './baseApi';

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),
    getProject: builder.query({
      query: (id: string) => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),
    getProjectStats: builder.query({
      query: (id: string) => `/projects/${id}/stats`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (data: any) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Project', 'Milestone', 'Task'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }, 'Project', 'Milestone', 'Task'],
    }),
    deleteProject: builder.mutation({
      query: (id: string) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project', 'Milestone', 'Task'],
    }),
    getActiveProjects: builder.query({
      query: (organizationId: string) => `/projects/active/${organizationId}`,
      providesTags: ['Project'],
    }),
    getUpcomingProjects: builder.query({
      query: (organizationId: string) => `/projects/upcoming/${organizationId}`,
      providesTags: ['Project'],
    }),
    getOverdueProjects: builder.query({
      query: (organizationId: string) => `/projects/overdue/${organizationId}`,
      providesTags: ['Project'],
    }),
    updateProjectProgress: builder.mutation({
      query: (id: string) => ({
        url: `/projects/${id}/progress`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Project', id }, 'Project'],
    }),
    addProjectMember: builder.mutation({
      query: ({ projectId, ...data }: { projectId: string; [key: string]: any }) => ({
        url: `/projects/${projectId}/members`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'Project', id: projectId }, 'Project'],
    }),
    getProjectMembers: builder.query({
      query: (projectId: string) => `/projects/${projectId}/members`,
      providesTags: (_result, _error, projectId) => [{ type: 'Project', id: projectId }],
    }),
    getProjectsList: builder.query({
      query: (organizationId: string) => `/projects/list/${organizationId}`,
      providesTags: ['Project'],
    }),
    removeProjectMember: builder.mutation({
      query: ({ projectId, memberId }: { projectId: string; memberId: string }) => ({
        url: `/projects/${projectId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'Project', id: projectId }, 'Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetProjectStatsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetActiveProjectsQuery,
  useGetUpcomingProjectsQuery,
  useGetOverdueProjectsQuery,
  useUpdateProjectProgressMutation,
  useAddProjectMemberMutation,
  useGetProjectMembersQuery,
  useGetProjectsListQuery,
  useRemoveProjectMemberMutation,
} = projectsApi;
