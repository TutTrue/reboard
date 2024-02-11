import { HiOutlineTrash } from 'react-icons/hi2'
import Image from 'next/image'

import { IInvitation } from '@/types'
import { Button } from '../ui/button'

interface SentInvitationsTabProps {
  sentInvitations: IInvitation[]
  handleDeleteInvitation: (id: string) => void
}

export default function SentInvitationsTab({
  sentInvitations,
  handleDeleteInvitation,
}: SentInvitationsTabProps) {
  return (
    <div className="divide-y">
      {sentInvitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between gap-3 py-3"
        >
          <div className="flex items-center gap-3">
            <Image
              src={
                invitation?.ToUser?.profilePictureURL ||
                '/images/default-user.png'
              }
              alt="user image"
              width={45}
              height={45}
              className="rounded-full border-2 border-white"
            />

            <div className="flex flex-col">
              <h3>
                <strong>{invitation?.ToUser?.fullName}</strong> to "
                {invitation.Board?.name}"
              </h3>
              <p className="text-gray-500 text-sm">
                @{invitation?.ToUser?.username}
              </p>
            </div>
          </div>

          <Button
            variant={'destructive'}
            onClick={() => handleDeleteInvitation(invitation.id)}
          >
            <HiOutlineTrash size={19} />
          </Button>
        </div>
      ))}
    </div>
  )
}
