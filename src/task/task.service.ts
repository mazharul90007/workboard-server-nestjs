import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async create(createTaskData: CreateTaskDto, creatorId: string) {
    const { assignedToId, ...taskData } = createTaskData;

    //Verify the target user
    const targetUser = await this.prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!targetUser) {
      throw new NotFoundException('Targeted User to assign a task not found');
    }

    const taskDataToCreate = {
      ...taskData,
      assignedToId: assignedToId,
      assignedById: creatorId,
    };
    //Create Task
    const result = await this.prisma.task.create({
      data: taskDataToCreate,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        assignedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return result;
  }

  // findAll() {
  //   return `This action returns all task`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  // update(id: number, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
