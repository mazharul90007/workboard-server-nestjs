import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
// import { UserRole, UserStatus } from 'src/generated/prisma/enums';
import { UserRole, UserStatus } from 'generated/prisma/enums';

export class UserFilterDto {
  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    enum: UserStatus,
    description: 'Filter by account status',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    example: 'Mazharul',
    description: 'Search name, email, or phone',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({
    example: '1',
    default: '1',
    description: 'Page number',
  })
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @ApiPropertyOptional({
    example: '10',
    default: '10',
    description: 'Results per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}
