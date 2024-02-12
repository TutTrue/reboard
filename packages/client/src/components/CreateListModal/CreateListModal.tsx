'use client'

import { useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import CreateListForm from './CreateListForm'

export default function CreateListModal({ boardId }: { boardId: string }) {
  const [isModalActive, setIsModalActive] = useState(false)

  function closeModal() {
    setIsModalActive(false)
  }

  return (
    <Dialog open={isModalActive} onOpenChange={setIsModalActive}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-500 hover:bg-indigo-600 gap-1">
          <HiOutlinePlus size={17} />
          <span>Add list</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="mb-5">Add a list</h2>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <CreateListForm closeModal={closeModal} boardId={boardId} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
