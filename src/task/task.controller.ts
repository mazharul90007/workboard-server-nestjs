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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
// import { UserRole } from 'src/generated/prisma/enums';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { AuthUser } from 'src/user/entities/user.entity';
import { TaskFilterDto } from './dto/task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserRole } from 'generated/prisma/enums';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //==================Create Task====================
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.LEADER)
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
  async findAll(@GetUser() user: AuthUser, @Query() query: TaskFilterDto) {
    const result = await this.taskService.findAll(user, query);
    return {
      success: true,
      message: 'Tasks fetched successfully',
      data: result,
    };
  }

  //==================Get User related Task by Id====================
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
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

  //==================Delete Task by Id====================
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async deleteTask(@Param('id') taskId: string, @GetUser() user: AuthUser) {
    await this.taskService.deleteTask(taskId, user);

    return {
      success: true,
      message: 'Task has been permanently removed from the system',
      data: null,
    };
  }
}
