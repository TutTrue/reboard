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
import { listFormSchema } from '@/lib/formSchemas'
import { IList } from '@/types'

interface EditListForm {
  list: IList
  handleListEdit: (data: z.infer<typeof listFormSchema>) => void
}

export default function EditListForm({ list, handleListEdit }: EditListForm) {
  const form = useForm<z.infer<typeof listFormSchema>>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      name: list.name,
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleListEdit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your new board's name"
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
