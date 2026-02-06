import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
// import { Priority, TaskStatus } from 'src/generated/prisma/enums';
import { Priority, TaskStatus } from 'generated/prisma/enums';

export class TaskFilterDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Filter by ID of the assigned user' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Filter by ID of the creator' })
  @IsOptional()
  @IsString()
  assignedBy?: string;

  @ApiPropertyOptional({ example: '1', default: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @ApiPropertyOptional({ example: '10', default: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}
