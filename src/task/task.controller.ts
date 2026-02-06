import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { AuthUser } from 'src/user/entities/user.entity';
import { TaskFilterDto } from './dto/task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserRole } from 'generated/prisma/enums';
import { updateTaskStatusDto } from './dto/update-task-status.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Task Management')
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //==================Create Task====================
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.LEADER)
  @ApiOperation({ summary: 'Create a new task (Leaders/Admins only)' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  async create(
    @Body() createTaskData: CreateTaskDto,
    @GetUser('id') creatorId: string,
  ) {
    const result = await this.taskService.create(createTaskData, creatorId);

    return {
      success: true,
      message: 'Task created successfully',
      data: result,
    };
  }

  //==================Get User related All Task====================
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get all tasks related to the current user' })
  async findAll(@GetUser() user: AuthUser, @Query() query: TaskFilterDto) {
    const result = await this.taskService.findAll(user, query);
    return {
      success: true,
      message: 'Tasks fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  //==================Get User related Task by Id====================
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get details of a specific task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  async findOne(@Param('id') taskId: string, @GetUser() user: AuthUser) {
    const result = await this.taskService.findOne(taskId, user);

    return {
      success: true,
      message: 'Task fetched successfully',
      data: result,
    };
  }

  //==================Update Task by Id====================
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Update task content (Leaders/Admins only)' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @Roles(UserRole.LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: AuthUser,
  ) {
    const result = await this.taskService.update(taskId, updateTaskDto, user);

    return {
      success: true,
      message: 'Task updated successfully',
      data: result,
    };
  }

  //=============Update Task Status by Id===========
  @Patch('/status/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update only the status of a task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') taskId: string,
    @Body() updateUserStatus: updateTaskStatusDto,
    @GetUser() user: AuthUser,
  ) {
    const result = await this.taskService.updateTaskStatus(
      taskId,
      updateUserStatus,
      user,
    );
    return {
      success: true,
      message: 'Task status updated successfully',
      data: result,
    };
  }

  //==================Delete Task by Id====================
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Permanently delete a task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  async deleteTask(@Param('id') taskId: string, @GetUser() user: AuthUser) {
    await this.taskService.deleteTask(taskId, user);

    return {
      success: true,
      message: 'Task has been permanently removed from the system',
      data: null,
    };
  }
}
