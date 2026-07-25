# Logger Documentation

Complete guide to logging in the NestJS backend application.

## Table of Contents

1. [Built-in Logger](#built-in-logger)
2. [Custom Logger Implementation](#custom-logger-implementation)
3. [Using the Logger](#using-the-logger)
4. [Log Levels](#log-levels)
5. [Request Logging](#request-logging)
6. [Error Logging](#error-logging)
7. [File Logging](#file-logging)
8. [Best Practices](#best-practices)

---

## Built-in Logger

NestJS provides a built-in logger class that you can use in your application.

### Basic Usage

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  findAll() {
    this.logger.log('Fetching all users');
    return this.userRepository.find();
  }

  create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    // ... logic
  }
}
```

---

## Custom Logger Implementation

We'll create a custom logger service that extends NestJS's logger with additional features.

### Logger Service

```typescript
// src/common/logger/logger.service.ts
import {
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.printMessage(message, 'LOG', context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printMessage(message, 'ERROR', context);
    if (trace) {
      this.printMessage(trace, 'ERROR', context);
    }
  }

  warn(message: any, context?: string) {
    this.printMessage(message, 'WARN', context);
  }

  debug(message: any, context?: string) {
    this.printMessage(message, 'DEBUG', context);
  }

  verbose(message: any, context?: string) {
    this.printMessage(message, 'VERBOSE', context);
  }

  private printMessage(message: any, level: string, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context || this.context || 'Application';
    const logMessage = `[${timestamp}] [${level}] [${contextStr}] ${this.formatMessage(message)}`;

    console.log(logMessage);

    // Write to file in production
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile(logMessage);
    }
  }

  private formatMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2);
    }
    return String(message);
  }

  private writeToFile(message: string) {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `app-${date}.log`);
    fs.appendFileSync(logFile, message + '\n');
  }
}
```

### Logger Module

```typescript
// src/common/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
```

---

## Using the Logger

### Importing in Services

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(UsersService.name);
  }

  findAll() {
    this.logger.log('Fetching all users');
    this.logger.debug('Executing database query');
    return this.userRepository.find();
  }

  async findOne(id: number) {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
    }

    return user;
  }

  create(createUserDto: CreateUserDto) {
    this.logger.log('Creating new user', createUserDto);
    const user = this.userRepository.create(createUserDto);
    this.logger.debug('User created successfully', user);
    return this.userRepository.save(user);
  }
}
```

### Using in Controllers

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoggerService } from '../common/logger/logger.service';

@Controller('users')
export class UsersController {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(UsersController.name);
  }

  @Get()
  findAll() {
    this.logger.log('GET /users endpoint called');
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('POST /users endpoint called', createUserDto);
    return this.usersService.create(createUserDto);
  }
}
```

---

## Log Levels

The logger supports different levels of logging:

### LOG

General information about application flow:

```typescript
this.logger.log('User logged in successfully');
this.logger.log('Database connection established');
```

### ERROR

Error messages when something goes wrong:

```typescript
this.logger.error('Failed to connect to database', error.stack);
this.logger.error('User creation failed', error.message);
```

### WARN

Warning messages for potentially harmful situations:

```typescript
this.logger.warn('Deprecated API endpoint called');
this.logger.warn('Rate limit exceeded for IP: 127.0.0.1');
```

### DEBUG

Detailed debugging information (development):

```typescript
this.logger.debug('Query parameters:', queryParams);
this.logger.debug('User data:', userObject);
```

### VERBOSE

More detailed debugging information:

```typescript
this.logger.verbose('Function execution started');
this.logger.verbose('Memory usage:', process.memoryUsage());
```

---

## Request Logging

### Logging Middleware

```typescript
// src/common/middleware/logging.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';

    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength || 0}bytes - ${ip} - ${userAgent}`,
      );
    });

    next();
  }
}
```

### Register Middleware

```typescript
// src/app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

@Module({
  // ...
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // Log all routes
  }
}
```

---

## Error Logging

### Exception Filter

```typescript
// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message;
    }

    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status}`,
      JSON.stringify(errorLog, null, 2),
    );

    response.status(status).json({
      statusCode: status,
      timestamp: errorLog.timestamp,
      path: errorLog.path,
      message: message,
    });
  }
}
```

### Register Exception Filter

```typescript
// src/main.ts
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
```

---

## File Logging

### Log Rotation

For production environments, implement log rotation to prevent log files from growing too large:

```typescript
// src/common/logger/logger.service.ts
private writeToFile(message: string) {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Create daily log files
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logsDir, `app-${date}.log`);

  // Check file size and rotate if necessary (> 10MB)
  if (fs.existsSync(logFile)) {
    const stats = fs.statSync(logFile);
    if (stats.size > 10 * 1024 * 1024) {
      const timestamp = new Date().getTime();
      fs.renameSync(logFile, `${logFile}.${timestamp}`);
    }
  }

  fs.appendFileSync(logFile, message + '\n');
}
```

### Log Directories Structure

```
apps/backend/
├── logs/
│   ├── app-2024-01-15.log
│   ├── app-2024-01-16.log
│   ├── app-2024-01-17.log
│   ├── error-2024-01-15.log
│   └── combined-2024-01-15.log
```

---

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ✅ Good
this.logger.log('User created successfully');
this.logger.error('Database connection failed', error.stack);
this.logger.warn('High memory usage detected');

// ❌ Bad
this.logger.error('User created successfully'); // Not an error!
this.logger.log('Everything is fine'); // Too vague
```

### 2. Include Context

```typescript
// ✅ Good
this.logger.log(`User ${userId} logged in at ${timestamp}`);
this.logger.error(`Failed to create user for email: ${email}`, error.stack);

// ❌ Bad
this.logger.log('User logged in');
this.logger.error('Failed to create user');
```

### 3. Avoid Logging Sensitive Data

```typescript
// ✅ Good
this.logger.log(`User logged in with email: ${this.maskEmail(user.email)}`);

// ❌ Bad - Never log passwords!
this.logger.log(`User logged in with password: ${password}`);
this.logger.log(`Credit card: ${creditCardNumber}`);

private maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name[0]}***@${domain}`;
}
```

### 4. Use Structured Logging

```typescript
// ✅ Good - Structured
this.logger.log(
  JSON.stringify({
    event: 'user_created',
    userId: user.id,
    email: user.email,
    timestamp: new Date().toISOString(),
  }),
return `${name[0]}***@${domain}`;
}
```

### 4. Use Structured Logging

```typescript
// ✅ Good - Structured
this.logger.log(
  JSON.stringify({
    event: 'user_created',
    userId: user.id,
    email: user.email,
    timestamp: new Date().toISOString(),
  }),
);

// ✅ Good - Readable
this.logger.log(`User created - ID: ${user.id}, Email: ${user.email}`);
```

### 5. Performance Considerations

```typescript
// Avoid heavy logging in production
if (process.env.NODE_ENV === 'development') {
  this.logger.debug('Detailed debug info:', largeObject);
}

// Use lazy evaluation
this.logger.debug(() => `Expensive operation: ${this.heavyComputation()}`);
```

### 6. Environment-Specific Logging

```typescript
// .env
LOG_LEVEL=debug  // development
LOG_LEVEL=error  // production
LOG_LEVEL=info   // staging

// logger.service.ts
private shouldLog(level: string): boolean {
  const levels = ['verbose', 'debug', 'log', 'warn', 'error'];
  const currentLevel = process.env.LOG_LEVEL || 'log';
  return levels.indexOf(level) >= levels.indexOf(currentLevel);
}
```

---

## Quick Start Example

```typescript
// 1. Import in any service or controller
import { LoggerService } from '../common/logger/logger.service';

// 2. Inject in constructor
constructor(private readonly logger: LoggerService) {
  this.logger.setContext(YourClassName.name);
}

// 3. Use in methods
async createUser(data: CreateUserDto) {
  this.logger.log('Creating new user', data);

  try {
    const user = await this.userRepository.save(data);
    this.logger.log(`User created successfully with ID: ${user.id}`);
    return user;
  } catch (error) {
    this.logger.error('Failed to create user', error.stack);
    throw error;
  }
}
```

---

## Environment Variables

Add to your `.env` file:

```env
# Logger Configuration
NODE_ENV=development  # development | production
LOG_LEVEL=log         # verbose | debug | log | warn | error
LOG_TO_FILE=true      # true | false
LOG_DIR=logs          # Directory for log files
```

---

## Troubleshooting

### Logs not appearing

1. Check log level settings
2. Verify logger is properly initialized
3. Check file permissions for log directory

### Performance issues

1. Reduce debug logging in production
2. Use async file logging
3. Implement log sampling for high-traffic endpoints

### Missing logs

1. Ensure context is set
2. Check logger scope (TRANSIENT for services)
3. Verify logger is exported from module

---

## Additional Resources

- [NestJS Logger Documentation](https://docs.nestjs.com/techniques/logger)
- [Winston Logger Integration](https://docs.nestjs.com/techniques/logger#using-winston)
- [TypeORM Logging](https://typeorm.io/#/logging)
