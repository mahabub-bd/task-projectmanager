# Project & Task Manager

A comprehensive enterprise-grade project and task management application built with modern web technologies. Features role-based access control, real-time updates, and multi-organization support.

## Features

- **Project Management**: Create, track, and manage projects with milestones and deadlines
- **Task Management**: Comprehensive task tracking with assignments, priorities, and status updates
- **Organization Hierarchy**: Multi-tenant support with organizations and departments
- **User Management**: Team member management with role-based permissions
- **Real-time Updates**: Live notifications and updates via WebSocket connections
- **Authentication & Authorization**: JWT-based auth with granular permission system
- **Audit Logging**: Complete activity tracking for compliance and security
- **Modern UI**: Beautiful, responsive interface built with Radix UI and Tailwind CSS

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
- **Socket.io Client** - Real-time communication

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - ORM for database operations
- **PostgreSQL** - Database
- **Socket.io** - WebSocket server
- **Passport** - Authentication middleware
- **JWT** - Token-based authentication
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
   VITE_WS_URL=ws://localhost:3001
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
│   │   │   └── main.ts   # Application entry point
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

## Default Credentials

After starting the application, you can register a new user or use these defaults (if seeded):

- Email: `admin@example.com`
- Password: `admin123`

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

## Roadmap

- [ ] Mobile responsive design improvements
- [ ] Advanced reporting and analytics
- [ ] Calendar view for tasks and milestones
- [ ] File attachments for tasks and projects
- [ ] Email notifications
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
