import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //===================Create User====================
  @Post('/signup')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateAuthDto) {
    const result = await this.authService.create(payload);

    return {
      success: true,
      message: 'User registered successfully',
      data: result,
    };
  }

  //===================Login User====================
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() payload: LoginAuthDto) {
    const result = await this.authService.loginUser(payload);

    return {
      success: true,
      message: 'User Login Successful',
      data: result,
    };
  }

  //==========Get Access Token from Refresh Token==========
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = this.authService.refreshAccessToken(refreshToken);

    return {
      success: true,
      message: 'Access token refreshed successfully',
      data: result,
    };
  }
}
