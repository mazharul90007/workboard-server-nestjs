import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  //===================Create User====================
  async create(payload: CreateAuthDto) {
    const { email, password } = payload;

    //check exist user
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exist');
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Generate a unique memberId
    const memberId = await this.generateUniqueMemberId();

    //Create or SignUp User
    const user = await this.prisma.user.create({
      data: {
        memberId,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        memberId: true,
        email: true,
        name: true,
        profilePhoto: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  }

  // Helper method to generate a unique 6-digit numeric ID
  private async generateUniqueMemberId(): Promise<string> {
    let isUnique = false;
    let newId = '';

    while (!isUnique) {
      // Generate random 6-digit number as string
      newId = Math.floor(100000 + Math.random() * 900000).toString();

      // Check database to see if it exists
      const existing = await this.prisma.user.findUnique({
        where: { memberId: newId },
      });

      if (!existing) {
        isUnique = true;
      }
    }
    return newId;
  }
}
