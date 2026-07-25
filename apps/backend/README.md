# Backend API

NestJS backend with TypeORM and PostgreSQL.

## Features

- NestJS framework
- TypeORM integration
- PostgreSQL database
- Environment configuration
- CRUD operations example (Users module)
- Validation pipes
- CORS enabled

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=my_database
DB_SYNCHRONIZE=true
PORT=3000
```

## Database Setup

1. Make sure PostgreSQL is installed and running
2. Create a database:

```sql
CREATE DATABASE my_database;
```

3. Update the `.env` file with your database credentials

## Available Scripts

- `pnpm run dev` - Start development server with watch mode
- `pnpm run build` - Build the application
- `pnpm run start:prod` - Start production server
- `pnpm run lint` - Run ESLint

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get a user by ID
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Example Requests

Create a user:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe", "age": 30}'
```

Get all users:
: "user@example.com", "name": "John Doe", "age": 30}'

````

Get all users:

```bash
curl http://localhost:3000/users
````

## Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root module
└── users/               # Users module
    ├── users.controller.ts
    ├── users.service.ts
    ├── users.module.ts
    ├── user.entity.ts
    ├── create-user.dto.ts
    └── update-user.dto.ts
```
