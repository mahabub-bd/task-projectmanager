import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @RequirePermissions('tasks:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const task = await this.tasksService.create(createTaskDto, userId);

    return {
      message: 'Task created successfully',
      statusCode: HttpStatus.CREATED,
      data: task,
    };
  }

  @Get()
  @RequirePermissions('tasks:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryTasksDto): Promise<SuccessResponse> {
    const result = await this.tasksService.findAll(query);

    return {
      message: 'Tasks retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('overdue')
  @RequirePermissions('tasks:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all overdue tasks' })
  @ApiResponse({ status: 200, description: 'Overdue tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getOverdueTasks(): Promise<SuccessResponse> {
    const tasks = await this.tasksService.getOverdueTasks();

    return {
      message: 'Overdue tasks retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tasks,
    };
  }

  @Get('department/:departmentId')
  @RequirePermissions('tasks:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks by department' })
  @ApiResponse({ status: 200, description: 'Department tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getTasksByDepartment(
    @Param('departmentId') departmentId: number,
  ): Promise<SuccessResponse> {
    const tasks = await this.tasksService.getTasksByDepartment(departmentId);

    return {
      message: 'Department tasks retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tasks,
    };
  }

  @Get('user/:userId')
  @RequirePermissions('tasks:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks by user' })
  @ApiResponse({ status: 200, description: 'User tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getTasksByUser(@Param('userId') userId: number): Promise<SuccessResponse> {
    const tasks = await this.tasksService.getTasksByUser(userId);

    return {
      message: 'User tasks retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tasks,
    };
  }

  @Get('my-tasks')
  @RequirePermissions('tasks:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user tasks' })
  @ApiResponse({ status: 200, description: 'Your tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyTasks(@CurrentUser('id') userId: number): Promise<SuccessResponse> {
    const tasks = await this.tasksService.getTasksByUser(userId);

    return {
      message: 'Your tasks retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tasks,
    };
  }

  @Get(':id')
  @RequirePermissions('tasks:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const task = await this.tasksService.findOne(id);

    return {
      message: 'Task retrieved successfully',
      statusCode: HttpStatus.OK,
      data: task,
    };
  }

  @Patch(':id')
  @RequirePermissions('tasks:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const task = await this.tasksService.update(id, updateTaskDto, userId);

    return {
      message: 'Task updated successfully',
      statusCode: HttpStatus.OK,
      data: task,
    };
  }

  @Patch(':id/status')
  @RequirePermissions('tasks:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const task = await this.tasksService.updateStatus(id, updateTaskStatusDto, userId);

    return {
      message: 'Task status updated successfully',
      statusCode: HttpStatus.OK,
      data: task,
    };
  }

  @Post(':id/assign')
  @RequirePermissions('tasks:assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign users to task' })
  @ApiResponse({ status: 200, description: 'Users assigned successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async assignUsers(
    @Param('id') id: number,
    @Body() assignTaskDto: AssignTaskDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const task = await this.tasksService.assignUsers(id, assignTaskDto, userId);

    return {
      message: 'Users assigned successfully',
      statusCode: HttpStatus.OK,
      data: task,
    };
  }

  @Delete(':id')
  @RequirePermissions('tasks:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.tasksService.remove(id, userId);

    return {
      message: 'Task deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
