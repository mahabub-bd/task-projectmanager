# API Structure

This directory contains the RTK Query API slices organized by feature. Each API file exports its endpoints and auto-generated React hooks.

## File Structure

```
api/
├── baseApi.ts                    # Base API configuration with auth and token refresh
├── authApi.ts                    # Authentication endpoints (login, register, profile, etc.)
├── usersApi.ts                   # User management endpoints
├── divisionsApi.ts               # Division hierarchy endpoints
├── departmentsApi.ts             # Department endpoints
├── designationsApi.ts            # Designation/Job title endpoints
├── organizationsApi.ts           # Organization endpoints
├── projectsApi.ts                # Project endpoints
├── phasesApi.ts                  # Phase endpoints
├── milestonesApi.ts              # Milestone endpoints
├── tasksApi.ts                   # Task endpoints (including comments)
├── rolesApi.ts                   # Role endpoints (including permissions)
├── permissionsApi.ts             # Permission endpoints (including audit logs)
├── tagsApi.ts                    # Tag endpoints
├── notificationsApi.ts           # App notification endpoints
├── notificationPreferencesApi.ts # Notification preferences endpoints
├── activityApi.ts                # Activity log endpoints
├── index.ts                      # Main export file (re-exports all APIs)
└── README.md                     # This file
```

## Usage

Import hooks from the main API file:

```typescript
import { useGetUsersQuery, useCreateUserMutation } from '@/store/api';
```

Or import from specific API files:

```typescript
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetProjectsQuery } from '@/store/api/projectsApi';
```

## API Files

### baseApi.ts
- `apiSlice` - Main API slice with base query configuration
- `baseQueryWithReauth` - Query wrapper with automatic token refresh
- Handles standardized backend response format: `{ message, statusCode, data }`

### authApi.ts
- Login, register, logout
- Get current user
- Update profile
- Change password
- Refresh token

### usersApi.ts
- CRUD operations for users
- User list (simplified for dropdowns)
- Users by department
- Online users
- Organization directory
- User role assignments

### divisionsApi.ts
- CRUD operations for divisions
- Division tree (hierarchical structure)
- Division list (simplified for dropdowns)
- Division departments

### departmentsApi.ts
- CRUD operations for departments
- Department list (simplified for dropdowns)
- Department projects and tasks

### designationsApi.ts
- CRUD operations for designations (job titles)
- Designation list (simplified for dropdowns)

### organizationsApi.ts
- CRUD operations for organizations
- Organization logo upload/delete (default, dark theme, light theme variants)

### projectsApi.ts
- CRUD operations for projects
- Project stats
- Active, upcoming, overdue projects
- Project member management
- Project list (simplified for dropdowns)
- Update project progress

### phasesApi.ts
- CRUD operations for phases
- Phases by project
- Update phase progress

### milestonesApi.ts
- CRUD operations for milestones
- Upcoming and overdue milestones
- Update milestone progress

### tasksApi.ts
- CRUD operations for tasks
- Task comments
- Task comment likes
- Task user assignments

### rolesApi.ts
- CRUD operations for roles
- Role permissions management
- Assign/remove permissions to roles

### permissionsApi.ts
- CRUD operations for permissions
- Audit logs
- Audit log export

### tagsApi.ts
- Get tags
- Create tags

### notificationsApi.ts
- Get notifications (paginated)
- Get unread notifications
- Get notification count
- Mark as read / Mark all as read
- Delete notifications

### notificationPreferencesApi.ts
- Get user notification preferences
- Update notification preferences (email/push settings)

### activityApi.ts
- Get activity log
- User activity tracking

## Migration from apiSlice.ts

The old `apiSlice.ts` file (698 lines) has been split into feature-wise files for better organization:

1. All imports updated from `'@/store/apiSlice'` to `'@/store/api'`
2. Store configuration (`store.ts`) updated to use new path
3. Old file backed up as `apiSlice.ts.bak`

## Benefits

- **Better organization** - Each feature has its own file
- **Easier navigation** - Find endpoints quickly by feature
- **Maintainability** - Smaller files are easier to update
- **Scalability** - Easy to add new features
- **Clear separation** - Feature boundaries are explicit
