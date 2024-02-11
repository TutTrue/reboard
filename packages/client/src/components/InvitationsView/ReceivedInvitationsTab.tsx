import { IInvitation } from '@/types'
import Image from 'next/image'
import { HiOutlineArchiveBox, HiOutlineCheck } from 'react-icons/hi2'
import { Button } from '../ui/button'

interface ReceivedInvitationsTabProps {
  archived?: boolean
  receivedInvitations: IInvitation[]
  handleAcceptInvitation: (id: string) => void
  handleArchiveInvitation: (id: string) => void
}

export default function ReceivedInvitationsTab({
  archived,
  receivedInvitations,
  handleAcceptInvitation,
  handleArchiveInvitation,
}: ReceivedInvitationsTabProps) {
  return (
    <div className="divide-y">
      {receivedInvitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between gap-3 py-3"
        >
          <div className="flex items-center gap-3">
            <Image
              src={
                invitation?.FromUser?.profilePictureURL ||
                '/images/default-user.png'
              }
              alt="user image"
              width={45}
              height={45}
              className="rounded-full border-2 border-white"
            />

            <div className="flex flex-col">
              <h3>
                <strong>{invitation?.FromUser?.fullName}</strong> to "
                {invitation.Board?.name}"
              </h3>
              <p className="text-gray-500 text-sm">
                @{invitation?.FromUser?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {archived ? (
              ''
            ) : (
              <Button onClick={() => handleArchiveInvitation(invitation.id)}>
                <HiOutlineArchiveBox size={19} />
              </Button>
            )}
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => handleAcceptInvitation(invitation.id)}
            >
              <HiOutlineCheck size={19} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
