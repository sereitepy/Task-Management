'use client'

import { useState, useEffect } from 'react'
import { Task, TaskStatus, CreateTaskDto } from '@/types/task'
import { taskApi } from '@/lib/api'
import TaskCard from '@/components/TaskCard'
import TaskForm from '@/components/TaskForm'
import Link from 'next/link'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await taskApi.getTasks()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running.')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (data: CreateTaskDto) => {
    try {
      await taskApi.createTask(data)
      setShowForm(false)
      await loadTasks()
    } catch (err) {
      setError('Failed to create task')
      console.error('Error creating task:', err)
    }
  }

  const handleUpdateTask = async (data: CreateTaskDto) => {
    if (!editingTask) return

    try {
      await taskApi.updateTask(editingTask.id, data)
      setEditingTask(null)
      await loadTasks()
    } catch (err) {
      setError('Failed to update task')
      console.error('Error updating task:', err)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await taskApi.deleteTask(id)
      await loadTasks()
    } catch (err) {
      setError('Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await taskApi.updateTask(id, { status })
      await loadTasks()
    } catch (err) {
      setError('Failed to update task status')
      console.error('Error updating task status:', err)
    }
  }

  const filteredTasks = tasks.filter(
    task => statusFilter === 'ALL' || task.status === statusFilter
  )

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-xl'>Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <Link href="/properties">Property Filtering</Link>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4 md:mb-0'>
            Task Management System
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className='bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Create Task
          </button>
        </div>

        {error && (
          <div className='mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            {error}
            <button
              onClick={() => setError(null)}
              className='float-right text-red-700 hover:text-red-900'
            >
              ×
            </button>
          </div>
        )}

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Filter by status:
          </label>
          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(e.target.value as TaskStatus | 'ALL')
            }
            className='px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='ALL'>All Tasks</option>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && !loading && (
          <div className='text-center py-12'>
            <div className='text-gray-500 text-lg'>
              {statusFilter === 'ALL'
                ? 'No tasks yet'
                : `No ${statusFilter.toLowerCase().replace('_', ' ')} tasks`}
            </div>
            <p className='text-gray-400 mt-2'>
              Create your first task to get started!
            </p>
          </div>
        )}

        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
