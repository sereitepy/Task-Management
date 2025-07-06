import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Status } from 'generated/prisma';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
