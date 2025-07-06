'use client'

import { Task, TaskStatus } from '@/types/task'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800',
}

const statusLabels = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== TaskStatus.DONE

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
        isOverdue ? 'border-red-500' : 'border-blue-500'
      }`}
    >
      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>{task.title}</h3>
      </div>

      {task.description && (
        <p className='text-gray-600 mb-4'>{task.description}</p>
      )}

      <div className='flex mb-4'>
        {task.deadline && (
          <div
            className={`text-sm ${
              isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}
          >
            Due: {format(new Date(task.deadline), 'MMM d, yyyy')}
          </div>
        )}
      </div>

      <div className='flex mb-4'>
        <select
          value={task.status}
          onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[task.status]
          }`}
        >
          {Object.values(TaskStatus).map(status => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <div className='flex justify-end space-x-2 mt-3'>
        <button
          onClick={() => onEdit(task)}
          className='text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer'
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className='text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer'
        >
          Delete
        </button>
      </div>
    </div>
  )
}
