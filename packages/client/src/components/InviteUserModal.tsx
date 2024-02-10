'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { HiOutlinePlus } from 'react-icons/hi'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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
import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import { inviteUser } from '@/lib/serverActions/invitations'

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(120, { message: 'name must be at most 120 characters.' })
    .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/, {
      message: "Invalid board name, name can't contain spaces",
    }),
})

function InviteUserForm({
  boardName,
  closeModal,
}: {
  boardName: string
  closeModal: () => void
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
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

export default function InviteUserModal({ boardName }: { boardName: string }) {
  const [isModalActive, setIsModalActive] = useState(false)

  function closeModal() {
    setIsModalActive(false)
  }

  return (
    <Dialog open={isModalActive} onOpenChange={setIsModalActive}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-500 hover:bg-indigo-600 gap-1">
          <HiOutlineUserPlus size={17} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="mb-5">Invite a new member</h2>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <InviteUserForm boardName={boardName} closeModal={closeModal} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
