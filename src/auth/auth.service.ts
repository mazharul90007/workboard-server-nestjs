import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
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

  //===================Login User====================
  async loginUser(payload: LoginAuthDto) {
    const { email, password } = payload;

    //find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    //verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    //generate access token
    const accessToken = this.jwtService.sign(jwtPayload);

    //generate refresh token
    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }
}
