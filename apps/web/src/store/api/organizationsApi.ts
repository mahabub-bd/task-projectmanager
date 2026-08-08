import { apiSlice } from './baseApi';

export const organizationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/organizations',
        params,
      }),
      providesTags: ['Organization'],
    }),
    getOrganization: builder.query({
      query: (id: string) => `/organizations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Organization', id }],
    }),
    createOrganization: builder.mutation({
      query: (data: any) => ({
        url: '/organizations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Organization'],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/organizations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Organization', id }, 'Organization'],
    }),
    deleteOrganization: builder.mutation({
      query: (id: string) => ({
        url: `/organizations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Organization', id }, 'Organization'],
    }),
    uploadOrganizationLogo: builder.mutation({
      query: ({ id, file }: { id: string | number; file: File }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/organizations/${id}/logo`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, args) => [{ type: 'Organization', id: String(args?.id) }, 'Organization'],
    }),
    deleteOrganizationLogo: builder.mutation({
      query: (id: string | number) => ({
        url: `/organizations/${id}/logo`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Organization', id: String(id) }, 'Organization'],
    }),
    uploadOrganizationDarkLogo: builder.mutation({
      query: ({ id, file }: { id: string | number; file: File }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/organizations/${id}/dark-logo`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, args) => [{ type: 'Organization', id: String(args?.id) }, 'Organization'],
    }),
    deleteOrganizationDarkLogo: builder.mutation({
      query: (id: string | number) => ({
        url: `/organizations/${id}/dark-logo`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Organization', id: String(id) }, 'Organization'],
    }),
    uploadOrganizationLightLogo: builder.mutation({
      query: ({ id, file }: { id: string | number; file: File }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/organizations/${id}/light-logo`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, args) => [{ type: 'Organization', id: String(args?.id) }, 'Organization'],
    }),
    deleteOrganizationLightLogo: builder.mutation({
      query: (id: string | number) => ({
        url: `/organizations/${id}/light-logo`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Organization', id: String(id) }, 'Organization'],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useUploadOrganizationLogoMutation,
  useDeleteOrganizationLogoMutation,
  useUploadOrganizationDarkLogoMutation,
  useDeleteOrganizationDarkLogoMutation,
  useUploadOrganizationLightLogoMutation,
  useDeleteOrganizationLightLogoMutation,
} = organizationsApi;
