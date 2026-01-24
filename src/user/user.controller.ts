import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
// import { UserRole } from 'src/generated/prisma/enums';
import { UserRole } from 'generated/prisma/enums';
import { UserFilterDto } from './dto/user-filter.dto';
import { AuthUser } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //==============Get all User==================
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
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

  //================Get Single User==================
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @GetUser() user: AuthUser) {
    const result = await this.userService.findOne(id, user);

    return {
      success: true,
      message: 'User data fetched successfully',
      data: result,
    };
  }

  //===================Update User==================
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserData: UpdateUserDto) {
    const result = await this.userService.update(id, updateUserData);

    return {
      success: true,
      message: 'User data updated successfully',
      data: result,
    };
  }

  //===================Delete User==================
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async removeUser(
    @Param('id') targetId: string,
    @GetUser('role') role: UserRole,
  ) {
    await this.userService.softDeleteUser(targetId, role);

    return {
      success: true,
      message: 'User deleted Successfully',
      data: null,
    };
  }

  //===================Update User Profile photo==================
  @Patch('profile-image/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id') targetUserId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() currentUser: AuthUser,
  ) {
    const result = await this.userService.updateProfileImage(
      targetUserId,
      file,
      currentUser,
    );

    return {
      success: true,
      message: 'Your Profile photo has been updated successfully',
      data: result,
    };
  }
}
