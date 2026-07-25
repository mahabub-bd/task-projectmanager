# Project & Task Manager

A comprehensive enterprise-grade project and task management application built with modern web technologies. Features role-based access control, real-time updates, and multi-organization support.

## Features

- **Project Management**: Create, track, and manage projects with milestones and deadlines
- **Task Management**: Comprehensive task tracking with assignments, priorities, and status updates
- **Organization Hierarchy**: Multi-tenant support with organizations and departments
- **User Management**: Team member management with role-based permissions
- **Notifications**: In-app notification center with read, delete, and preference controls
- **Authentication & Authorization**: JWT-based auth with granular permission system
- **Audit Logging**: Complete activity tracking for compliance and security
- **Modern UI**: Beautiful, responsive interface built with Radix UI and Tailwind CSS
- **Polished Sign-in Experience**: Responsive login page with password visibility control, inline validation, secure-session messaging, and a demo credential autofill action

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling with Zod validation

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - ORM for database operations
- **PostgreSQL** - Database
- **Passport** - Authentication middleware
- **JWT** - Token-based authentication
- **Socket.IO** - Real-time WebSocket notifications
- **Nodemailer** - Email service
- **AWS S3 SDK** - File storage (optional)

### DevOps
- **Turbo** - Monorepo build system
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Prerequisites

Before running this project, ensure you have installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10 or higher) - Install with `npm install -g pnpm`
- **PostgreSQL** (v14 or higher)
- **Git** - For version control

## Installation

1. **Clone the repository**
   ```bash
   git clone https://gitlab.com/mahabub_hossain/project-and-taskmanager.git
   cd project-and-taskmanager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in both `apps/backend` and `apps/web`:

   **Backend** (`apps/backend/.env`):
   ```env
   PORT=3001
   DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Email (optional)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-email-password

   # AWS S3 (optional)
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   ```

   **Frontend** (`apps/web/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb taskmanager

   # Run migrations (from apps/backend directory)
   cd apps/backend
   pnpm run migration:run
   ```

## Development

Start both frontend and backend in development mode:

```bash
pnpm dev
```

This will start:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)

### Individual Services

Start only the frontend:
```bash
cd apps/web
pnpm dev
```

Start only the backend:
```bash
cd apps/backend
pnpm dev
```

## Build

Build for production:

```bash
pnpm build
```

This builds both applications:
- Frontend: `apps/web/dist`
- Backend: `apps/backend/dist`

### Production Run

```bash
# Backend
cd apps/backend
pnpm start:prod

# Frontend (serve static files)
cd apps/web
pnpm preview
```

## Project Structure

```
project-and-taskmanager/
├── apps/
│   ├── backend/          # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/     # Authentication & authorization
│   │   │   ├── users/    # User management
│   │   │   ├── projects/ # Project & task logic
│   │   │   ├── organizations/
│   │   │   ├── notifications/    # Real-time notification system
│   │   │   │   ├── notifications.controller.ts
│   │   │   │   ├── notifications.service.ts
│   │   │   │   ├── notifications.gateway.ts
│   │   │   │   ├── notifications.module.ts
│   │   │   │   └── dto/        # Data transfer objects
│   │   │   ├── common/         # Shared utilities & guards
│   │   │   ├── entities/       # TypeORM entities
│   │   │   └── main.ts         # Application entry point
│   │   └── test/
│   └── web/              # React frontend
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── pages/         # Page components
│       │   ├── store/         # Redux store & hooks
│       │   ├── contexts/      # React contexts
│       │   └── main.tsx       # Application entry point
│       └── public/
├── package.json           # Root package.json
├── turbo.json            # Turborepo configuration
└── README.md
```

## Available Scripts

### Root Commands
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier

### Backend Commands (from `apps/backend`)
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code

### Frontend Commands (from `apps/web`)
- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Sign in and Demo Access

The login page validates the email and password before submitting credentials to the API. It also includes a **Fill demo credentials** action, which safely populates the form so the user can review the details and choose **Sign in**.

For a seeded local environment, use:

- Email: `superadmin@system.com`
- Password: `123456`

> The demo action fills the form only; it does not sign the user in automatically. Authentication remains governed by the backend-issued JWT access and refresh tokens.

## API Documentation

When running in development mode, the backend API documentation is available via Swagger:

- Swagger UI: [http://localhost:3001/api](http://localhost:3001/api)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Format code with Prettier
- Write meaningful commit messages
- Add tests for new features

## Notification System

The application includes a comprehensive notification system with real-time updates via WebSocket and user-configurable preferences.

### Notification Types

| Type | Description |
|------|-------------|
| `task_assigned` | User assigned to a new task |
| `task_updated` | Task details modified |
| `task_completed` | Task marked as completed |
| `task_overdue` | Task past its due date |
| `project_created` | New project created |
| `project_updated` | Project details modified |
| `milestone_due` | Milestone approaching due date |
| `milestone_completed` | Milestone marked complete |
| `comment_added` | New comment on task/project |
| `mention` | User mentioned in a comment |
| `role_updated` | User role changed |
| `department_updated` | Department details modified |

### Notification Priority Levels

- `low` - Informational updates (comments, minor changes)
- `medium` - Standard updates (task updates, project changes)
- `high` - Important alerts (new assignments, mentions)
- `urgent` - Critical notifications (overdue tasks, imminent deadlines)

### Real-time Notifications

The system uses WebSocket (Socket.IO) for real-time notification delivery:

**Connection Endpoint:** `ws://localhost:3001/notifications`

**Authentication:** JWT token required via handshake auth or Authorization header

**Events:**
- `notification` - New notification received
- `unread-count` - Updated unread notification count
- `joined-organization` - Successfully joined organization room
- `left-organization` - Successfully left organization room

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications` | Get all notifications (supports `unreadOnly`, `limit`, `offset` query params) |
| `GET` | `/notifications/:id` | Get single notification by ID |
| `GET` | `/notifications/unread-count` | Get unread notification count |
| `GET` | `/notifications/preferences` | Get user notification preferences |
| `PUT` | `/notifications/preferences/:type` | Update notification preference for a type |
| `POST` | `/notifications` | Create a new notification |
| `PUT` | `/notifications/:id/read` | Mark notification as read |
| `POST` | `/notifications/mark-all-read` | Mark all notifications as read |
| `DELETE` | `/notifications/:id` | Delete a notification |

### Notification Preferences

Users can configure how they receive notifications per notification type:

| Field | Type | Description |
|-------|------|-------------|
| `email_enabled` | boolean | Enable email notifications for this type |
| `in_app_enabled` | boolean | Enable in-app notifications for this type |
| `reminder_hours` | number | Hours before due date to send reminders (default: 24) |

### Service Helper Methods

The `NotificationsService` provides convenient methods for creating specific notification types:

- `notifyTaskAssigned()` - Create task assignment notification
- `notifyTaskUpdated()` - Create task update notification
- `notifyTaskCompleted()` - Create task completion notification
- `notifyCommentAdded()` - Create new comment notification
- `notifyMention()` - Create mention notification
- `notifyMilestoneDue()` - Create milestone due reminder
- `notifyProjectUpdated()` - Create project update notification

### WebSocket Rooms

Users can join organization-specific rooms for collaborative notifications:

```javascript
// Join organization room
socket.emit('join-organization', { organizationId: 123 });

// Leave organization room
socket.emit('leave-organization', { organizationId: 123 });
```

## Roadmap

- [ ] Mobile responsive design improvements
- [ ] Advanced reporting and analytics
- [ ] Calendar view for tasks and milestones
- [ ] File attachments for tasks and projects
- [x] In-app notifications with WebSocket support
- [ ] Email notifications (backend infrastructure ready)
- [ ] Push notifications (mobile)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Performance optimizations

## Support

For support, email support@example.com or open an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Status

✅ Active Development

This project is actively maintained and developed. New features and improvements are regularly added.
