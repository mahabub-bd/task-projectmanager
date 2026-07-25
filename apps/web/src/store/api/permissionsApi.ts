import { apiSlice } from './baseApi';

export const permissionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: () => '/permissions',
      providesTags: ['Permission'],
    }),
    getPermission: builder.query({
      query: (id: string) => `/permissions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Permission', id }],
    }),
    createPermission: builder.mutation({
      query: (data: any) => ({
        url: '/permissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permission'],
    }),
    updatePermission: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/permissions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Permission', id }, 'Permission'],
    }),
    deletePermission: builder.mutation({
      query: (id: string) => ({
        url: `/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Permission', id }, 'Permission'],
    }),
    // Audit logs endpoints
    getAuditLogs: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/audit-logs',
        params,
      }),
      providesTags: ['AuditLog'],
    }),
    // Audit logs export endpoint
    exportAuditLogs: builder.mutation({
      query: (params?: Record<string, string | number>) => ({
        url: '/audit-logs/export',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useGetAuditLogsQuery,
  useExportAuditLogsMutation,
} = permissionsApi;
