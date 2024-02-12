import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inviteUser } from '@/lib/serverActions/invitations'
import { inviteUserFromSchema } from '@/lib/formSchemas'

interface InviteUserFormProps {
  boardName: string
  closeModal: () => void
}

export default function InviteUserForm({
  boardName,
  closeModal,
}: InviteUserFormProps) {
  const form = useForm<z.infer<typeof inviteUserFromSchema>>({
    resolver: zodResolver(inviteUserFromSchema),
    defaultValues: {
      username: '',
    },
  })

  async function onSubmit(data: z.infer<typeof inviteUserFromSchema>) {
    const res = await inviteUser(data.username, boardName)

    if (!res.success) {
      res.error.error.issues.forEach((error) =>
        form.setError('username', { message: error.message })
      )
      return
    }

    toast.success('User invited successfully')
    closeModal()
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Input
                  className="focus:outline-indigo-500 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Add a new user to the board..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
          Submit
        </Button>
      </form>
    </Form>
  )
}
