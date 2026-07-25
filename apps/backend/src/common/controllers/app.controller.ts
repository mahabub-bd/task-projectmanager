import { Controller, Get, Req, Header } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Welcome message with API information',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        version: { type: 'string' },
        api: { type: 'string' },
        docs: { type: 'string' },
      },
    },
  })
  root(@Req() req: Request) {
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    return {
      message: 'Welcome to Task Management System API',
      version: '1.0.0',
      api: `${baseUrl}/api`,
      docs: `${baseUrl}/api/docs`,
    };
  }

  @Get('favicon.ico')
  @Header('Content-Type', 'image/x-icon')
  @ApiOperation({ summary: 'Favicon (placeholder)' })
  favicon() {
    // Return empty response to prevent 404 errors
    return '';
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Robots.txt for API' })
  robots() {
    return 'User-agent: *\nDisallow: /api\n';
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Health check response',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
