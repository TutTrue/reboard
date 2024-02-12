'use client'

import { useOptimistic, useState } from 'react'
import { Session } from 'next-auth'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { IList, ITask } from '@/types'
import TaskCard from '@/components/BoardView/TaskCard'
import { updateList } from '@/lib/serverActions/lists'
import ListCardDropDownMenu from './ListComponents/ListCardDropDownMenu'
import AddTaskForm from './ListComponents/AddTaskForm'
import { editListFormSchema } from '@/lib/formSchemas'
import EditListForm from './ListComponents/EditListForn'

interface ListProps {
  list: IList
  session: Session
}

export default function List({ list, session }: ListProps) {
  const [editing, setEditing] = useState(false)

  const [optimisticTasks, addTask] = useOptimistic(
    list.Task,
    (tasks, newTaskName) => {
      const task: ITask = {
        id: Date.now().toString(),
        text: newTaskName as string,
        boardId: list.boardId,
        completed: false,
        createdAt: new Date(),
        Creator: {
          id: session.user.id,
          fullName: session?.user?.name || '',
          username: session.user.username,
          profilePictureURL: session?.user.profilePictureURL || '',
          email: session?.user?.email || '',
        },
        creatorId: session.user.id,
        listId: list.id,
      }

      return [...tasks!, task]
    }
  )

  async function handleListEdit(data: z.infer<typeof editListFormSchema>) {
    const res = await updateList(list.id, data.name)
    setEditing(false)
    if (!res.success) {
      toast.error('Failed to update list')
      return
    }
    toast.success('List updated successfully')
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white shadow-md border p-5 rounded-md min-w-[300px]">
        <header className="flex items-center justify-between gap-3">
          {editing ? (
            <EditListForm list={list} handleListEdit={handleListEdit} />
          ) : (
            <h2 className="text-xl font-semibold">{list.name}</h2>
          )}
          <ListCardDropDownMenu listId={list.id} setEditing={setEditing} />
        </header>
      </div>

      <div className="bg-white">
        {optimisticTasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <AddTaskForm addTask={addTask} listId={list.id} />
    </div>
  )
}
