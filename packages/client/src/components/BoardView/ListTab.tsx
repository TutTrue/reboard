import { BoardWithRelations } from "@/types"
import List from "./List"
import { Session } from "next-auth"

function ListTab({ board, session }: { board: BoardWithRelations, session: Session }) {
  return (
    <div className="flex gap-5 items-start w-full overflow-auto pb-5 px-1">
      {board?.List.map((list) => (
        <List key={list.id} list={list} session={session} />
      ))}
    </div>
  )
}

export default ListTab