import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthUser } from 'src/user/entities/user.entity';
import { UserRole } from 'src/generated/prisma/enums';
import { Prisma } from 'src/generated/prisma/client';
import { TaskFilterDto } from './dto/task-filter.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  //==================Create Task====================
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

  //==================Get All Task====================
  async findAll(user: AuthUser, query: TaskFilterDto) {
    const { id, role } = user;
    const { status, priority, assignedTo, assignedBy, page, limit } = query;

    //Convert strings to numbers
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    const skip = (p - 1) * l;

    const andCondition: Prisma.TaskWhereInput[] = [{ isDeleted: false }];

    //Apply conditon if user is not Admin or Super Admin
    const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
    if (!isAdmin) {
      andCondition.push({
        OR: [{ assignedToId: id }, { assignedById: id }],
      });
    }

    //status and priority filters
    if (status) {
      andCondition.push({ status });
    }
    if (priority) {
      andCondition.push({ priority });
    }

    //nested assignedTo filter
    if (assignedTo) {
      andCondition.push({
        assignedTo: {
          OR: [
            { name: { contains: assignedTo, mode: 'insensitive' } },
            { email: { contains: assignedTo, mode: 'insensitive' } },
          ],
        },
      });
    }

    //nested assignedBy filter
    if (assignedBy) {
      andCondition.push({
        assignedBy: {
          OR: [
            { name: { contains: assignedBy, mode: 'insensitive' } },
            { email: { contains: assignedBy, mode: 'insensitive' } },
          ],
        },
      });
    }

    //Final where object
    const whereCondition: Prisma.TaskWhereInput = { AND: andCondition };

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where: whereCondition,
        skip,
        take: l,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          assignedBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where: whereCondition }),
    ]);
    return {
      meta: {
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l),
      },
      data: tasks,
    };
  }

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
