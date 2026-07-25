import { apiSlice } from './baseApi';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params?: Record<string, string>) => ({
        url: '/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getUsersList: builder.query({
      query: (organizationId?: string) => ({
        url: '/users/list',
        params: organizationId ? { organization_id: organizationId } : undefined,
      }),
      providesTags: ['User'],
    }),
    getUsersByDepartment: builder.query({
      query: (departmentId: string) => ({
        url: `/users/department/${departmentId}`,
      }),
      providesTags: (_result, _error, departmentId) => [{ type: 'User', id: `department-${departmentId}` }, 'User'],
    }),
    getOnlineUsers: builder.query<any[], void>({
      query: () => '/users/online',
      providesTags: ['User'],
    }),
    getOrganizationDirectory: builder.query({
      query: (params?: Record<string, string | number>) => ({
        url: '/users/directory',
        params,
      }),
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id: string) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation({
      query: (data: any) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }, 'User'],
    }),
    getUserRoles: builder.query({
      query: (userId: string) => `/users/${userId}/roles`,
      providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }, 'Role'],
    }),
    setUserRoles: builder.mutation({
      query: ({ userId, roleIds }: { userId: string; roleIds: number[] }) => ({
        url: `/users/${userId}/roles`,
        method: 'PUT',
        body: { role_ids: roleIds },
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }, 'User', 'Role'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersListQuery,
  useGetUsersByDepartmentQuery,
  useGetOnlineUsersQuery,
  useGetOrganizationDirectoryQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserRolesQuery,
  useSetUserRolesMutation,
} = usersApi;
