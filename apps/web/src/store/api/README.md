# API Structure

This directory contains the RTK Query API slices organized by feature. Each API file exports its endpoints and auto-generated React hooks.

## File Structure

```
api/
├── baseApi.ts           # Base API configuration with auth and token refresh
├── authApi.ts           # Authentication endpoints (login, register, profile, etc.)
├── usersApi.ts          # User management endpoints
├── departmentsApi.ts    # Department endpoints
├── projectsApi.ts       # Project endpoints
├── tasksApi.ts          # Task endpoints (including comments)
├── organizationsApi.ts  # Organization endpoints
├── rolesApi.ts          # Role endpoints (including permissions)
├── permissionsApi.ts    # Permission endpoints (including audit logs)
├── tagsApi.ts           # Tag endpoints
├── milestonesApi.ts     # Milestone endpoints
├── index.ts             # Main export file (re-exports all APIs)
└── README.md            # This file
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

### usersApi.ts
- CRUD operations for users
- User list (simplified for dropdowns)
- Users by department
- User role assignments

### departmentsApi.ts
- CRUD operations for departments
- Department list (simplified for dropdowns)
- Department projects and tasks

### projectsApi.ts
- CRUD operations for projects
- Project stats
- Active, upcoming, overdue projects
- Project member management

### tasksApi.ts
- CRUD operations for tasks
- Task comments
- Task user assignments

### organizationsApi.ts
- CRUD operations for organizations

### rolesApi.ts
- CRUD operations for roles
- Role permission management

### permissionsApi.ts
- CRUD operations for permissions
- Audit logs
- Audit log export

### tagsApi.ts
- Get tags
- Create tags

### milestonesApi.ts
- CRUD operations for milestones
- Upcoming and overdue milestones
- Update milestone progress

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
