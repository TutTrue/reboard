'use client'
import { createListAction } from '@/app/lib/serverActions'
import { BoardWithRelations } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from './ui/input'

const formSchema = z.object({
  name: z.string().min(2, { message: 'list must be at least 2 chars' }).max(255, { message: 'list must be at most 255 chars' }),
})

function CreateListModal({ board }: { board: BoardWithRelations | null }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await createListAction(data.name, board?.id as string)
    if (!res) {
      console.log(res)
      return
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-3 py-2 w-full"
                  placeholder="New list..."
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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

export default CreateListModal