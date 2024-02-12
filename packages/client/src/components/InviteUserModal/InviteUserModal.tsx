'use client'

import { useState } from 'react'
import { HiOutlineUserPlus } from 'react-icons/hi2'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import InviteUserForm from './InviteUserForm'

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
