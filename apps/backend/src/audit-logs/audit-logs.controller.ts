import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { AuditLogsService } from './audit-logs.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

@ApiTags('Audit-logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) { }

  @Get()
  @RequirePermissions('audit:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all audit logs with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryAuditLogsDto): Promise<SuccessResponse> {
    const result = await this.auditLogsService.findAll(query);

    return {
      message: 'Audit logs retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get(':id')
  @RequirePermissions('audit:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const auditLog = await this.auditLogsService.findOne(id);

    return {
      message: 'Audit log retrieved successfully',
      statusCode: HttpStatus.OK,
      data: auditLog,
    };
  }

  @Get('entity/:entityType/:entityId')
  @RequirePermissions('audit:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get audit logs by entity' })
  @ApiResponse({ status: 200, description: 'Entity audit logs retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
  ): Promise<SuccessResponse> {
    const auditLogs = await this.auditLogsService.findByEntity(entityType, entityId);

    return {
      message: 'Entity audit logs retrieved successfully',
      statusCode: HttpStatus.OK,
      data: auditLogs || [],
    };
  }

  @Get('user/:userId')
  @RequirePermissions('audit:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get audit logs by user' })
  @ApiResponse({ status: 200, description: 'User audit logs retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findByUser(
    @Param('userId') userId: number,
    @Query('limit') limit?: string,
  ): Promise<SuccessResponse> {
    const auditLogs = await this.auditLogsService.findByUser(
      userId,
      limit ? parseInt(limit) : 100,
    );

    return {
      message: 'User audit logs retrieved successfully',
      statusCode: HttpStatus.OK,
      data: auditLogs || [],
    };
  }

  @Get('export')
  @RequirePermissions('audit:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export audit logs as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async exportAuditLogs(@Query() query: QueryAuditLogsDto, @Res() res: Response): Promise<void> {
    const csvData = await this.auditLogsService.exportToCsv(query);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvData);
  }
}
