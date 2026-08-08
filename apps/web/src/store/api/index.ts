// Base API configuration
export { apiSlice, baseQueryWithReauth } from './baseApi';
export type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Auth API
export {
  authApi,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from './authApi';

// Tasks API
export {
  tasksApi,
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useLikeTaskCommentMutation,
  useUnlikeTaskCommentMutation,
  useGetTaskCommentLikesQuery,
  useAssignUsersToTaskMutation,
} from './tasksApi';

// Users API
export {
  usersApi,
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
} from './usersApi';

// Divisions API
export {
  divisionsApi,
  useGetDivisionsQuery,
  useGetDivisionsListQuery,
  useGetDivisionTreeQuery,
  useGetDivisionQuery,
  useGetDivisionDepartmentsQuery,
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
} from './divisionsApi';

// Departments API
export {
  departmentsApi,
  useGetDepartmentsQuery,
  useGetDepartmentsListQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentProjectsQuery,
  useGetDepartmentTasksQuery,
} from './departmentsApi';

// Designations API
export {
  designationsApi,
  useGetDesignationsQuery,
  useGetDesignationsListQuery,
  useGetDesignationQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} from './designationsApi';

// Organizations API
export {
  organizationsApi,
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
} from './organizationsApi';

// Roles API
export {
  rolesApi,
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useAssignPermissionsToRoleMutation,
  useSetRolePermissionsMutation,
  useRemovePermissionsFromRoleMutation,
} from './rolesApi';

// Permissions API (includes Audit Logs)
export {
  permissionsApi,
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useGetAuditLogsQuery,
  useExportAuditLogsMutation,
} from './permissionsApi';

// Tags API
export {
  tagsApi,
  useGetTagsQuery,
  useCreateTagMutation,
} from './tagsApi';

// Milestones API
export {
  milestonesApi,
  useGetMilestonesQuery,
  useGetMilestoneQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useGetUpcomingMilestonesQuery,
  useGetOverdueMilestonesQuery,
  useUpdateMilestoneProgressMutation,
} from './milestonesApi';

// Phases API
export {
  phasesApi,
  useGetPhasesQuery,
  useGetPhasesByProjectQuery,
  useGetPhaseQuery,
  useCreatePhaseMutation,
  useUpdatePhaseMutation,
  useDeletePhaseMutation,
  useUpdatePhaseProgressMutation,
} from './phasesApi';

// Projects API
export {
  projectsApi,
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
} from './projectsApi';

// Notifications API (preferences)
export {
  notificationPreferencesApi,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferenceMutation,
} from './notificationPreferencesApi';

// App Notifications API
export {
  notificationsApi,
  useGetNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useGetNotificationQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from './notificationsApi';

// Activity Log API
export {
  activityApi,
  useGetActivityLogQuery,
} from './activityApi';
