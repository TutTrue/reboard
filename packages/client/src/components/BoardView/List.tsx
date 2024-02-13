'use client'

import { useOptimistic, useState } from 'react'
import { Session } from 'next-auth'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { IList, ITask, TaskViewMode } from '@/types'
import TaskCard from '@/components/BoardView/TaskCard/TaskCard'
import { updateList } from '@/lib/serverActions/lists'
import ListCardDropDownMenu from './ListComponents/ListCardDropDownMenu'
import AddTaskForm from './ListComponents/AddTaskForm'
import { listFormSchema } from '@/lib/formSchemas'
import EditListForm from './ListComponents/EditListForn'
import { createTask, deleteTask, updateTask } from '@/lib/serverActions/tasks'

interface ListProps {
  list: IList
  session: Session
}

enum TaskActionTypes {
  ADD_TASK,
  TOGGLE_TASK,
  EDIT_TASK_TEXT,
  DELETE_TASK,
}

interface TaskReducerPayload {
  type: TaskActionTypes
  payload: {
    id?: string
    text?: string
    boardId?: string
    listId?: string
    session?: Session
  }
}

function taskReducer(oldState: ITask[], action: TaskReducerPayload): ITask[] {
  const { type, payload } = action

  switch (type) {
    case TaskActionTypes.ADD_TASK: {
      const task: ITask = {
        id: Date.now().toString(),
        text: payload.text!,
        boardId: payload.boardId!,
        completed: false,
        createdAt: new Date().toString(),
        Creator: {
          id: payload.session!.user.id,
          fullName: payload.session!.user?.name || '',
          username: payload.session!.user.username,
          profilePictureURL: payload?.session?.user.profilePictureURL || '',
          email: payload.session?.user?.email || '',
        },
        creatorId: payload.session!.user.id,
        listId: payload.listId!,
      }

      return [...oldState, task]
    }

    case TaskActionTypes.TOGGLE_TASK: {
      return oldState.map((task) =>
        task.id === payload.id ? { ...task, completed: !task.completed } : task
      )
    }

    case TaskActionTypes.EDIT_TASK_TEXT: {
      return oldState.map((task) =>
        task.id === payload.id ? { ...task, text: payload.text! } : task
      )
    }

    case TaskActionTypes.DELETE_TASK: {
      return oldState.filter((task) => task.id !== payload.id)
    }
  }
}

export default function List({ list, session }: ListProps) {
  const [editing, setEditing] = useState(false)
  const [taskViewMode, setTaskViewMode] = useState<TaskViewMode>('SHOW_ALL')
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>(list.Task!)
  const [optimisticTasks, dispathTask] = useOptimistic(
    list.Task!,
    taskReducer
  )

  async function handleListEdit(data: z.infer<typeof listFormSchema>) {
    const res = await updateList(list.id, data.name)
    setEditing(false)
    if (!res.success) {
      toast.error('Failed to update list')
      return
    }
    toast.success('List updated successfully')
  }

  async function handleAddTask(text: string) {
    dispathTask({
      type: TaskActionTypes.ADD_TASK,
      payload: { boardId: list.boardId, listId: list.id, text, session },
    })
    const res = await createTask(list.id, text)
    if (!res.success) {
      toast.error(res.error.error.issues[0].message || 'Failed to add task')
      return
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    dispathTask({ type: TaskActionTypes.TOGGLE_TASK, payload: { id } })
    const res = await updateTask(id, undefined, undefined, !completed)
    if (!res.success) {
      toast.error('Error updating task')
      return
    }
  }

  async function handleDelete(id: string) {
    dispathTask({ type: TaskActionTypes.DELETE_TASK, payload: { id } })
    const res = await deleteTask(id)
    if (!res.success) {
      toast.error('Error deleting task')
      return
    }
  }

  function handleTaskViewChange(mode: TaskViewMode) {
    // TODO fix the optimistic UI bug
    setTaskViewMode(mode)
    // if (mode === 'SHOW_ALL') setFilteredTasks(list.Task!)
    // else if (mode === 'SHOW_COMPLETED') setFilteredTasks(list.Task!.filter(task => task.completed))
    // else if (mode === 'SHOW_UNCOMPLETED') setFilteredTasks(list.Task!.filter(task => !task.completed))
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
          <ListCardDropDownMenu
            listId={list.id}
            setEditing={setEditing}
            taskViewMode={taskViewMode}
            setTaskViewMode={handleTaskViewChange}
          />
        </header>
      </div>

      <div className="bg-white">
        {optimisticTasks?.map((task) => (
          <TaskCard
            key={task.id}
            handleDelete={handleDelete}
            handleToggle={handleToggle}
            task={task}
          />
        ))}
      </div>

      <AddTaskForm handleAddTask={handleAddTask} listId={list.id} />
    </div>
  )
}
