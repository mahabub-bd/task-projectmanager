import { apiSlice } from './baseApi';

export const departmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/departments',
        params,
      }),
      providesTags: ['Department'],
    }),
    getDepartmentsList: builder.query({
      query: (organizationId?: string) => ({
        url: '/departments/list',
        params: organizationId ? { organization_id: organizationId } : undefined,
      }),
      providesTags: ['Department'],
    }),
    getDepartment: builder.query({
      query: (id: string) => `/departments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Department', id }],
    }),
    createDepartment: builder.mutation({
      query: (data: any) => ({
        url: '/departments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/departments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Department', id }, 'Department'],
    }),
    deleteDepartment: builder.mutation({
      query: (id: string) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Department', id }, 'Department'],
    }),
    getDepartmentProjects: builder.query({
      query: (id: string) => `/departments/${id}/projects`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id: `department-${id}` }],
    }),
    getDepartmentTasks: builder.query({
      query: (id: string) => `/departments/${id}/tasks`,
      providesTags: (_result, _error, id) => [{ type: 'Task', id: `department-${id}` }],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentsListQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentProjectsQuery,
  useGetDepartmentTasksQuery,
} = departmentsApi;
