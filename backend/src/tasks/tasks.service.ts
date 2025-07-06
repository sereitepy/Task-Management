import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { Status } from 'generated/prisma';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { deadline, ...rest } = createTaskDto;

    return this.prisma.task.create({
      data: {
        ...rest,
        deadline: deadline ? new Date(deadline) : null,
      },
    });
  }

  async findAll(status?: Status) {
    return this.prisma.task.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id); // Check if exists

    const { deadline, ...rest } = updateTaskDto;

    return this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
