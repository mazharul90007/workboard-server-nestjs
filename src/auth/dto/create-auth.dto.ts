import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

export class CreateAuthDto {
  @ApiProperty({ example: 'member@gmail.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ example: 'Mazharul Islam' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '0193863256' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.MEMBER,
    default: UserRole.MEMBER,
  })
  @IsEnum(UserRole, {
    message: 'Role must be either SUPER_ADMIN, ADMIN, LEADER, or MEMBER',
  })
  @IsOptional()
  role?: UserRole;
}
