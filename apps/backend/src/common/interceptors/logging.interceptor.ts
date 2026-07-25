import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // Extract user info if available
    const user = request.user;
    const userInfo = user
      ? `User: ${user.email || user.id} | `
      : '';

    // Log request
    this.logger.log(
      `➡️  [REQUEST] ${method} ${url} | ${userInfo}IP: ${ip} | User-Agent: ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.log(
            `✅ [RESPONSE] ${method} ${url} | Status: ${statusCode} | ${userInfo}Duration: ${duration}ms`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error(
            `❌ [ERROR] ${method} ${url} | Status: ${statusCode} | ${userInfo}Duration: ${duration}ms | Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
