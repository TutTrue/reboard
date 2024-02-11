'use client'

import { useMemo } from 'react'
import {
  HiOutlineUsers,
} from 'react-icons/hi2'

import { IInvitation } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import InvitationsViewTabBar from './InvitationsViewTabBar'

interface InvitationsViewProps {
  invitations: { sent: IInvitation[]; received: IInvitation[] }
}

export default function InvitationsView({ invitations }: InvitationsViewProps) {
  const activeReceivedInvitations = useMemo(
    () => invitations.received.filter((inv) => !inv.archived),
    [invitations.received]
  )

  return (
    <Sheet>
      <SheetTrigger className="p-1 relative hover:bg-indigo-600 rounded-md">
        <HiOutlineUsers size={25} />
        {activeReceivedInvitations.length ? (
          <span className="flex items-center justify-center w-5 h-5 text-sm bg-red-500 rounded-full absolute -top-2 -right-2">
            {invitations.received.filter((inv) => !inv.archived).length}
          </span>
        ) : (
          ''
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full sm:w-[400px]">
        <SheetTitle className="text-xl">Invitations</SheetTitle>
        <InvitationsViewTabBar invitations={invitations} />
      </SheetContent>
    </Sheet>
  )
}
