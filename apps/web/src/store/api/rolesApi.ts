import { apiSlice } from './baseApi';

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/roles',
        params,
      }),
      providesTags: ['Role'],
    }),
    getRole: builder.query({
      query: (id: string) => `/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Role', id }],
    }),
    createRole: builder.mutation({
      query: (data: any) => ({
        url: '/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Role', id }, 'Role'],
    }),
    deleteRole: builder.mutation({
      query: (id: string) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Role', id }, 'Role'],
    }),
    // Role permissions endpoints
    getRolePermissions: builder.query({
      query: (roleId: string) => `/roles/${roleId}/permissions`,
      providesTags: (_result, _error, roleId) => [{ type: 'Role', id: roleId }, 'Permission'],
    }),
    assignPermissionsToRole: builder.mutation({
      query: ({ roleId, permissionIds }: { roleId: string; permissionIds: number[] }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'POST',
        body: { permission_ids: permissionIds },
      }),
      invalidatesTags: (_result, _error, { roleId }) => [{ type: 'Role', id: roleId }, 'Permission'],
    }),
    setRolePermissions: builder.mutation({
      query: ({ roleId, permissionIds }: { roleId: string; permissionIds: number[] }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'PUT',
        body: { permission_ids: permissionIds },
      }),
      invalidatesTags: (_result, _error, { roleId }) => [{ type: 'Role', id: roleId }, 'Permission'],
    }),
    removePermissionsFromRole: builder.mutation({
      query: ({ roleId, permissionIds }: { roleId: string; permissionIds: number[] }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'DELETE',
        body: { permission_ids: permissionIds },
      }),
      invalidatesTags: (_result, _error, { roleId }) => [{ type: 'Role', id: roleId }, 'Permission'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useAssignPermissionsToRoleMutation,
  useSetRolePermissionsMutation,
  useRemovePermissionsFromRoleMutation,
} = rolesApi;
