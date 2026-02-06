import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
// import { Priority, TaskStatus } from 'src/generated/prisma/enums';
import { Priority, TaskStatus } from 'generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix Authentication Bug' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'The JWT token expires too early in the user controller.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 'uuid-of-the-assigned-user' })
  @IsUUID()
  @IsNotEmpty()
  assignedToId: string;
}
