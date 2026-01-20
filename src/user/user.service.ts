import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFilterDto } from './dto/user-filter.dto';
// import { Prisma, UserRole, UserStatus } from 'src/generated/prisma/client';
import { Prisma, UserRole, UserStatus } from 'generated/prisma/client';
import { AuthUser } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

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
        take: l,
        select: {
          id: true,
          memberId: true,
          email: true,
          name: true,
          role: true,
          status: true,
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
        totalPages: Math.ceil(total / l),
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

  //===================Update User==================
  async update(id: string, updateUserData: UpdateUserDto) {
    //check user
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException('User does not exist');
    }

    //Hash password
    if (updateUserData.password) {
      const hashPassword = await bcrypt.hash(updateUserData.password, 10);
      updateUserData.password = hashPassword;
    }

    //Update data
    const result = await this.prisma.user.update({
      where: { id },
      data: updateUserData,
      select: {
        id: true,
        memberId: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
    return result;
  }

  //===================Delete User==================
  async softDeleteUser(targetUserId: string, requesterRole: UserRole) {
    //Strict Permission Check, Double check the role
    if (
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Only Administrators can delete user');
    }

    //verify request user
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException('User not found or already deleted');
    }

    //delete user and all the task related to that user
    return await this.prisma.$transaction(async (tx) => {
      //1. hard delete all task related to the user
      const deleteTasks = await tx.task.deleteMany({
        where: {
          OR: [{ assignedToId: targetUserId }, { assignedById: targetUserId }],
        },
      });

      //2. Update user status to DELETED
      const updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: { status: UserStatus.DELETED },
      });

      return {
        user: updatedUser,
        deletedTasksCount: deleteTasks.count,
      };
    });
  }

  //==================Update Profile photo==================

  async updateProfileImage(
    targetUserId: string,
    file: Express.Multer.File,
    currentUser: AuthUser,
  ) {
    //Authorization Logic
    const isAdmin =
      currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';
    const isSelf = currentUser.id === targetUserId;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException(
        'You do not have permission to update this users photo',
      );
    }

    //Upload new image to Cloudinary
    const uploadResult = await this.cloudinary.uploadImage(file);
    const newImageUrl = uploadResult.secure_url;

    //Find current user to check for existing photo
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { profilePhoto: true },
    });

    //Delete old image from cloudinary if it exists
    if (user?.profilePhoto) {
      const publicId = this.cloudinary.extractPublicIdFromUrl(
        user.profilePhoto,
      );
      if (publicId) {
        try {
          await this.cloudinary.deleteImage(publicId);
        } catch (error) {
          console.error('Failed to delete old image from Cloudinary:', error);
        }
      }
    }

    //Update database with new url
    try {
      return await this.prisma.user.update({
        where: { id: targetUserId },
        data: { profilePhoto: newImageUrl },
        select: {
          id: true,
          profilePhoto: true,
          email: true,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Failed to update user profile in database',
      );
    }
  }
}
