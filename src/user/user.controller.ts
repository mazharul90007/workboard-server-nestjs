import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { UserFilterDto } from './dto/user-filter.dto';
import { AuthUser } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
// import * as express from 'express';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //==============Get all User==================
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: UserFilterDto) {
    const result = await this.userService.findAll(query);
    return {
      success: true,
      message: 'All user data has been fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  //==============Get Single User==================
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: string, @GetUser() user: AuthUser) {
    const result = await this.userService.findOne(id, user);

    return {
      success: true,
      message: 'User data fetched successfully',
      data: result,
    };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
