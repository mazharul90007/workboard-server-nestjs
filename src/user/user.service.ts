import { Injectable } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //==============Get all User==================
  async findAll() {
    const users = await this.prisma.user.findMany({
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
    });
    return users;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
