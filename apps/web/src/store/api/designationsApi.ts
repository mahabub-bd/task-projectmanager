import { apiSlice } from './baseApi';

export const designationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDesignations: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/designations',
        params,
      }),
      providesTags: ['Designation'],
    }),
    getDesignationsList: builder.query({
      query: (organizationId?: string) => ({
        url: '/designations/list',
        params: organizationId ? { organization_id: organizationId } : undefined,
      }),
      providesTags: ['Designation'],
    }),
    getDesignation: builder.query({
      query: (id: string) => `/designations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Designation', id }],
    }),
    createDesignation: builder.mutation({
      query: (data: any) => ({
        url: '/designations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Designation'],
    }),
    updateDesignation: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/designations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Designation', id }, 'Designation'],
    }),
    deleteDesignation: builder.mutation({
      query: (id: string) => ({
        url: `/designations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Designation', id }, 'Designation'],
    }),
  }),
});

export const {
  useGetDesignationsQuery,
  useGetDesignationsListQuery,
  useGetDesignationQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} = designationsApi;
