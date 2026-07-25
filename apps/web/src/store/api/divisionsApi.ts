import { apiSlice } from './baseApi';

export const divisionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDivisions: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/divisions',
        params,
      }),
      providesTags: ['Division'],
    }),
    getDivisionsList: builder.query({
      query: (organizationId?: string) => ({
        url: '/divisions/list',
        params: organizationId ? { organization_id: organizationId } : undefined,
      }),
      providesTags: ['Division'],
    }),
    getDivisionTree: builder.query({
      query: (organizationId: string) => `/divisions/tree?organizationId=${organizationId}`,
      providesTags: ['Division'],
    }),
    getDivision: builder.query({
      query: (id: string) => `/divisions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Division', id }],
    }),
    getDivisionDepartments: builder.query({
      query: (id: string) => `/divisions/${id}/departments`,
      providesTags: (_result, _error, id) => [{ type: 'Department', id: `division-${id}` }, 'Department'],
    }),
    createDivision: builder.mutation({
      query: (data: any) => ({
        url: '/divisions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Division'],
    }),
    updateDivision: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/divisions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Division', id }, 'Division'],
    }),
    deleteDivision: builder.mutation({
      query: (id: string) => ({
        url: `/divisions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Division', id }, 'Division'],
    }),
  }),
});

export const {
  useGetDivisionsQuery,
  useGetDivisionsListQuery,
  useGetDivisionTreeQuery,
  useGetDivisionQuery,
  useGetDivisionDepartmentsQuery,
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
} = divisionsApi;
