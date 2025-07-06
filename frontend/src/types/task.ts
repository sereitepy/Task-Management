export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  deadline?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status?: TaskStatus
  deadline?: string
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}
