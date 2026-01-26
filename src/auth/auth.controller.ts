import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly isProduction = process.env.NODE_ENV === 'production';

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
  async loginUser(
    @Body() payload: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.loginUser(payload);

    //set accessToken cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.isProduction ? true : false,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    //set refreshToken cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isProduction ? true : false,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      success: true,
      message: 'User Login Successful',
      data: { user },
    };
  }

  //==========Get Access Token from Refresh Token==========
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Get token from cookie
    const refreshToken = (req.cookies as Record<string, string | undefined>)?.[
      'refreshToken'
    ];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const result = await this.authService.refreshAccessToken(refreshToken);

    // Set the NEW access token back into the cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: this.isProduction ? true : false,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });
    return {
      success: true,
      message: 'Access token refreshed successfully',
    };
  }

  // ================= Logout Endpoint =================
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    // Clear Access Token
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: this.isProduction ? true : false,
      sameSite: this.isProduction ? 'none' : 'lax',
      path: '/',
    });

    // Clear Refresh Token
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.isProduction ? true : false,
      sameSite: this.isProduction ? 'none' : 'lax',
      path: '/',
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
