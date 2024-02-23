'use client'
import Image from 'next/image'

import { HiOutlineCheck } from 'react-icons/hi2'

import { ITask } from '@/types'
import TaskDropDownMenu from './TaskDropdownMenu'
import { useState } from 'react'
import EditTaskForm from './EditTaskForm'
import { taskFormSchema } from '@/lib/formSchemas'
import { z } from 'zod'

interface TaskCardProps {
  task: ITask
  handleToggle: (id: string, completed: boolean) => void
  handleDelete: (id: string) => void
  handleEdit: (id: string, text: string) => void
}

export default function TaskCard({
  task,
  handleToggle,
  handleDelete,
  handleEdit,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  function handleIsEditing() {
    setIsEditing(true)
  }

  async function handleTaskEdit(data: z.infer<typeof taskFormSchema>) {
    handleEdit(task.id, data.text)
    setIsEditing(false)
  }

  return (
    <div className="bg-white px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Image
          src={task.Creator?.profilePictureURL || '/images/default-user.png'}
          alt="user image"
          width={25}
          height={25}
          className="rounded-full border-2 border-white"
        />
        <button
          className={`w-5 h-5 rounded text-sm text-white flex items-center justify-center ${
            task.completed ? 'bg-indigo-500' : 'bg-gray-300'
          }`}
          onClick={() => handleToggle(task.id, task.completed)}
        >
          {task.completed ? <HiOutlineCheck size={18} /> : ''}
        </button>
        {isEditing ? (
          <EditTaskForm handleTaskEdit={handleTaskEdit} task={task} />
        ) : (
          <span className={task.completed ? 'line-through' : ''}>
            {task.text}
          </span>
        )}
      </div>

      <TaskDropDownMenu
        task={task}
        handleDelete={handleDelete}
        handleIsEditing={handleIsEditing}
      />
    </div>
  )
}
