import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { GetUser } from 'src/user/decorators/get-user.decorator';
// import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

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

  // @Get()
  // findAll() {
  //   return this.taskService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.taskService.update(+id, updateTaskDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskService.remove(+id);
  // }
}
