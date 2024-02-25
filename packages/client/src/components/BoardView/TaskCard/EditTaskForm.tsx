import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { taskFormSchema } from '@/lib/formSchemas'
import { ITask } from '@/types'

interface EditTaskForm {
  task: ITask
  handleTaskEdit: (data: z.infer<typeof taskFormSchema>) => void
}

export default function EditTaskForm({ task, handleTaskEdit }: EditTaskForm) {
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      text: task.text,
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleTaskEdit)}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your new task text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
