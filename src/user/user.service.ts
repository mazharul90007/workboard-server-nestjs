import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { Prisma, UserRole } from 'src/generated/prisma/client';
import { AuthUser } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //==============Get all User==================
  async findAll(query: UserFilterDto) {
    const { role, status, searchTerm, page, limit } = query;

    //Convert strings to numbers
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    const skip = (p - 1) * l;

    //dynamic condition
    const where: Prisma.UserWhereInput = {};
    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        select: {
          id: true,
          memberId: true,
          email: true,
          name: true,
          role: true,
          profilePhoto: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return {
      meta: {
        page: p,
        limit: l,
        total,
        totalPage: Math.ceil(total / l),
      },
      data,
    };
  }

  //==============Get Single User==================

  async findOne(id: string, currentUser: AuthUser) {
    const isAdmin = (
      [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]
    ).includes(currentUser.role);

    const isSelf = currentUser.id === id;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException(
        'Your are not authorized to view this profile',
      );
    }

    //Fetch Data
    const result = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        memberId: true,
        email: true,
        name: true,
        profilePhoto: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('User not found');
    }

    return result;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
