import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exception instanceof BadRequestException) {
        // Handle validation errors
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
          const responseObj = exceptionResponse as any;
          message = responseObj.message || 'Validation failed';
          details = responseObj.error || responseObj.message;

          // Format validation errors
          if (Array.isArray(message)) {
            message = 'Validation failed';
            details = message;
          }
        } else {
          message = exceptionResponse as string;
        }
      } else {
        message = exception.message;
        if (typeof exceptionResponse === 'object') {
          details = exceptionResponse;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Skip logging for common 404s that don't need attention
    const skipLoggingPaths = ['/favicon.ico', '/robots.txt', '/apple-touch-icon.png', '/apple-touch-icon-precomposed.png'];
    const shouldSkipLogging = status === HttpStatus.NOT_FOUND && skipLoggingPaths.some(path => request.url.includes(path));

    if (!shouldSkipLogging) {
      // Log the error for debugging
      console.error('Exception:', {
        status,
        message,
        details,
        path: request.url,
        method: request.method,
        exception,
      });
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
