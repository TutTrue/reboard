import { IAction } from '@/types'
import Image from 'next/image'

interface ActionTabProps {
  actions: IAction[]
}

export default function ActionTab({ actions }: ActionTabProps) {
  return (
    <div className="flex flex-col pl-5">
      <div className="border-l-2 border-indigo-600 py-5">
        <article className="-ml-6 space-y-5">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    action.User?.profilePictureURL || '/images/default-user.png'
                  }
                  alt="user image"
                  width={45}
                  height={45}
                  className="rounded-full border-2 border-indigo-600"
                />

                <div className="flex flex-col">
                  <h3>{action?.message}</h3>
                  <p className="text-gray-500 text-sm">
                    @{action.User?.username}
                  </p>
                </div>
              </div>

              <p>DATE</p>
            </div>
          ))}
        </article>
      </div>
    </div>
  )
}
