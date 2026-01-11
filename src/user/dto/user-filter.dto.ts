import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from 'src/generated/prisma/enums';

export class UserFilterDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}
