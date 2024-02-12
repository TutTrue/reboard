import { useRef } from 'react'
import toast from 'react-hot-toast'

import { createTask } from '@/lib/serverActions/tasks'
import { Input } from '@/components/ui/input'

interface AddTaskFormProps {
  listId: string
  handleAddTask: (text: string) => void
}

export default function AddTaskForm({
  listId,
  handleAddTask,
}: AddTaskFormProps) {
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    ref.current?.reset()
    const text = formData.get('todo-text') as string
    handleAddTask(text)
  }

  return (
    <form ref={ref} action={handleSubmit}>
      <Input
        name="todo-text"
        placeholder="Add a task..."
        className="border-2 bg-gray-200 border-gray-400"
      />
    </form>
  )
}
