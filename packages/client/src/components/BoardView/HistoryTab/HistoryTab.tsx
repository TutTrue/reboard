import Image from 'next/image'
import { useMemo } from 'react'
import { readTimeFromDateString, timeAgo } from '@/lib/utils'
import { IAction } from '@/types'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { HiOutlineChevronDown, HiOutlineChevronUpDown } from 'react-icons/hi2'

interface ActionTabProps {
  actions: IAction[]
}

export default function ActionTab({ actions }: ActionTabProps) {
  const actionsByDate = useMemo(() => {
    const mapByDays: { [key: string]: IAction[] } = {}
    actions.forEach((action) => {
      const date = action.createdAt.slice(0, 10)
      if (date in mapByDays) mapByDays[date].push(action)
      else mapByDays[date] = [action]
    })
    return mapByDays
  }, [actions])

  return (
    <div>
      {Object.keys(actionsByDate).map((key, index) => (
        <Collapsible key={key} className="flex flex-col pl-5" defaultOpen>
          <CollapsibleTrigger asChild>
            <button
              className={`text-gray-500 p-3 text-sm pl-5 -ml-5 text-left flex items-center gap-5 shadow-md border border-gray-300 bg-gray-50 hover:bg-white`}
            >
              <HiOutlineChevronUpDown size={20} />
              <span>Actions taken on {key}</span>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="border-l-2 border-gray-300 py-5">
              <article className="-ml-6 space-y-5">
                {actionsByDate[key].map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          action.User?.profilePictureURL ||
                          '/images/default-user.png'
                        }
                        alt="user image"
                        width={45}
                        height={45}
                        className="rounded-full border-2 border-gray-300"
                      />

                      <div className="flex flex-col">
                        <p className="text-gray-400 text-xs">
                          {readTimeFromDateString(action.createdAt)}
                        </p>
                        <h3>{action?.message}</h3>
                        <p className="text-gray-500 text-sm">
                          @{action.User?.username}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </article>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
