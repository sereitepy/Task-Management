import axios from 'axios'
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '@/types/task'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const taskApi = {
  // Get all tasks
  getTasks: async (status?: TaskStatus): Promise<Task[]> => {
    const response = await api.get('/tasks', {
      params: status ? { status } : {},
    })
    return response.data
  },

  // Get single task
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  // Create task
  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post('/tasks', data)
    return response.data
  },

  // Update task
  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, data)
    return response.data
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}
