import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestTrackingService } from '../services/request-tracking.service';

@Injectable()
export class RequestTrackingInterceptor implements NestInterceptor {
  constructor(private readonly trackingService: RequestTrackingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    this.trackingService.incrementRequests();
    this.trackingService.logRequest(method, url);

    return next.handle().pipe(
      finalize(() => {
        this.trackingService.decrementRequests();
      })
    );
  }
}
