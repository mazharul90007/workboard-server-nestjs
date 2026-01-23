import { IsEnum } from 'class-validator';
import { TaskStatus } from 'generated/prisma/enums';

export class updateTaskStatusDto {
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
