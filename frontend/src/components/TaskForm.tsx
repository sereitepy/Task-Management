'use client'

import { useState, useEffect } from 'react'
import { Task, TaskStatus, CreateTaskDto } from '@/types/task'

interface TaskFormProps {
  task?: Task
  onSubmit: (data: CreateTaskDto) => void
  onCancel: () => void
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    deadline: '',
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      deadline: formData.deadline || undefined,
      description: formData.description || undefined,
    })
  }

  return (
    <div className='fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
        <h2 className='text-xl font-semibold mb-4 text-black'>
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Title *
            </label>
            <input
              type='text'
              required
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              className='w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className='w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              value={formData.status}
              onChange={e =>
                setFormData({
                  ...formData,
                  status: e.target.value as TaskStatus,
                })
              }
              className='w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.DONE}>Done</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Deadline
            </label>
            <input
              type='date'
              value={formData.deadline}
              onChange={e =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className='w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex space-x-3 pt-4'>
            <button
              type='submit'
              className='flex-1 bg-blue-600 text-white cursor-pointer py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {task ? 'Update' : 'Create'}
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='flex-1 bg-gray-300 cursor-pointer text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
