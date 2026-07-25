import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestTrackingService {
  private activeRequests = 0;
  private maxConcurrent = 0;
  private totalRequests = 0;
  private startTime = Date.now();

  incrementRequests(): void {
    this.activeRequests++;
    this.totalRequests++;

    if (this.activeRequests > this.maxConcurrent) {
      this.maxConcurrent = this.activeRequests;
    }
  }

  decrementRequests(): void {
    this.activeRequests--;
  }

  getStats() {
    const uptime = Date.now() - this.startTime;
    return {
      activeRequests: this.activeRequests,
      maxConcurrent: this.maxConcurrent,
      totalRequests: this.totalRequests,
      uptime: `${Math.floor(uptime / 1000)}s`,
      requestsPerSecond: (this.totalRequests / (uptime / 1000)).toFixed(2),
    };
  }

  logRequest(method: string, url: string) {
    console.log(`[${new Date().toISOString()}] ${method} ${url} - Active: ${this.activeRequests}, Max: ${this.maxConcurrent}, Total: ${this.totalRequests}`);
  }
}
