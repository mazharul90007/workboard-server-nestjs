import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateAuthDto) {
    const result = await this.authService.create(payload);

    return {
      success: true,
      message: 'User registered successfully',
      data: result,
    };
  }
}
