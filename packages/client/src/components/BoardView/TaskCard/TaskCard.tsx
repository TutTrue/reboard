import Image from 'next/image'
import toast from 'react-hot-toast'

import { HiOutlineCheck } from 'react-icons/hi2'

import { ITask } from '@/types'
import { renameTask } from '@/lib/serverActions/tasks'
import TaskDropDownMenu from './TaskDropdownMenu'

export default function TaskCard({ task }: { task: ITask }) {
  async function handleToggleComplete() {
    const res = await renameTask(task.id, undefined, undefined, !task.completed)

    if (!res.success) {
      toast.error('Error updating task')
      return
    }

    toast.success('Task updated successfully')
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
          onClick={handleToggleComplete}
        >
          {task.completed ? <HiOutlineCheck size={18} /> : ''}
        </button>
        <span className={task.completed ? 'line-through' : ''}>
          {task.text}
        </span>
      </div>

      <TaskDropDownMenu task={task} />
    </div>
  )
}
